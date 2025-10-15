# DataPulse Human Services - Production Deployment Guide

## 🚀 Quick Deploy

Deploy the React + Express application to datapulseai.co:

```bash
cd "/home/calvin/Websites/DataPulse Human Website/DataPulse-Human-Services"
sudo bash deploy-to-production.sh
```

That's it! The script handles everything automatically.

---

## 📋 What Gets Deployed

### Architecture

**Frontend (React + Vite)**
- Static files built and served by Nginx
- Single Page Application (SPA) with React Router
- Location: `/srv/http/datapulseai/client/dist/`
- Accessible at: `https://datapulseai.co/`

**Backend (Express + Node.js)**
- API server running on port 5000
- Managed by PM2 process manager
- Location: `/srv/http/datapulseai/server/`
- Accessible at: `https://datapulseai.co/api/*`

**Key Features:**
- ✅ Advanced SEO with meta tags and structured data
- ✅ Contact form with email functionality (Nodemailer)
- ✅ HTTPS with Let's Encrypt SSL certificate
- ✅ Security headers (HSTS, CSP, X-Frame-Options, etc.)
- ✅ HTTP to HTTPS redirect
- ✅ Optimized caching strategy
- ✅ Gzip compression

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `deploy-to-production.sh` | Complete automated deployment script |
| `nginx-datapulseai.conf` | Nginx configuration for React + Express |
| `ecosystem.config.js` | PM2 process manager configuration |
| `DEPLOYMENT-README.md` | This file - deployment documentation |

---

## 🔧 What the Script Does

### Step 1: Stop Development Servers
- Checks for running dev servers on ports 3000, 3001, 5000
- Warns if any are running (they won't interfere with production)

### Step 2: Build React Frontend
- Runs `npm run build` in client directory
- Creates optimized production build in `client/dist/`
- Includes all SEO optimizations, meta tags, and assets

### Step 3: Prepare Backend
- Ensures backend dependencies are installed
- No build step needed (Node.js runs directly)

### Step 4: Create Deployment Directory
- Creates `/srv/http/datapulseai/` structure
- Backs up existing deployment if present
- Sets up logging directory for PM2

### Step 5: Deploy Files
- Copies frontend build to `/srv/http/datapulseai/client/dist/`
- Copies backend files to `/srv/http/datapulseai/server/`
- Copies `.env` file with email configuration
- Copies `node_modules` for backend
- Sets correct permissions (calvin:calvin, 755)
- Protects `.env` file (600 permissions)

### Step 6: Configure Nginx
- Backs up current nginx configuration
- Installs new configuration for React + Express stack
- Enables site if not already enabled
- Tests configuration validity
- Reloads nginx with new config

### Step 7: Stop Old PM2 Processes
- Stops any existing `datapulseai` or `datapulseai-backend` processes
- Cleans up old PM2 configurations

### Step 8: Start Backend with PM2
- Starts Express backend on port 5000
- Uses ecosystem.config.js for configuration
- Saves PM2 config for auto-start on reboot
- Verifies backend is running

### Step 9: Verify Deployment
- Checks backend API health
- Verifies nginx is running
- Confirms PM2 process is online
- Validates SSL certificate
- Tests HTTPS endpoint

---

## 🌐 URLs After Deployment

- **Main Website**: https://datapulseai.co
- **WWW**: https://www.datapulseai.co (same as main)
- **API Endpoint**: https://datapulseai.co/api/*
- **Contact Form**: https://datapulseai.co/contact

---

## 📊 Architecture Diagram

```
Internet
   ↓
[Port 443 - HTTPS]
   ↓
Nginx (datapulseai.co)
   ├─→ Static Files: /srv/http/datapulseai/client/dist/
   │   (React SPA - HTML, CSS, JS)
   │
   └─→ /api/* → Proxy to localhost:5000
                  ↓
              [Express Backend]
              (/srv/http/datapulseai/server/)
                  ↓
              [Nodemailer]
              (Sends emails to arthur@datapulseai.co)
```

---

## 🔒 Security Features

### SSL/TLS
- ✅ TLS 1.2 and 1.3 only
- ✅ Strong cipher suites
- ✅ OCSP stapling
- ✅ Certificate managed by Let's Encrypt (auto-renewal)

### HTTP Headers
- ✅ **HSTS** - Forces HTTPS for 1 year
- ✅ **CSP** - Content Security Policy
- ✅ **X-Frame-Options** - Prevents clickjacking
- ✅ **X-XSS-Protection** - XSS filter
- ✅ **X-Content-Type-Options** - Prevents MIME sniffing
- ✅ **Referrer-Policy** - Controls referrer information

### File Access Control
- ✅ Blocks access to hidden files (.env, .git, etc.)
- ✅ Blocks access to backup files (.bak, .sql, etc.)
- ✅ Restricts API caching

---

## 📝 Prerequisites

Before running the deployment:

1. **SSL Certificate** - Already obtained for datapulseai.co ✅
2. **Email Configuration** - .env file with EMAIL_* variables ✅
3. **PM2 Installed** - Should be installed globally
4. **Nginx Installed** - Should be running
5. **Node.js Installed** - Version 18+ recommended

---

## 🔄 Updating the Website

### Quick Update (Code Changes Only)

If you only changed code (not dependencies):

```bash
cd "/home/calvin/Websites/DataPulse Human Website/DataPulse-Human-Services"

# Build frontend
cd client && npm run build && cd ..

# Deploy manually
sudo cp -r client/dist/* /srv/http/datapulseai/client/dist/
sudo cp -r server/* /srv/http/datapulseai/server/

# Restart backend
pm2 restart datapulseai-backend
```

### Full Redeploy

For dependency changes or major updates:

```bash
sudo bash deploy-to-production.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check PM2 logs:**
```bash
pm2 logs datapulseai-backend --lines 100
```

**Common issues:**
- Port 5000 already in use
- Missing dependencies
- .env file not present or wrong permissions
- Database connection issues

**Solutions:**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Reinstall dependencies
cd /srv/http/datapulseai
npm ci --production

# Check .env file
ls -la /srv/http/datapulseai/.env
```

### Frontend Not Loading

**Check nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/datapulseai-error.log
```

**Common issues:**
- Nginx config syntax error
- Static files not deployed
- Wrong file permissions

**Solutions:**
```bash
# Test config
sudo nginx -t

# Check if files exist
ls -la /srv/http/datapulseai/client/dist/

# Fix permissions
sudo chown -R calvin:calvin /srv/http/datapulseai
sudo chmod -R 755 /srv/http/datapulseai
```

### Contact Form Not Sending Emails

**Check environment variables:**
```bash
cat /srv/http/datapulseai/.env
```

**Required variables:**
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=arthur@datapulseai.co
- EMAIL_PASS=<app-specific-password>
- EMAIL_TO=arthur@datapulseai.co

**Test email:**
```bash
# Check backend logs
pm2 logs datapulseai-backend | grep -i email

# Test API endpoint
curl -X POST https://datapulseai.co/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","company":"Test Co","message":"Test message"}'
```

### SSL Certificate Issues

**Check certificate:**
```bash
echo | openssl s_client -connect datapulseai.co:443 -servername datapulseai.co 2>&1 | grep subject=

# Should show: subject=CN=datapulseai.co
```

**Renew certificate if needed:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 📞 Useful Commands

### PM2 Management
```bash
pm2 status                              # View all processes
pm2 logs datapulseai-backend           # View live logs
pm2 logs datapulseai-backend --lines 100  # Last 100 lines
pm2 restart datapulseai-backend        # Restart backend
pm2 stop datapulseai-backend           # Stop backend
pm2 start datapulseai-backend          # Start backend
pm2 monit                              # Monitor resources
pm2 save                               # Save current config
```

### Nginx Management
```bash
sudo nginx -t                          # Test configuration
sudo systemctl reload nginx            # Reload config
sudo systemctl restart nginx           # Restart nginx
sudo systemctl status nginx            # Check status
sudo tail -f /var/log/nginx/datapulseai-access.log
sudo tail -f /var/log/nginx/datapulseai-error.log
```

### Testing
```bash
# Test HTTPS
curl -I https://datapulseai.co

# Test HTTP redirect
curl -I http://datapulseai.co

# Test API
curl https://datapulseai.co/api/health

# Test contact form
curl -X POST https://datapulseai.co/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Test","message":"Hello"}'

# Check SSL
openssl s_client -connect datapulseai.co:443 -servername datapulseai.co
```

### File Locations
```bash
# Deployment directory
ls -la /srv/http/datapulseai/

# Frontend build
ls -la /srv/http/datapulseai/client/dist/

# Backend files
ls -la /srv/http/datapulseai/server/

# Nginx config
cat /etc/nginx/sites-available/datapulseai

# PM2 config
cat /srv/http/datapulseai/ecosystem.config.js

# Environment variables
cat /srv/http/datapulseai/.env
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads at https://datapulseai.co
- [ ] All pages are accessible (Home, Services, About, Contact)
- [ ] SSL certificate shows padlock in browser
- [ ] HTTP automatically redirects to HTTPS
- [ ] www.datapulseai.co works (redirects to main domain)
- [ ] Contact form is visible and functional
- [ ] Contact form sends emails successfully
- [ ] Email confirmation is received by user
- [ ] Business notification email received at arthur@datapulseai.co
- [ ] All images and assets load correctly
- [ ] Mobile responsive design works
- [ ] SEO meta tags are present (view source)
- [ ] Favicon displays correctly
- [ ] No console errors in browser
- [ ] PM2 backend process is online
- [ ] Nginx logs show no errors
- [ ] Backend API responds at /api/health

---

## 🎯 Performance Optimizations

The deployment includes:

- ✅ **Gzip Compression** - Reduces file sizes by ~70%
- ✅ **Asset Caching** - Static files cached for 365 days
- ✅ **Image Optimization** - Properly sized favicons
- ✅ **Minified Code** - React build is minified
- ✅ **HTTP/2** - Faster parallel loading
- ✅ **CDN-ready** - Static files can be moved to CDN

---

## 🚨 Emergency Rollback

If deployment fails and site is down:

```bash
# 1. Stop the broken backend
pm2 stop datapulseai-backend

# 2. Restore nginx backup
sudo cp /etc/nginx/sites-available/datapulseai.backup-YYYYMMDD-HHMMSS /etc/nginx/sites-available/datapulseai
sudo nginx -t
sudo systemctl reload nginx

# 3. Restore deployment backup
sudo rm -rf /srv/http/datapulseai
sudo cp -r /srv/http/datapulseai-backup-YYYYMMDD-HHMMSS /srv/http/datapulseai

# 4. Restart old backend
pm2 restart datapulseai-backend
```

---

## 📧 Email Configuration

The contact form requires Gmail App-Specific Password:

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate new app password for "Mail"
5. Add to `.env` file as EMAIL_PASS

---

## 🎉 Success!

Once deployed, your website will be live at:

**https://datapulseai.co**

With all features:
- ✅ Modern React frontend
- ✅ Advanced SEO optimization
- ✅ Functional contact form
- ✅ Email notifications
- ✅ Secure HTTPS
- ✅ Professional design
- ✅ Mobile responsive
- ✅ Fast performance

---

**Need help?** Check the troubleshooting section or review the logs:
- PM2: `pm2 logs datapulseai-backend`
- Nginx: `sudo tail -f /var/log/nginx/datapulseai-error.log`

**Last Updated**: 2025-10-13
