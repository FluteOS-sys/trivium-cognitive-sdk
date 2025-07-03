/**
 * Trivium Universal AI Middleware
 * Intercepts and enhances ANY AI tool interaction with cognitive lenses
 */

const { TriviumCore, LensPatterns } = require('./standalone-core');

class TriviumMiddleware {
  constructor(config = {}) {
    this.trivium = new TriviumCore(config.sovereignties);
    this.enabled = config.enabled !== false;
    this.autoPatterns = config.autoPatterns !== false;
    this.interceptors = new Map();
    this.sessionCache = new Map();
    
    // Initialize common AI service interceptors
    this.initializeInterceptors();
  }

  /**
   * Universal AI request interceptor
   * Works with OpenAI, Claude, ChatGPT, Gemini, etc.
   */
  async interceptRequest(request) {
    if (!this.enabled) return request;

    const { prompt, context, service } = this.parseRequest(request);
    const pattern = this.selectOptimalPattern(prompt, context, service);
    
    if (pattern) {
      const enhancedPrompt = await this.enhancePrompt(prompt, pattern);
      return this.rebuildRequest(request, enhancedPrompt);
    }

    return request;
  }

  /**
   * Universal AI response interceptor
   * Applies cognitive analysis to any AI response
   */
  async interceptResponse(response, originalRequest) {
    if (!this.enabled) return response;

    const { content, metadata } = this.parseResponse(response);
    const pattern = this.getPatternFromRequest(originalRequest);
    
    if (pattern) {
      const analysis = await this.trivium.processWithPattern(content, pattern);
      return this.enhanceResponse(response, analysis);
    }

    return response;
  }

  /**
   * Auto-detect optimal cognitive pattern based on request context
   */
  selectOptimalPattern(prompt, context, service) {
    // Code-related prompts
    if (this.isCodeRelated(prompt)) {
      return LensPatterns.CODE_REVIEW;
    }
    
    // Problem-solving prompts
    if (this.isProblemSolving(prompt)) {
      return LensPatterns.DEBUGGING;
    }
    
    // Creative/design prompts
    if (this.isCreative(prompt)) {
      return LensPatterns.UX_ANALYSIS;
    }
    
    // Security/sensitive prompts
    if (this.isSecurityRelated(prompt)) {
      return LensPatterns.SECURITY_AUDIT;
    }
    
    // Default comprehensive analysis
    return LensPatterns.COMPLETE_ANALYSIS;
  }

  /**
   * Enhance original prompt with cognitive lens guidance
   */
  async enhancePrompt(prompt, pattern) {
    const lensGuidance = pattern.lenses.map(lens => {
      switch(lens) {
        case 'ethical':
          return 'Consider ethical implications and moral consequences.';
        case 'logical':
          return 'Apply systematic reasoning and logical analysis.';
        case 'emotional':
          return 'Consider emotional impact and user experience.';
        case 'survival':
          return 'Evaluate robustness, risks, and defensive measures.';
        case 'symbolic':
          return 'Identify patterns, abstractions, and deeper meanings.';
        case 'temporal':
          return 'Consider timing, evolution, and long-term implications.';
        case 'aesthetic':
          return 'Evaluate beauty, harmony, and design principles.';
        case 'transcendent':
          return 'Consider higher-order connections and universal principles.';
        default:
          return `Apply ${lens} perspective to the analysis.`;
      }
    }).join(' ');

    return `${prompt}\n\n[Cognitive Enhancement: ${lensGuidance}]`;
  }

  /**
   * Parse any AI service request format
   */
  parseRequest(request) {
    // OpenAI format
    if (request.messages) {
      return {
        prompt: request.messages[request.messages.length - 1].content,
        context: request.messages.slice(0, -1).map(m => m.content).join('\n'),
        service: 'openai'
      };
    }
    
    // Claude format
    if (request.prompt) {
      return {
        prompt: request.prompt,
        context: request.context || '',
        service: 'claude'
      };
    }
    
    // Generic format
    return {
      prompt: request.input || request.text || request.query || '',
      context: request.context || '',
      service: 'generic'
    };
  }

  /**
   * Initialize interceptors for common AI services
   */
  initializeInterceptors() {
    // OpenAI API interceptor
    this.interceptors.set('openai', {
      requestTransform: (req) => ({
        ...req,
        messages: req.messages.map(msg => ({
          ...msg,
          content: msg.role === 'user' ? this.enhancePrompt(msg.content, this.selectOptimalPattern(msg.content)) : msg.content
        }))
      }),
      responseTransform: (res) => ({
        ...res,
        choices: res.choices.map(choice => ({
          ...choice,
          message: {
            ...choice.message,
            content: this.addCognitiveInsights(choice.message.content)
          }
        }))
      })
    });

    // Add more service interceptors as needed
  }

  /**
   * Content analysis helpers
   */
  isCodeRelated(prompt) {
    const codeKeywords = ['function', 'class', 'code', 'bug', 'debug', 'algorithm', 'programming'];
    return codeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  isProblemSolving(prompt) {
    const problemKeywords = ['problem', 'issue', 'error', 'fix', 'solve', 'troubleshoot'];
    return problemKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  isCreative(prompt) {
    const creativeKeywords = ['design', 'create', 'build', 'make', 'ui', 'ux', 'interface'];
    return creativeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  isSecurityRelated(prompt) {
    const securityKeywords = ['security', 'vulnerable', 'auth', 'permission', 'access', 'encrypt'];
    return securityKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  /**
   * Monkey patch common AI libraries
   */
  patchLibraries() {
    // Patch OpenAI library
    try {
      const openai = require('openai');
      if (openai && openai.OpenAI) {
        this.patchOpenAI(openai.OpenAI);
      }
    } catch (e) {
      // OpenAI not installed
    }

    // Patch other libraries as needed
  }

  patchOpenAI(OpenAIClass) {
    const originalCreate = OpenAIClass.prototype.chat.completions.create;
    const middleware = this;
    
    OpenAIClass.prototype.chat.completions.create = async function(params) {
      const enhancedParams = await middleware.interceptRequest(params);
      const response = await originalCreate.call(this, enhancedParams);
      return middleware.interceptResponse(response, params);
    };
  }
}

/**
 * Global middleware instance
 */
let globalMiddleware = null;

/**
 * Initialize Trivium middleware globally
 */
function initializeTrivium(config = {}) {
  globalMiddleware = new TriviumMiddleware(config);
  
  // Auto-patch common libraries
  if (config.autoPatch !== false) {
    globalMiddleware.patchLibraries();
  }
  
  return globalMiddleware;
}

/**
 * Express/Node.js middleware for web applications
 */
function triviumExpressMiddleware(config = {}) {
  const middleware = new TriviumMiddleware(config);
  
  return async (req, res, next) => {
    // Intercept AI API calls
    if (req.path.includes('/api/ai') || req.path.includes('/chat')) {
      try {
        req.body = await middleware.interceptRequest(req.body);
        
        // Intercept response
        const originalSend = res.send;
        res.send = function(body) {
          if (typeof body === 'string') {
            try {
              const data = JSON.parse(body);
              const enhanced = middleware.interceptResponse(data, req.body);
              return originalSend.call(this, JSON.stringify(enhanced));
            } catch (e) {
              return originalSend.call(this, body);
            }
          }
          return originalSend.call(this, body);
        };
      } catch (error) {
        console.error('Trivium middleware error:', error);
      }
    }
    
    next();
  };
}

/**
 * Browser/client-side middleware for web applications
 */
function triviumBrowserMiddleware(config = {}) {
  const middleware = new TriviumMiddleware(config);
  
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function(url, options = {}) {
    if (url.includes('api.openai.com') || url.includes('claude.ai') || url.includes('chat')) {
      try {
        if (options.body) {
          const data = JSON.parse(options.body);
          const enhanced = await middleware.interceptRequest(data);
          options.body = JSON.stringify(enhanced);
        }
      } catch (error) {
        console.error('Trivium browser middleware error:', error);
      }
    }
    
    return originalFetch.apply(this, arguments);
  };
  
  return middleware;
}

module.exports = {
  TriviumMiddleware,
  initializeTrivium,
  triviumExpressMiddleware,
  triviumBrowserMiddleware
};