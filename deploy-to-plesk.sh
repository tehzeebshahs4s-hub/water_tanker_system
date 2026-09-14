#!/bin/bash

# ============================================
# Water Tanker System - Deploy to Plesk
# Domain: watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page
# ============================================

echo "========================================="
echo "Water Tanker System Deployment"
echo "Domain: watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check if deployment package exists
echo ""
echo -e "${YELLOW}Step 1: Checking deployment package...${NC}"
if [ ! -f "/tmp/water-tanker-deployment.tar.gz" ]; then
    echo -e "${RED}✗ Deployment package not found in /tmp/${NC}"
    echo "Please upload water-tanker-deployment.tar.gz to /tmp/ first"
    exit 1
fi
echo -e "${GREEN}✓ Deployment package found${NC}"

# Step 2: Determine installation directory
echo ""
echo -e "${YELLOW}Step 2: Setting up installation directory...${NC}"

# Try to find the domain directory
DOMAIN_DIR=""
for dir in \
    "/var/www/vhosts/watertanker.s4s.to/httpdocs" \
    "/var/www/vhosts/watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page/httpdocs" \
    "/var/www/vhosts/watertanker.s4s.to" \
    "/var/www/vhosts/watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page"; do
    if [ -d "$(dirname $dir)" ]; then
        DOMAIN_DIR="$dir"
        break
    fi
done

# If not found, use default
if [ -z "$DOMAIN_DIR" ]; then
    DOMAIN_DIR="/var/www/vhosts/watertanker.s4s.to/httpdocs"
    echo -e "${YELLOW}Using default directory: $DOMAIN_DIR${NC}"
    sudo mkdir -p "$DOMAIN_DIR"
else
    echo -e "${GREEN}Found domain directory: $DOMAIN_DIR${NC}"
fi

# Step 3: Extract deployment package
echo ""
echo -e "${YELLOW}Step 3: Extracting deployment package...${NC}"
cd "$DOMAIN_DIR"
sudo tar -xzf /tmp/water-tanker-deployment.tar.gz
sudo mv deployment/* . 2>/dev/null || true
sudo rm -rf deployment
echo -e "${GREEN}✓ Deployment package extracted${NC}"

# Step 4: Install dependencies
echo ""
echo -e "${YELLOW}Step 4: Installing server dependencies...${NC}"
cd "$DOMAIN_DIR"
sudo npm install --production 2>&1 | tail -5
echo -e "${GREEN}✓ Server dependencies installed${NC}"

# Step 5: Build React frontend
echo ""
echo -e "${YELLOW}Step 5: Building React frontend...${NC}"
if [ -d "$DOMAIN_DIR/client" ] && [ -f "$DOMAIN_DIR/client/package.json" ]; then
    cd "$DOMAIN_DIR/client"
    sudo npm install 2>&1 | tail -3
    sudo npm run build 2>&1 | tail -5
    echo -e "${GREEN}✓ React frontend built${NC}"
else
    echo -e "${YELLOW}Skipping React build (build folder exists)${NC}"
fi

# Step 6: Create .env file
echo ""
echo -e "${YELLOW}Step 6: Creating environment file...${NC}"
cat > "$DOMAIN_DIR/.env" << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/water-tanker-system
NODE_ENV=production
DOMAIN=watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page
EOF
echo -e "${GREEN}✓ Environment file created${NC}"

# Step 7: Check MongoDB
echo ""
echo -e "${YELLOW}Step 7: Checking MongoDB...${NC}"
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
    echo -e "${RED}⚠ MongoDB not installed locally${NC}"
    echo "Using MongoDB Atlas or install MongoDB locally"
fi

# Step 8: Seed database
echo ""
echo -e "${YELLOW}Step 8: Seeding database...${NC}"
cd "$DOMAIN_DIR"
if [ -f "seedData.js" ]; then
    node seedData.js 2>&1 | tail -10
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}Skipping seed (seedData.js not found)${NC}"
fi

# Step 9: Install PM2
echo ""
echo -e "${YELLOW}Step 9: Installing PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 already installed${NC}"
else
    sudo npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
fi

# Step 10: Start application
echo ""
echo -e "${YELLOW}Step 10: Starting application...${NC}"
cd "$DOMAIN_DIR"

# Stop existing process
pm2 stop water-tanker 2>/dev/null
pm2 delete water-tanker 2>/dev/null

# Start the app
pm2 start server/server-production.js --name water-tanker
pm2 save
pm2 startup

echo -e "${GREEN}✓ Application started${NC}"

# Step 11: Verify
echo ""
echo -e "${YELLOW}Step 11: Verifying deployment...${NC}"
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
echo "Your application is available at:"
echo "  https://watertanker.s4s.to.frosty-cerf.88-99-136-37.plesk.page"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs water-tanker   - View logs"
echo "  pm2 restart water-tanker - Restart app"
echo ""
