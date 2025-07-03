# Trivium Cognitive SDK

A comprehensive cognitive architecture SDK that processes text through 10 archetypal lenses for complete perspective analysis.

## Installation

```bash
npm install trivium-cognitive-sdk
```

## Universal AI Middleware

Transform ANY AI tool with cognitive lenses:

```javascript
const { initializeTrivium } = require('trivium-cognitive-sdk/middleware');

// Initialize global middleware
initializeTrivium({ enabled: true, autoPatterns: true });

// ALL AI calls are now enhanced automatically
const openai = new OpenAI({ apiKey: 'your-key' });
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Review this code" }]
});
// Response now includes cognitive analysis
```

## Express.js Integration

```javascript
const { triviumExpressMiddleware } = require('trivium-cognitive-sdk/middleware');

app.use(triviumExpressMiddleware({ enabled: true }));
// All AI API calls through your app are now enhanced
```

## Browser Integration

```javascript
const { triviumBrowserMiddleware } = require('trivium-cognitive-sdk/middleware');

// Intercepts fetch requests to AI services
triviumBrowserMiddleware({ enabled: true });
```

## Quick Start

```javascript
import { TriviumCore, LensPatterns, LensType } from 'trivium-cognitive-sdk';

// Create core instance
const trivium = new TriviumCore();

// Analyze code with predefined pattern
const result = await trivium.processWithPattern(
  "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }",
  LensPatterns.CODE_REVIEW
);

console.log(result.outputs);
// {
//   ethical: "Function handles data responsibly...",
//   logical: "Clean implementation with proper error handling...",
//   ...
// }
```

## Available Lens Types

- **ETHICAL**: Moral implications and value systems
- **EMOTIONAL**: Empathy and emotional intelligence
- **LOGICAL**: Rational analysis and systematic thinking
- **SYMBOLIC**: Patterns, archetypes, and deeper meanings
- **TEMPORAL**: Time-based perspectives and evolution
- **ENERGETIC**: Resource efficiency and performance
- **AESTHETIC**: Beauty, elegance, and design principles
- **SURVIVAL**: Resilience, security, and robustness
- **RELATIONAL**: Connections and interdependencies
- **TRANSCENDENT**: Higher purpose and meaning

## Predefined Patterns

- `CODE_REVIEW`: Ethical + Logical analysis
- `DEBUGGING`: Logical + Emotional perspective
- `SECURITY_AUDIT`: Ethical + Survival + Logical
- `COMPLETE_ANALYSIS`: All 10 lenses for comprehensive coverage

## Custom Analysis

```javascript
// Process with specific lenses
const result = await trivium.processText(
  "Your text here",
  [LensType.ETHICAL, LensType.LOGICAL, LensType.AESTHETIC]
);

// Get synthesis of multiple perspectives
const synthesis = await trivium.processAndSynthesize(
  "Your text here",
  [LensType.ETHICAL, LensType.LOGICAL],
  0.7 // blend factor
);
```

## Features

- **100% Offline**: No external dependencies or API calls required
- **Archetypal Coverage**: Complete cognitive perspective analysis
- **Modular Design**: Use specific lenses or predefined patterns
- **TypeScript Support**: Full type definitions included
- **Zero Configuration**: Works out of the box

## License

MIT