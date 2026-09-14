# Water Tanker System - Deployment Guide

## Overview

This guide will help you deploy the Water Tanker Distribution Optimization System to your Plesk server.

## Prerequisites

- Plesk Panel Access
- Node.js 14+ installed on server
- MongoDB installed on server (or use MongoDB Atlas)
- SSH access to server (optional)

## Deployment Methods

### Method 1: Using Plesk Panel (Recommended)

#### Step 1: Login to Plesk
1. Go to: https://88.99.136.37:8443/login_up.php
2. Enter your credentials
3. Click "Login"

#### Step 2: Create Node.js App
1. Go to **Domains** → **watertanker.s4s.to**
2. Click **Node.js** (if available)
3. Or go to **Extensions** → Install "Node.js" if not installed

#### Step 3: Upload Files
1. Go to **File Manager**
2. Navigate to the domain folder
3. Upload the entire project folder

#### Step 4: Configure Node.js
1. Set Node.js version: 14.x or higher
2. Set Application mode: Production
3. Set Application root: `/httpdocs`
4. Set Application startup file: `server/server-production.js`

#### Step 5: Install Dependencies via SSH
```bash
cd /var/www/vhosts/watertanker.s4s.to/httpdocs
npm install --production
cd client
npm install
npm run build
```

#### Step 6: Setup MongoDB
Option A: Local MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

Option B: MongoDB Atlas (Recommended)
1. Create free account at mongodb.com
2. Create a cluster
3. Get connection string
4. Update `.env` file

#### Step 7: Seed Database
```bash
cd /var/www/vhosts/watertanker.s4s.to/httpdocs
node server/seedData.js
```

#### Step 8: Start Application
```bash
cd /var/www/vhosts/watertanker.s4s.to/httpdocs
pm2 start server/server-production.js --name water-tanker
pm2 save
pm2 startup
```

### Method 2: Using SSH (Advanced)

#### Step 1: SSH into Server
```bash
ssh root@88.99.136.37
```

#### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 3: Install PM2
```bash
sudo npm install -g pm2
```

#### Step 4: Clone/Upload Project
```bash
cd /var/www/vhosts/watertanker.s4s.to
# Upload your project files here
```

#### Step 5: Configure and Build
```bash
cd httpdocs

# Install server dependencies
cd server
npm install --production

# Build React frontend
cd ../client
npm install
npm run build

# Seed database
cd ../server
node seedData.js
```

#### Step 6: Start with PM2
```bash
cd /var/www/vhosts/watertanker.s4s.to/httpdocs
pm2 start server/server-production.js --name water-tanker
pm2 save
pm2 startup
```

## Environment Variables

Create `.env` file in server directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/water-tanker-system
NODE_ENV=production
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/water-tanker-system
```

## Domain Configuration

### In Plesk Panel:

1. Go to **Domains** → **watertanker.s4s.to**
2. Go to **Hosting Settings**
3. Set Document Root to: `/httpdocs`
4. Enable SSL/TLS certificate (Let's Encrypt)

### DNS Settings:

Ensure these DNS records exist:
```
Type    Name                    Value
A       watertanker.s4s.to      88.99.136.37
A       www.watertanker.s4s.to  88.99.136.37
```

## SSL Certificate

1. Go to **Domains** → **watertanker.s4s.to** → **SSL/TLS Certificates**
2. Click **Let's Encrypt**
3. Enter email
4. Check "Secure the domain"
5. Click **Get free certificate**

## Troubleshooting

### Application not starting:
```bash
pm2 logs water-tanker
pm2 restart water-tanker
```

### Port already in use:
```bash
pm2 stop all
pm2 delete all
pm2 start server/server-production.js --name water-tanker
```

### MongoDB connection error:
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Permission issues:
```bash
sudo chown -R plesk:plesk /var/www/vhosts/watertanker.s4s.to
chmod -R 755 /var/www/vhosts/watertanker.s4s.to/httpdocs
```

## Testing Deployment

1. Visit: http://watertanker.s4s.to
2. Test API: http://watertanker.s4s.to/api/health
3. Test algorithms: http://watertanker.s4s.to/api/analytics/dashboard

## URLs After Deployment

- **Frontend:** https://www.watertanker.s4s.to
- **API:** https://www.watertanker.s4s.to/api
- **Health Check:** https://www.watertanker.s4s.to/api/health

## Support

If you encounter issues:
1. Check Plesk error logs
2. Check PM2 logs: `pm2 logs`
3. Verify MongoDB is running
4. Check firewall settings
