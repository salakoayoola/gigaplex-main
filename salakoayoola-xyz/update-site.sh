#!/bin/bash
set -e

echo "🚀 Updating Ayoola Salako Portfolio..."
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Run this script from project root."
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q ayoola-portfolio; then
    echo "⚠️  Container not running. Starting it first..."
    docker-compose up -d
    sleep 3
fi

echo "📦 Building site locally..."
cd web/
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
cd ..

echo "📋 Copying files to container..."
docker cp web/dist/. ayoola-portfolio:/usr/share/nginx/html/

echo "🔄 Restarting nginx..."
docker-compose restart

echo ""
echo "✅ Site updated successfully!"
echo "🌐 Visit: https://$(grep DOMAIN .env | cut -d '=' -f2)"
echo ""
echo "📊 To view logs: docker-compose logs -f"