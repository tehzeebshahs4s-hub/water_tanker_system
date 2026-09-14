#!/bin/bash

# ============================================
# Water Tanker System - Server Setup Script
# Run this on your Plesk server via SSH
# ============================================

echo "========================================="
echo "Water Tanker System - Server Setup"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo ""
echo -e "${YELLOW}Step 1: Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Step 2: Check npm
echo ""
echo -e "${YELLOW}Step 2: Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found. Installing...${NC}"
    sudo apt-get install -y npm
fi

# Step 3: Install PM2
echo ""
echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 already installed${NC}"
else
    sudo npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
fi

# Step 4: Setup application directory
echo ""
echo -e "${YELLOW}Step 4: Setting up application...${NC}"
APP_DIR="/var/www/vhosts/watertanker.s4s.to/httpdocs"

# Check if directory exists
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Creating application directory...${NC}"
    sudo mkdir -p "$APP_DIR"
fi

echo -e "${GREEN}✓ Application directory ready: $APP_DIR${NC}"

# Step 5: Extract deployment package
echo ""
echo -e "${YELLOW}Step 5: Extracting deployment package...${NC}"
if [ -f "/tmp/water-tanker-deployment.tar.gz" ]; then
    cd "$APP_DIR"
    sudo tar -xzf /tmp/water-tanker-deployment.tar.gz
    echo -e "${GREEN}✓ Deployment package extracted${NC}"
else
    echo -e "${RED}✗ Deployment package not found at /tmp/${NC}"
    echo "Please upload water-tanker-deployment.tar.gz to /tmp/ first"
    exit 1
fi

# Step 6: Install dependencies
echo ""
echo -e "${YELLOW}Step 6: Installing server dependencies...${NC}"
cd "$APP_DIR"
sudo npm install --production 2>&1 | tail -5
echo -e "${GREEN}✓ Server dependencies installed${NC}"

# Step 7: Build React frontend (if source exists)
echo ""
echo -e "${YELLOW}Step 7: Building React frontend...${NC}"
if [ -d "$APP_DIR/client" ] && [ -f "$APP_DIR/client/package.json" ]; then
    cd "$APP_DIR/client"
    sudo npm install 2>&1 | tail -3
    sudo npm run build 2>&1 | tail -5
    echo -e "${GREEN}✓ React frontend built${NC}"
else
    echo -e "${YELLOW}Skipping React build (build folder should exist)${NC}"
fi

# Step 8: Create .env file
echo ""
echo -e "${YELLOW}Step 8: Creating environment file...${NC}"
cat > "$APP_DIR/.env" << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/water-tanker-system
NODE_ENV=production
EOF
echo -e "${GREEN}✓ Environment file created${NC}"

# Step 9: Setup MongoDB (check if running)
echo ""
echo -e "${YELLOW}Step 9: Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}Starting MongoDB...${NC}"
        sudo systemctl start mongod
        sudo systemctl enable mongod
        echo -e "${GREEN}✓ MongoDB started${NC}"
    fi
else
    echo -e "${RED}⚠ MongoDB not installed${NC}"
    echo "Install MongoDB or use MongoDB Atlas"
    echo "For Atlas, update MONGODB_URI in $APP_DIR/.env"
fi

# Step 10: Seed database
echo ""
echo -e "${YELLOW}Step 10: Seeding database...${NC}"
cd "$APP_DIR"
if [ -f "seedData.js" ]; then
    node seedData.js 2>&1 | tail -10
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}Skipping seed (seedData.js not found)${NC}"
fi

# Step 11: Start application with PM2
echo ""
echo -e "${YELLOW}Step 11: Starting application...${NC}"
cd "$APP_DIR"

# Stop existing process if running
pm2 stop water-tanker 2>/dev/null
pm2 delete water-tanker 2>/dev/null

# Start the app
pm2 start server/server-production.js --name water-tanker
pm2 save
pm2 startup

echo -e "${GREEN}✓ Application started${NC}"

# Step 12: Verify
echo ""
echo -e "${YELLOW}Step 12: Verifying deployment...${NC}"
sleep 3

if curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✓ Application is running on port 3000${NC}"
else
    echo -e "${RED}✗ Application might have issues${NC}"
    echo "Check logs: pm2 logs water-tanker"
fi

echo ""
echo "========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Your application should be available at:"
echo "  https://www.watertanker.s4s.to"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs water-tanker   - View logs"
echo "  pm2 restart water-tanker - Restart app"
echo ""
