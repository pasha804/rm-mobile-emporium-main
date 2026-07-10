# RM MOBILE SHOP — GitHub + Railway Deployment Guide

## Overview

One GitHub repo → Two Railway services:

```
GitHub: github.com/YOU/rm-mobile-shop  (one repo)
         │
         ├──── Railway Service 1: rm-backend
         │     Root: /backend
         │     Start: node server.js
         │     Port: auto (Railway assigns)
         │     URL: https://rm-backend-xxxx.up.railway.app
         │
         └──── Railway Service 2: rm-frontend
               Root: /  (project root)
               Build: npm install && npm run build
               Start: node .output/server/index.mjs
               URL: https://rm-frontend-xxxx.up.railway.app
               Env: API_BACKEND_URL = https://rm-backend-xxxx.up.railway.app
```

---

## STEP 1 — Push to GitHub

### On your local machine (Windows PowerShell):

```powershell
cd "d:\Clients website\rm-mobile-emporium-main\rm-mobile-emporium-main"

# Initialize git
git init
git add .
git commit -m "RM Mobile Shop - production ready"

# Create repo on GitHub first at https://github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/rm-mobile-shop.git
git branch -M main
git push -u origin main
```

> **Note:** `backend/data/` is in `.gitignore` — data files are NOT stored in git.
> On Railway, products save to an ephemeral filesystem (see Step 5 for persistence).

---

## STEP 2 — Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account (free plan available)
3. Click **"New Project"**

---

## STEP 3 — Deploy the Backend (API Server)

### 3a — Create backend service

1. In Railway, click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `rm-mobile-shop` repository
3. Railway will detect it and ask for the service name — call it `rm-backend`

### 3b — Set the root directory

1. Go to the service Settings
2. Under **"Source"** → **"Root Directory"** → type: `backend`
3. This tells Railway to treat the `backend/` folder as its own Node.js app

### 3c — Set environment variables

In Railway → `rm-backend` service → **Variables** tab, add:

```
PORT            = 4000
ADMIN_USERNAME  = admin
ADMIN_PASSWORD  = YourStrongPassword2024!
NODE_ENV        = production
```

> ⚠️ Change ADMIN_PASSWORD from the default!

### 3d — Deploy

Railway auto-deploys. Wait for the green ✓ status.

### 3e — Get your backend URL

Go to `rm-backend` → **Settings** → **Networking** → **Public Networking** → Enable.

Copy the URL. It looks like:
```
https://rm-backend-production-xxxx.up.railway.app
```

**Test it:**
```
https://rm-backend-production-xxxx.up.railway.app/api/health
```
Should return: `{"ok":true,"service":"RM MOBILE SHOP API",...}`

---

## STEP 4 — Deploy the Frontend

### 4a — Add a new service to the same Railway project

1. In the same Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select the same `rm-mobile-shop` repo again
3. Name it `rm-frontend`

### 4b — Root directory stays at project root

The frontend's root directory should be `/` (leave blank / default)

### 4c — Set environment variables

In Railway → `rm-frontend` service → **Variables** tab, add:

```
API_BACKEND_URL = https://rm-backend-production-xxxx.up.railway.app
PORT            = 3000
NODE_ENV        = production
```

> Replace the URL with your actual backend URL from Step 3e.

### 4d — Set build and start commands

In **Settings** → **Build**:
```
Build Command:  npm install && npm run build
Start Command:  node .output/server/index.mjs
```

### 4e — Deploy

Railway builds and deploys. The build takes 2–3 minutes.

### 4f — Get your frontend URL

Go to `rm-frontend` → **Settings** → **Networking** → Enable Public Networking.

Your site is live at:
```
https://rm-frontend-production-xxxx.up.railway.app
```

---

## STEP 5 — Custom Domain (Optional)

### On Railway:
1. `rm-frontend` → Settings → Networking → Custom Domain
2. Add: `yourdomain.com` and `www.yourdomain.com`
3. Railway gives you CNAME records to add in your DNS

### In your domain registrar:
Add the CNAME records Railway provides. SSL is handled automatically.

---

## STEP 6 — ⚠️ Data Persistence on Railway

Railway's filesystem is **ephemeral** — when the service restarts, any files written to `backend/data/` are lost. This means products saved via admin will disappear on deploy.

### Option A: Railway Volume (Recommended — Free Tier Available)

1. In Railway → `rm-backend` service → **"+ New Volume"**
2. Set Mount Path: `/app/backend/data`
3. This creates a persistent disk that survives restarts

### Option B: Use an External Database

Replace the JSON file storage in `backend/server.js` with a cloud DB:

**MongoDB Atlas (Free):**
```bash
npm install mongoose
# Replace readJson/writeJson with mongoose models
```

**Supabase (Free PostgreSQL):**
```bash
npm install @supabase/supabase-js
```

**PlanetScale MySQL:**
```bash
npm install @planetscale/database
```

For a shop managing ~20–50 products, MongoDB Atlas free tier is the easiest.

---

## Environment Variables Summary

### Backend Service (rm-backend)
| Variable | Value | Required |
|----------|-------|----------|
| `PORT` | `4000` | Yes |
| `ADMIN_USERNAME` | `admin` | Yes |
| `ADMIN_PASSWORD` | `YourStrongPassword` | Yes — change this! |
| `NODE_ENV` | `production` | Yes |

### Frontend Service (rm-frontend)
| Variable | Value | Required |
|----------|-------|----------|
| `API_BACKEND_URL` | `https://rm-backend-xxxx.up.railway.app` | Yes |
| `PORT` | `3000` | Yes |
| `NODE_ENV` | `production` | Yes |

---

## How the API Proxy Works on Railway

```
Browser → https://rm-frontend.up.railway.app/api/products
              ↓
         Frontend (TanStack Start, port 3000)
         src/server.ts intercepts /api/*
         reads: process.env.API_BACKEND_URL
              ↓
         Proxies to: https://rm-backend.up.railway.app/api/products
              ↓
         Express reads: backend/data/products.json
              ↓
         Returns JSON → Frontend → Browser ✅
```

No CORS issues. No port numbers in the browser. Clean URLs everywhere.

---

## Updating After Code Changes

### Push to GitHub:
```bash
git add .
git commit -m "Update: description of change"
git push
```

Railway **automatically redeploys** both services when you push to `main` branch.

---

## Troubleshooting

### Frontend shows "API server unavailable"
→ Check `API_BACKEND_URL` env var is set correctly in Railway frontend variables
→ Check backend service is "Active" in Railway dashboard
→ Visit `https://your-backend.up.railway.app/api/health` directly

### Admin login fails
→ Check `ADMIN_PASSWORD` in backend Railway variables
→ Make sure it matches what you're typing

### Products not persisting after redeploy
→ Railway filesystem is ephemeral
→ Add a Railway Volume to `rm-backend` → mount at `/app/backend/data`

### Build fails on Railway
```
# Check build logs in Railway dashboard
# Common fix: make sure node_modules is in .gitignore
```

### Port conflicts
Railway assigns ports dynamically. The app reads `process.env.PORT`.
The frontend's `src/server.ts` and backend's `server.js` both use `process.env.PORT || 4000/3000` — this is already correct.

---

## Free Tier Limits (Railway)

Railway's free plan ($5 trial credit, then $5/month Hobby plan):
- 512MB RAM per service
- Shared CPU
- 1GB disk (Volumes cost extra)
- 100GB bandwidth/month
- Auto-sleep after inactivity (Hobby plan keeps awake)

For a real business website with customers ordering daily, upgrade to the **Hobby plan ($5/month)** — it keeps services always-on.

---

## Alternative: Hostinger VPS (Better for Production)

If you need **guaranteed uptime**, **persistent storage**, and **full control**:

| | Railway | Hostinger VPS |
|--|---------|---------------|
| Cost | $5/month (Hobby) | $4–8/month |
| Storage | Ephemeral (need Volume) | Persistent disk |
| Setup | 10 minutes | 30 minutes |
| Control | Limited | Full root access |
| Auto-deploy | ✅ Git push | Manual |
| SSL | ✅ Auto | Let's Encrypt |

See `hostingerprocess.md` for the Hostinger guide.

---

*RM MOBILE SHOP — Smart Accessories • Smart Choice*
