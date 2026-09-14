#!/bin/bash

echo "====================================="
echo "Water Tanker System - Deployment Script"
echo "====================================="

echo ""
echo "Step 1: Building React frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Failed to build React app"
    exit 1
fi
echo "✓ React build complete"

echo ""
echo "Step 2: Creating deployment package..."
cd ..
mkdir -p deployment
cp -r server/* deployment/
cp -r client/build deployment/
cp server/.env.production deployment/.env
echo "✓ Deployment package ready"

echo ""
echo "Step 3: Creating deployment archive..."
tar -czf water-tanker-deployment.tar.gz deployment/
echo "✓ Archive created: water-tanker-deployment.tar.gz"

echo ""
echo "====================================="
echo "Deployment package ready!"
echo "====================================="
echo ""
echo "Upload water-tanker-deployment.tar.gz to your server"
echo "and follow the DEPLOYMENT_GUIDE.md instructions"
echo ""
