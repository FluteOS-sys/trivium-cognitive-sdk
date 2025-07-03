/**
 * Trivium Universal AI Middleware Examples
 * Shows how to integrate with ANY AI service
 */

const { 
  TriviumMiddleware,
  initializeTrivium,
  triviumExpressMiddleware,
  triviumBrowserMiddleware
} = require('../middleware');

// Example 1: OpenAI Integration
async function openAIExample() {
  console.log('=== OpenAI Integration Example ===');
  
  // Initialize global middleware
  const trivium = initializeTrivium({
    enabled: true,
    autoPatterns: true,
    autoPatch: true
  });
  
  // Now ALL OpenAI calls will be automatically enhanced
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  // This request will be automatically enhanced with cognitive lenses
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: "Review this code: function add(a, b) { return a + b; }" }
    ]
  });
  
  console.log('Enhanced OpenAI Response:', response.choices[0].message.content);
}

// Example 2: Express.js Web Application
function expressAppExample() {
  console.log('=== Express.js Web App Example ===');
  
  const express = require('express');
  const app = express();
  
  // Add Trivium middleware to intercept all AI API calls
  app.use(triviumExpressMiddleware({
    enabled: true,
    autoPatterns: true,
    logLevel: 'info'
  }));
  
  // Your existing AI endpoints will be automatically enhanced
  app.post('/api/chat', async (req, res) => {
    // This will be intercepted and enhanced by Trivium
    const aiResponse = await callAnyAIService(req.body);
    res.json(aiResponse);
  });
  
  app.listen(3000, () => {
    console.log('Express app with Trivium middleware running on port 3000');
  });
}

// Example 3: Browser/Client-side Integration
function browserExample() {
  console.log('=== Browser Integration Example ===');
  
  // In browser environment
  if (typeof window !== 'undefined') {
    // Initialize browser middleware
    const trivium = triviumBrowserMiddleware({
      enabled: true,
      autoPatterns: true,
      services: ['openai', 'claude', 'gemini']
    });
    
    // ALL fetch requests to AI services will be enhanced
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Explain machine learning' }]
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Enhanced AI Response:', data);
    });
  }
}

// Example 4: Custom AI Service Integration
async function customAIServiceExample() {
  console.log('=== Custom AI Service Integration ===');
  
  const middleware = new TriviumMiddleware({
    enabled: true,
    autoPatterns: true
  });
  
  // Integrate with any AI service
  async function callCustomAIService(prompt) {
    // Step 1: Enhance the request with cognitive lenses
    const enhancedRequest = await middleware.interceptRequest({
      input: prompt,
      service: 'custom-ai'
    });
    
    // Step 2: Call your AI service
    const response = await fetch('https://your-ai-service.com/api/generate', {
      method: 'POST',
      body: JSON.stringify(enhancedRequest)
    });
    
    const data = await response.json();
    
    // Step 3: Enhance the response with cognitive analysis
    const enhancedResponse = await middleware.interceptResponse(data, enhancedRequest);
    
    return enhancedResponse;
  }
  
  // Usage
  const result = await callCustomAIService('Write a Python function to sort a list');
  console.log('Custom AI Service Result:', result);
}

// Example 5: Real-time Chat Application
function chatApplicationExample() {
  console.log('=== Real-time Chat Application Example ===');
  
  const WebSocket = require('ws');
  const middleware = new TriviumMiddleware({
    enabled: true,
    autoPatterns: true
  });
  
  const wss = new WebSocket.Server({ port: 8080 });
  
  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        // Enhance chat message with cognitive analysis
        const enhancedMessage = await middleware.interceptRequest({
          input: data.text,
          context: data.context || '',
          service: 'chat-ai'
        });
        
        // Send to AI service (ChatGPT, Claude, etc.)
        const aiResponse = await processWithAI(enhancedMessage);
        
        // Enhance AI response
        const enhancedResponse = await middleware.interceptResponse(aiResponse, enhancedMessage);
        
        // Send enhanced response back to client
        ws.send(JSON.stringify({
          type: 'ai-response',
          content: enhancedResponse,
          cognitiveAnalysis: enhancedResponse.triviumAnalysis
        }));
        
      } catch (error) {
        console.error('Chat error:', error);
      }
    });
  });
  
  console.log('WebSocket chat server with Trivium enhancement running on port 8080');
}

// Example 6: Batch Processing
async function batchProcessingExample() {
  console.log('=== Batch Processing Example ===');
  
  const middleware = new TriviumMiddleware({
    enabled: true,
    autoPatterns: true
  });
  
  const codeFiles = [
    'function authenticate(user) { return user.isValid; }',
    'function calculatePrice(item) { return item.price * 1.1; }',
    'function validateInput(data) { return data.length > 0; }'
  ];
  
  const enhancedAnalyses = await Promise.all(
    codeFiles.map(async (code) => {
      const request = {
        input: code,
        service: 'code-analysis'
      };
      
      const enhancedRequest = await middleware.interceptRequest(request);
      const mockAIResponse = { analysis: `Analysis of: ${code}` };
      const enhancedResponse = await middleware.interceptResponse(mockAIResponse, enhancedRequest);
      
      return enhancedResponse;
    })
  );
  
  console.log('Batch processing results:', enhancedAnalyses);
}

// Example 7: Plugin System for Different AI Tools
class TriviumPlugin {
  constructor(aiTool) {
    this.aiTool = aiTool;
    this.middleware = new TriviumMiddleware({
      enabled: true,
      autoPatterns: true
    });
  }
  
  async enhance(input) {
    // Universal enhancement for any AI tool
    const enhancedInput = await this.middleware.interceptRequest({
      input: input,
      service: this.aiTool
    });
    
    return enhancedInput;
  }
}

// Create plugins for different AI tools
const plugins = {
  chatgpt: new TriviumPlugin('chatgpt'),
  claude: new TriviumPlugin('claude'),
  gemini: new TriviumPlugin('gemini'),
  copilot: new TriviumPlugin('copilot'),
  cursor: new TriviumPlugin('cursor')
};

// Example 8: Configuration and Monitoring
function configurationExample() {
  console.log('=== Configuration and Monitoring Example ===');
  
  const middleware = new TriviumMiddleware({
    enabled: true,
    autoPatterns: true,
    logLevel: 'debug',
    customPatterns: {
      'ML_ANALYSIS': {
        name: 'ML_ANALYSIS',
        lenses: ['logical', 'ethical', 'temporal'],
        focus: 'Machine learning model evaluation',
        description: 'Comprehensive ML model analysis'
      }
    },
    onRequest: (request) => {
      console.log('Request intercepted:', request.service);
    },
    onResponse: (response) => {
      console.log('Response enhanced:', response.triviumAnalysis?.pattern);
    }
  });
  
  // Monitor middleware performance
  setInterval(() => {
    console.log('Middleware stats:', {
      requestsProcessed: middleware.stats?.requests || 0,
      enhancementsApplied: middleware.stats?.enhancements || 0,
      averageProcessingTime: middleware.stats?.avgTime || 0
    });
  }, 60000);
}

// Run examples
async function runAllExamples() {
  try {
    await openAIExample();
    expressAppExample();
    browserExample();
    await customAIServiceExample();
    chatApplicationExample();
    await batchProcessingExample();
    configurationExample();
    
    console.log('\n=== All Examples Complete ===');
    console.log('Trivium middleware is now ready for ANY AI service integration!');
    
  } catch (error) {
    console.error('Example error:', error);
  }
}

// Helper function to simulate AI service calls
async function callAnyAIService(request) {
  // This would call your actual AI service
  return {
    response: 'AI service response would go here',
    enhanced: true
  };
}

async function processWithAI(request) {
  // This would process with your AI service
  return {
    content: 'AI generated content',
    metadata: { model: 'gpt-4', tokens: 100 }
  };
}

// Export examples
module.exports = {
  openAIExample,
  expressAppExample,
  browserExample,
  customAIServiceExample,
  chatApplicationExample,
  batchProcessingExample,
  TriviumPlugin,
  plugins,
  runAllExamples
};

// Run if called directly
if (require.main === module) {
  runAllExamples();
}