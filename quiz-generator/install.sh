#!/bin/bash

echo "=================================================="
echo "🎓 Quiz Generator - Installation Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo ""
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm is installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm is not installed"
    exit 1
fi

# Check Ollama
echo ""
echo "🤖 Checking Ollama..."
if command -v ollama &> /dev/null; then
    OLLAMA_VERSION=$(ollama --version)
    echo -e "${GREEN}✓${NC} Ollama is installed: $OLLAMA_VERSION"

    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags &> /dev/null; then
        echo -e "${GREEN}✓${NC} Ollama is running"

        # Check for kimi-k2:1t-cloud model
        if ollama list | grep -q "kimi-k2:1t-cloud"; then
            echo -e "${GREEN}✓${NC} Model kimi-k2:1t-cloud is installed"
        else
            echo -e "${YELLOW}!${NC} Model kimi-k2:1t-cloud is not installed"
            echo "Installing model kimi-k2:1t-cloud..."
            ollama pull kimi-k2:1t-cloud
        fi
    else
        echo -e "${YELLOW}!${NC} Ollama is not running"
        echo "Starting Ollama..."
        ollama serve &
        sleep 2
    fi
else
    echo -e "${RED}✗${NC} Ollama is not installed"
    echo "Please install Ollama from https://ollama.com/"
    echo "Then run: ollama pull kimi-k2:1t-cloud"
    exit 1
fi

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

# Check TTS server (optional)
echo ""
echo "🔊 Checking TTS server..."
if curl -s http://localhost:8880/v1/audio/speech &> /dev/null; then
    echo -e "${GREEN}✓${NC} TTS server is running"
else
    echo -e "${YELLOW}!${NC} TTS server is not running"
    echo "Audio generation will not work without TTS server"
    echo "You can still generate quizzes with --skip-audio flag"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p ../public/audios
echo -e "${GREEN}✓${NC} Directories created"

# Summary
echo ""
echo "=================================================="
echo "✅ Installation Complete!"
echo "=================================================="
echo ""
echo "🚀 Quick Start:"
echo "   1. Make sure Ollama is running: ollama serve"
echo "   2. Test the generator:"
echo "      node generate-quiz.js example-document.txt \"Test Quiz\""
echo ""
echo "📖 For more information, see README.md"
echo ""
