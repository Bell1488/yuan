# Деплой YuanPay на VPS и домен `yuanpay.pro`

Все команды ниже выполняются от пользователя `root` на Ubuntu 22.04/24.04.

## 1. DNS

В панели домена создайте записи:

```text
@     A     IP_АДРЕС_VPS
www   A     IP_АДРЕС_VPS
```

Проверьте:

```bash
nslookup yuanpay.pro
nslookup www.yuanpay.pro
```

## 2. VPS и пакеты

```bash
ssh root@IP_АДРЕС_VPS
apt update && apt upgrade -y
apt install -y nginx git curl ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## 3. Node.js и PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
node --version
npm --version
```

## 4. Клонирование проекта

```bash
mkdir -p /var/www/yuanpay
cd /var/www/yuanpay
git clone https://github.com/Clerk0808/yuanpay.git .
npm ci
```

## 5. Переменные окружения

Создайте файл `/var/www/yuanpay/.env`:

```env
PORT=3000
SITE_URL=https://yuanpay.pro
TELEGRAM_BOT_TOKEN=ТОКЕН_БОТА
TELEGRAM_CHAT_ID=ID_ЧАТА_ИЛИ_КАНАЛА
TELEGRAM_SOCKS5H_URL=socks5h://user:password@proxy.example.com:1080
VITE_LEAD_ENDPOINT=/api/lead
VITE_YANDEX_METRIKA_ID=ID_СЧЕТЧИКА
VITE_TELEGRAM_USERNAME=username_МЕНЕДЖЕРА_БЕЗ_@
```

Секреты не публикуйте в GitHub:

```bash
chmod 600 /var/www/yuanpay/.env
```

## 6. Сборка и запуск

```bash
cd /var/www/yuanpay
npm run build
pm2 start server.mjs --name yuanpay --cwd /var/www/yuanpay
pm2 save
pm2 startup
```

Команду, которую выведет `pm2 startup`, нужно выполнить отдельно от root. Затем:

```bash
pm2 save
pm2 status
curl http://127.0.0.1:3000/health
```

Ожидаемый ответ: `{"ok":true}`.

## 7. Nginx

Создайте файл `/etc/nginx/sites-available/yuanpay.pro`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yuanpay.pro www.yuanpay.pro;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Включите сайт:

```bash
ln -sfn /etc/nginx/sites-available/yuanpay.pro /etc/nginx/sites-enabled/yuanpay.pro
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 8. HTTPS

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yuanpay.pro -d www.yuanpay.pro
certbot renew --dry-run
```

Проверка:

```bash
curl -I https://yuanpay.pro
curl https://yuanpay.pro/health
```

## 9. Обновление

```bash
cd /var/www/yuanpay
git pull origin main
npm ci
npm run build
pm2 restart yuanpay
pm2 logs yuanpay --lines 100
```

Кнопка «Получить расчёт в Telegram» открывает чат менеджера с готовым текстом и одновременно отправляет данные серверу. Кнопка «Оставить заявку» открывает чат с текстом заявки и отправляет её Telegram-боту через SOCKS5h.

Если заявка не приходит, смотрите `pm2 logs yuanpay` и проверяйте `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_SOCKS5H_URL`.
