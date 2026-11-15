import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import { SocksProxyAgent } from 'socks-proxy-agent';

const root = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(root, 'dist');

try {
  const envFile = await fs.readFile(path.join(root, '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch {
  // Environment variables may be supplied by the hosting platform instead.
}

const port = Number(process.env.PORT || 3000);
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const socksProxyUrl = process.env.TELEGRAM_SOCKS5H_URL;
const siteUrl = process.env.SITE_URL || '';
const maxBodySize = 32 * 1024;
const rateWindowMs = 60_000;
const rateLimit = 10;
const requests = new Map();

if (!telegramToken || !telegramChatId || !socksProxyUrl) {
  console.warn('Telegram is not configured. Set TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID and TELEGRAM_SOCKS5H_URL.');
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function clientIp(request) {
  return request.headers['x-forwarded-for']?.split(',')[0]?.trim() || request.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((timestamp) => now - timestamp < rateWindowMs);
  recent.push(now);
  requests.set(ip, recent);
  return recent.length > rateLimit;
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBodySize) {
        reject(new Error('body_too_large'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    request.on('error', reject);
  });
}

function clean(value, max = 500) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function formatLead(data) {
  const kind = data.kind === 'estimate' ? 'Расчёт перевода' : 'Заявка на перевод';
  const amount = Number(data.amount);
  const received = clean(data.received, 80);
  const rate = Number(data.rate);
  const utm = data.utm && typeof data.utm === 'object'
    ? Object.entries(data.utm).filter(([, value]) => value).map(([key, value]) => `${key}: ${clean(value, 120)}`).join(', ')
    : '';

  return [
    `🟢 ${kind} YuanPay`,
    `Услуга: ${clean(data.service, 80)} — ${clean(data.output, 120)}`,
    `Сумма: ${Number.isFinite(amount) ? amount.toLocaleString('ru-RU') : 'не указана'} ₽`,
    `Получатель: ${received || 'не рассчитан'} CNY`,
    `Курс: 1 CNY = ${Number.isFinite(rate) ? rate : 'не указан'} ₽`,
    `Контакт: ${clean(data.contact, 160) || 'не указан'}`,
    utm ? `Реклама: ${utm}` : '',
    `Страница: ${clean(data.pageUrl || siteUrl, 500)}`,
    data.referrer ? `Источник: ${clean(data.referrer, 500)}` : '',
  ].filter(Boolean).join('\n');
}

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    if (!telegramToken || !telegramChatId || !socksProxyUrl) return reject(new Error('telegram_not_configured'));

    const body = new URLSearchParams({
      chat_id: telegramChatId,
      text,
      disable_web_page_preview: 'true',
    }).toString();
    const request = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${telegramToken}/sendMessage`,
      method: 'POST',
      agent: new SocksProxyAgent(socksProxyUrl),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': Buffer.byteLength(body),
      },
      timeout: 15_000,
    }, (response) => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { responseBody += chunk; });
      response.on('end', () => {
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) resolve();
        else reject(new Error(`telegram_http_${response.statusCode}: ${responseBody.slice(0, 300)}`));
      });
    });
    request.on('timeout', () => request.destroy(new Error('telegram_timeout')));
    request.on('error', reject);
    request.end(body);
  });
}

async function serveStatic(request, response) {
  const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = requestedPath === '/' ? '/index.html' : requestedPath;
  const filePath = path.resolve(distDir, `.${relativePath}`);
  if (!filePath.startsWith(`${distDir}${path.sep}`)) return sendJson(response, 400, { error: 'invalid_path' });

  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) throw new Error('not_file');
    response.writeHead(200, {
      'content-type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'cache-control': path.extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    if (requestedPath !== '/') return serveStatic({ ...request, url: '/' }, response);
    sendJson(response, 404, { error: 'not_found' });
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'GET' && requestUrl.pathname === '/health') return sendJson(response, 200, { ok: true });

  if (request.method === 'POST' && requestUrl.pathname === '/api/lead') {
    if (isRateLimited(clientIp(request))) return sendJson(response, 429, { error: 'too_many_requests' });
    try {
      const data = await readJson(request);
      if (!data || !clean(data.contact, 160) || !clean(data.service, 80)) return sendJson(response, 400, { error: 'contact_and_service_required' });
      await sendTelegram(formatLead(data));
      return sendJson(response, 200, { ok: true });
    } catch (error) {
      console.error('Lead delivery failed:', error.message);
      const status = error.message === 'body_too_large' || error.message === 'invalid_json' ? 400 : 502;
      return sendJson(response, status, { error: 'lead_delivery_failed' });
    }
  }

  if (request.method === 'GET') return serveStatic(request, response);
  return sendJson(response, 405, { error: 'method_not_allowed' });
});

server.listen(port, () => console.log(`YuanPay server listening on http://localhost:${port}`));

