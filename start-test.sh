#!/bin/bash

set -e

echo "🔍 Detecting versions..."

# Get latest version safely
LATEST_VERSION=$(ls -d [0-9][0-9]-react 2>/dev/null | sort -V | tail -1 | sed 's/-react//')

if [ -z "$LATEST_VERSION" ]; then
  echo "No existing versions found. Starting with 00"
  LATEST_VERSION=00
fi

# Convert to number (avoid octal issues)
LATEST_NUM=$((10#$LATEST_VERSION))
NEXT_NUM=$((LATEST_NUM + 1))

# Format with leading zero
NEXT_VERSION=$(printf "%02d" "$NEXT_NUM")
NEXT_FOLDER="${NEXT_VERSION}-react"

echo "  Latest: ${LATEST_VERSION}-react"
echo "  Creating: ${NEXT_FOLDER}"

# Create structure
mkdir -p "$NEXT_FOLDER/src/test"
mkdir -p "$NEXT_FOLDER/src/component/app"
mkdir -p "$NEXT_FOLDER/src/component/products"
mkdir -p "$NEXT_FOLDER/public"

if [ -d "00-base" ]; then
  echo "📋 Copying base files..."

  # Copy all base files (without node_modules)
  rsync -av --exclude=node_modules 00-base/ "$NEXT_FOLDER/"

  echo "📄 Copying source files..."

  # Copy main files
  cp 00-base/src/main.tsx "$NEXT_FOLDER/src/"
  cp 00-base/src/main.css "$NEXT_FOLDER/src/"

  # Copy App component
  if [ -d "00-base/src/component/app" ]; then
    cp -r 00-base/src/component/app/* "$NEXT_FOLDER/src/component/app/"
    echo "  ✅ App component copied"
  fi

  # Copy Products component  
  if [ -d "00-base/src/component/products" ]; then
    cp -r 00-base/src/component/products/* "$NEXT_FOLDER/src/component/products/"
    echo "  ✅ Products component copied"
    
    # Remove test files except Products.test.ts (we'll create it later)
    find "$NEXT_FOLDER/src/component/products" -name "*.test.ts*" -not -name "Products.test.ts*" -delete 2>/dev/null || true
    
    # Remove test files except App.test.tsx
    find "$NEXT_FOLDER/src/component/app" -name "*.test.ts*" -not -name "App.test.tsx" -delete 2>/dev/null || true
    
    echo "  ℹ️  Removed unwanted test files"
  fi

else
  echo "📦 Creating default structure..."
fi

echo ""
echo "✅ ${NEXT_FOLDER} created!"
echo ""

## starting the project at that folder
cd ${NEXT_FOLDER}

## installing the npm packages
npm install

## running the dev server
npm run dev
