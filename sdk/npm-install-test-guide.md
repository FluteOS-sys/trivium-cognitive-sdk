# How to Test NPM Installation for Trivium SDK

## Method 1: Local Package Testing (Recommended)

### Step 1: Create a test directory outside the SDK
```bash
mkdir ../test-trivium-sdk
cd ../test-trivium-sdk
npm init -y
```

### Step 2: Install the SDK locally
```bash
# Install from local directory
npm install ../sdk

# Or using file: protocol
npm install file:../sdk
```

### Step 3: Test the installation
```javascript
// test.js
const { TriviumCore, LensPatterns, LensType } = require('trivium-cognitive-sdk');

async function test() {
  const trivium = new TriviumCore();
  
  const result = await trivium.processWithPattern(
    "function hello() { console.log('Hello World'); }",
    LensPatterns.CODE_REVIEW
  );
  
  console.log('✅ SDK works!');
  console.log('Lenses:', Object.keys(result.outputs));
}

test().catch(console.error);
```

### Step 4: Run the test
```bash
node test.js
```

## Method 2: Using npm pack (Simulates Real NPM Installation)

### Step 1: Create package tarball
```bash
cd sdk
npm pack
# Creates trivium-cognitive-sdk-1.0.0.tgz
```

### Step 2: Install from tarball
```bash
mkdir ../test-pack
cd ../test-pack
npm init -y
npm install ../sdk/trivium-cognitive-sdk-1.0.0.tgz
```

### Step 3: Test the packaged installation
```javascript
// Same test.js as above
const { TriviumCore, LensPatterns } = require('trivium-cognitive-sdk');
// ... rest of test
```

## Method 3: Using npx (Direct Execution)

### Step 1: Make CLI executable
```bash
cd sdk
chmod +x demo-usage.js
```

### Step 2: Test with npx
```bash
npx trivium-cognitive-sdk demo-usage.js
```

## Method 4: Global Installation Test

### Step 1: Install globally
```bash
cd sdk
npm install -g .
```

### Step 2: Test global installation
```bash
# From any directory
trivium-sdk --help
```

## Method 5: Testing Different Node.js Versions

### Using Docker
```bash
# Test with Node 18
docker run -v $(pwd):/app -w /app node:18 npm install ./sdk && node test.js

# Test with Node 20
docker run -v $(pwd):/app -w /app node:20 npm install ./sdk && node test.js
```

## Expected Test Results

### ✅ Successful Installation Signs:
- Package installs without errors
- All exports are available: `TriviumCore`, `LensPatterns`, `LensType`
- All 10 lens types work: `ethical`, `emotional`, `logical`, etc.
- Predefined patterns work: `CODE_REVIEW`, `DEBUGGING`, `SECURITY_AUDIT`
- Processing returns proper structure with `outputs` object

### ❌ Common Issues to Watch For:
- Missing dependencies (should be zero for standalone version)
- Module resolution errors
- TypeScript definition errors
- Incorrect export structure

## Real-World Integration Examples

### VS Code Extension
```javascript
// In VS Code extension
const vscode = require('vscode');
const { TriviumCore, LensPatterns } = require('trivium-cognitive-sdk');

function activate(context) {
  const trivium = new TriviumCore();
  
  const disposable = vscode.commands.registerCommand('trivium.analyzeCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const code = editor.document.getText(editor.selection);
      const analysis = await trivium.processWithPattern(code, LensPatterns.CODE_REVIEW);
      
      // Show results in output panel
      vscode.window.showInformationMessage('Cognitive analysis complete!');
    }
  });
  
  context.subscriptions.push(disposable);
}
```

### Express.js API
```javascript
const express = require('express');
const { TriviumCore, LensPatterns } = require('trivium-cognitive-sdk');

const app = express();
const trivium = new TriviumCore();

app.post('/api/analyze', async (req, res) => {
  const { text, pattern } = req.body;
  const result = await trivium.processWithPattern(text, LensPatterns[pattern]);
  res.json(result);
});

app.listen(3000, () => {
  console.log('Trivium API server running on port 3000');
});
```

### React Hook
```javascript
import { TriviumCore, LensPatterns } from 'trivium-cognitive-sdk';
import { useState, useEffect } from 'react';

function useTriviumAnalysis(text, pattern) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!text || !pattern) return;
    
    setLoading(true);
    const trivium = new TriviumCore();
    
    trivium.processWithPattern(text, pattern)
      .then(result => {
        setAnalysis(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Analysis failed:', err);
        setLoading(false);
      });
  }, [text, pattern]);
  
  return { analysis, loading };
}
```

## Performance Benchmarks

### Expected Performance:
- **Initialization**: < 50ms
- **Single lens processing**: < 100ms
- **Complete analysis (10 lenses)**: < 500ms
- **Memory usage**: < 10MB
- **Package size**: < 1MB

### Benchmark Test
```javascript
const { TriviumCore, LensPatterns } = require('trivium-cognitive-sdk');

async function benchmark() {
  const trivium = new TriviumCore();
  const testCode = "function test() { return 'hello'; }";
  
  console.time('Single lens');
  await trivium.processText(testCode, ['logical']);
  console.timeEnd('Single lens');
  
  console.time('Complete analysis');
  await trivium.processWithPattern(testCode, LensPatterns.COMPLETE_ANALYSIS);
  console.timeEnd('Complete analysis');
}

benchmark();
```

This comprehensive testing approach ensures the SDK works correctly across all installation methods and use cases.