#!/bin/bash

# Trivium SDK Automated Deployment Script
# This script guides you through the complete publication process

echo "🚀 TRIVIUM SDK DEPLOYMENT AUTOMATION"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "sdk/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: NPM Package Publication"
echo "-----------------------------------"
echo "Package: trivium-cognitive-sdk@1.0.0"
echo "Size: 17.8 kB (60.3 kB unpacked)"
echo "Files: 10 modules including universal middleware"
echo ""

cd sdk

# Validate package before publishing
echo "🔍 Validating package..."
npm pack --dry-run > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Package validation successful"
else
    echo "❌ Package validation failed"
    exit 1
fi

echo ""
echo "Ready to publish to NPM. You need to:"
echo "1. Have an NPM account (create at npmjs.com if needed)"
echo "2. Run: npm login"
echo "3. Run: npm publish"
echo ""

read -p "Do you want to continue with NPM publication? (y/n): " npm_confirm

if [ "$npm_confirm" = "y" ] || [ "$npm_confirm" = "Y" ]; then
    echo "🔐 Please login to NPM..."
    npm login
    
    if [ $? -eq 0 ]; then
        echo "📤 Publishing to NPM..."
        npm publish
        
        if [ $? -eq 0 ]; then
            echo "✅ NPM publication successful!"
            echo "🌐 Package is now available globally: npm install trivium-cognitive-sdk"
        else
            echo "❌ NPM publication failed"
        fi
    else
        echo "❌ NPM login failed"
    fi
else
    echo "⏭️  Skipping NPM publication"
fi

cd ..

echo ""
echo "🔧 Step 2: VS Code Extension Publication"
echo "----------------------------------------"
echo "Extension: trivium-cognitive-lens"
echo "Features: Right-click cognitive analysis"
echo ""

cd vscode-extension

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    echo "📥 Installing VS Code Extension manager..."
    npm install -g vsce
fi

echo "Ready to publish VS Code extension. You need to:"
echo "1. Create a publisher account at marketplace.visualstudio.com"
echo "2. Get a Personal Access Token from Azure DevOps"
echo "3. Run: vsce login [publisher-name]"
echo "4. Run: vsce publish"
echo ""

read -p "Do you want to continue with VS Code extension publication? (y/n): " vscode_confirm

if [ "$vscode_confirm" = "y" ] || [ "$vscode_confirm" = "Y" ]; then
    echo "🔐 Please login to VS Code Marketplace..."
    echo "Note: You'll need your publisher name and Personal Access Token"
    
    read -p "Enter your publisher name: " publisher_name
    vsce login "$publisher_name"
    
    if [ $? -eq 0 ]; then
        echo "📤 Publishing VS Code extension..."
        vsce publish
        
        if [ $? -eq 0 ]; then
            echo "✅ VS Code extension published successfully!"
            echo "🔍 Users can now search 'Trivium Cognitive Lens' in VS Code"
        else
            echo "❌ VS Code extension publication failed"
        fi
    else
        echo "❌ VS Code Marketplace login failed"
    fi
else
    echo "⏭️  Skipping VS Code extension publication"
fi

cd ..

echo ""
echo "📂 Step 3: GitHub Repository Creation"
echo "-------------------------------------"

read -p "Do you want to create GitHub repository? (y/n): " github_confirm

if [ "$github_confirm" = "y" ] || [ "$github_confirm" = "Y" ]; then
    echo "🔐 Setting up Git repository..."
    
    git init
    git add .
    git commit -m "🚀 Initial release: Trivium Cognitive SDK v1.0.0 - Universal AI middleware"
    
    echo ""
    echo "Next steps for GitHub:"
    echo "1. Create repository at github.com/new"
    echo "2. Copy the repository URL"
    echo "3. Run these commands:"
    echo ""
    echo "git remote add origin [YOUR-REPO-URL]"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo "git tag v1.0.0"
    echo "git push origin v1.0.0"
    echo ""
else
    echo "⏭️  Skipping GitHub repository creation"
fi

echo ""
echo "📢 Step 4: Marketing Campaign Launch"
echo "------------------------------------"
echo "All marketing content is prepared in VIRAL-MARKETING-CONTENT.md"
echo ""
echo "Ready to post:"
echo "✅ Twitter thread (8 tweets)"
echo "✅ Reddit posts (4 communities)"
echo "✅ Hacker News submission"
echo "✅ LinkedIn professional post"
echo "✅ Discord/Slack messages"
echo ""

echo "🎉 DEPLOYMENT SUMMARY"
echo "===================="
echo "✅ NPM Package: trivium-cognitive-sdk@1.0.0"
echo "✅ VS Code Extension: trivium-cognitive-lens"
echo "✅ Complete documentation and examples"
echo "✅ Universal AI middleware for any service"
echo "✅ Zero dependencies, full TypeScript support"
echo ""
echo "🚀 Your universal AI middleware system is ready for global adoption!"
echo "Execute the publication commands above to go live worldwide."