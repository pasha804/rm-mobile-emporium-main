/**
 * PM2 Ecosystem Config — RM MOBILE SHOP
 * Runs BOTH the frontend (SSR) and the backend API on Hostinger.
 *
 * ─── FIRST TIME SETUP ON HOSTINGER ────────────────────────────────────────
 * 1. Upload the entire project folder to your Hostinger VPS
 * 2. SSH into the server
 * 3. cd /path/to/rm-mobile-emporium
 * 4. npm install           (frontend deps)
 * 5. cd backend && npm install && cd ..   (backend deps)
 * 6. npm run build         (builds the frontend)
 * 7. pm2 start ecosystem.config.cjs
 * 8. pm2 save
 * 9. pm2 startup           (auto-start on reboot)
 *
 * ─── NGINX CONFIG (add to your Hostinger nginx.conf or site config) ────────
 * server {
 *   listen 80;
 *   server_name yourdomain.com;
 *
 *   # Proxy API to backend Express server
 *   location /api {
 *     proxy_pass http://localhost:4000;
 *     proxy_http_version 1.1;
 *     proxy_set_header Host $host;
 *     proxy_set_header X-Real-IP $remote_addr;
 *   }
 *
 *   # Proxy everything else to the frontend SSR server
 *   location / {
 *     proxy_pass http://localhost:3000;
 *     proxy_http_version 1.1;
 *     proxy_set_header Host $host;
 *     proxy_set_header X-Real-IP $remote_addr;
 *     proxy_set_header Upgrade $http_upgrade;
 *     proxy_set_header Connection 'upgrade';
 *   }
 * }
 */
module.exports = {
  apps: [
    // ── FRONTEND (TanStack Start SSR) ───────────────────────────────────────
    {
      name: "rm-frontend",
      script: ".output/server/index.mjs",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
        VITE_API_URL: "",   // Empty = use /api (same domain, proxied by Nginx)
      },
      error_file: "./logs/frontend-error.log",
      out_file:   "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },

    // ── BACKEND (Express API + JSON file storage) ───────────────────────────
    {
      name: "rm-backend",
      script: "backend/server.js",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "rmmobile2024",   // ← Change this before deploying!
      },
      error_file: "./logs/backend-error.log",
      out_file:   "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
