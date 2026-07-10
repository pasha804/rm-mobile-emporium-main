# RM MOBILE SHOP — Hostinger VPS Deployment

> For GitHub + Railway deployment, see `railway-deploy.md` instead.

## What You Deploy

Two Node.js processes managed by PM2:

| Process | Port | Runs |
|---------|------|------|
| `rm-frontend` | 3000 | `.output/server/index.mjs` |
| `rm-backend` | 4000 | `backend/server.js` |

Nginx routes: `/api/*` → port 4000 · everything else → port 3000

---

## STEP 1 — SSH into Your Server

```bash
ssh root@YOUR_SERVER_IP
```

---

## STEP 2 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version   # v20.x.x
```

---

## STEP 3 — Install PM2 + Nginx

```bash
npm install -g pm2
apt install -y nginx
systemctl start nginx && systemctl enable nginx
```

---

## STEP 4 — Upload Project

### Git (recommended):
```bash
# Local machine first:
git init && git add . && git commit -m "deploy"
git remote add origin https://github.com/YOU/rm-mobile-shop.git
git push -u origin main

# On server:
apt install -y git
cd /var/www
git clone https://github.com/YOU/rm-mobile-shop.git
cd rm-mobile-shop
```

### FileZilla (SFTP alternative):
Connect: Host = IP, Protocol = SFTP, User = root
Upload project to `/var/www/rm-mobile-shop/`
Skip: `node_modules/`, `.output/`, `backend/node_modules/`, `backend/data/`

---

## STEP 5 — Install Dependencies

```bash
cd /var/www/rm-mobile-shop
npm install
cd backend && npm install && cd ..
```

---

## STEP 6 — Change Admin Password

```bash
nano ecosystem.config.cjs
```

Change: `ADMIN_PASSWORD: "rmmobile2024"` → `ADMIN_PASSWORD: "YourStrongPass!"`

`Ctrl+X` → `Y` → `Enter`

---

## STEP 7 — Build Frontend

```bash
npm run build
ls .output/server/index.mjs   # verify exists
```

---

## STEP 8 — Create Logs Directory

```bash
mkdir -p /var/www/rm-mobile-shop/logs
```

---

## STEP 9 — Start with PM2

```bash
cd /var/www/rm-mobile-shop
pm2 start ecosystem.config.cjs
pm2 status   # both should show "online"
pm2 save
pm2 startup  # run the command it prints
```

---

## STEP 10 — Configure Nginx

```bash
nano /etc/nginx/sites-available/rm-mobile-shop
```

Paste (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 50M;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_read_timeout 60s;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/rm-mobile-shop /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## STEP 11 — DNS

In your domain registrar → DNS:
- A Record: `@` → `YOUR_SERVER_IP`
- A Record: `www` → `YOUR_SERVER_IP`

Wait 15–60 min for propagation.

---

## STEP 12 — SSL (Free)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Choose option 2 (redirect HTTP to HTTPS)
certbot renew --dry-run   # verify auto-renewal
```

---

## STEP 13 — Verify

```bash
curl http://localhost:4000/api/health
# → {"ok":true,"service":"RM MOBILE SHOP API",...}
```

Open `https://yourdomain.com` → store loads ✅
Open `https://yourdomain.com/admin/login` → admin loads ✅

---

## Updating the Site

```bash
cd /var/www/rm-mobile-shop
git pull
npm run build
pm2 restart rm-frontend
# If backend changed: pm2 restart rm-backend
```

---

## PM2 Commands

```bash
pm2 status              # see all processes
pm2 logs                # live logs
pm2 logs rm-backend     # backend only
pm2 restart all         # restart both
pm2 restart rm-frontend # frontend only
```

---

## Troubleshooting

**502 Bad Gateway:**
```bash
pm2 status   # check both are "online"
pm2 logs     # check for errors
```

**Products not syncing across browsers:**
```bash
curl http://localhost:4000/api/products
cat backend/data/products.json
```

**Admin login fails:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASS"}'
# Expected: {"ok":true}
```

**Low memory (small VPS):**
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Backup Data

```bash
# On server
cp -r /var/www/rm-mobile-shop/backend/data /root/backup-$(date +%Y%m%d)

# Download to local machine
scp -r root@YOUR_IP:/var/www/rm-mobile-shop/backend/data ./backup
```

---

## Quick Reference

| Item | Location |
|------|----------|
| Public site | `https://yourdomain.com` |
| Admin panel | `https://yourdomain.com/admin/login` |
| Change password | `ecosystem.config.cjs` → `ADMIN_PASSWORD` |
| Product data | `backend/data/products.json` |
| Nginx config | `/etc/nginx/sites-available/rm-mobile-shop` |
| Change WhatsApp | `src/lib/shop.ts` → `whatsapp` field |

---

*RM MOBILE SHOP — Smart Accessories • Smart Choice*
