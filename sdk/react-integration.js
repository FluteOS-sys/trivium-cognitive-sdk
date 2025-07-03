/**
 * Trivium React Integration
 * Hooks and components for React applications
 */

const React = require('react');
const { TriviumMiddleware } = require('./middleware');

// React Hook for cognitive analysis
function useTriviumAnalysis(config = {}) {
  const [middleware] = React.useState(() => new TriviumMiddleware(config));
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [lastAnalysis, setLastAnalysis] = React.useState(null);

  const analyzeText = React.useCallback(async (text, pattern) => {
    if (!text.trim()) return null;
    
    setIsAnalyzing(true);
    try {
      const result = await middleware.trivium.processWithPattern(text, pattern);
      setLastAnalysis(result);
      return result;
    } catch (error) {
      console.error('Trivium analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [middleware]);

  const analyzeWithLenses = React.useCallback(async (text, lenses) => {
    if (!text.trim()) return null;
    
    setIsAnalyzing(true);
    try {
      const result = await middleware.trivium.processText(text, lenses);
      setLastAnalysis(result);
      return result;
    } catch (error) {
      console.error('Trivium analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [middleware]);

  return {
    analyzeText,
    analyzeWithLenses,
    isAnalyzing,
    lastAnalysis,
    middleware
  };
}

// React Hook for AI middleware
function useTriviumAI(config = {}) {
  const [middleware] = React.useState(() => new TriviumMiddleware(config));
  
  const enhancedFetch = React.useCallback(async (url, options = {}) => {
    // Check if this is an AI API call
    const isAICall = url.includes('api.openai.com') || 
                    url.includes('claude.ai') || 
                    url.includes('chat') ||
                    url.includes('ai');
    
    if (isAICall && options.body) {
      try {
        const data = JSON.parse(options.body);
        const enhanced = await middleware.interceptRequest(data);
        options.body = JSON.stringify(enhanced);
      } catch (error) {
        console.error('Request enhancement error:', error);
      }
    }
    
    const response = await fetch(url, options);
    
    if (isAICall && response.ok) {
      const data = await response.json();
      const enhanced = await middleware.interceptResponse(data, options.body);
      return new Response(JSON.stringify(enhanced), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    
    return response;
  }, [middleware]);

  return {
    enhancedFetch,
    middleware
  };
}

// React Component for cognitive analysis display
function TriviumAnalysisDisplay({ analysis, className = '' }) {
  if (!analysis) return null;

  const lensOutputs = Object.entries(analysis.outputs || {});
  
  return React.createElement('div', {
    className: `trivium-analysis ${className}`,
    style: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    }
  }, [
    React.createElement('h3', {
      key: 'title',
      style: { marginBottom: '12px', color: '#1a202c' }
    }, '🧠 Cognitive Analysis'),
    
    analysis.pattern && React.createElement('div', {
      key: 'pattern',
      style: {
        backgroundColor: '#f7fafc',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px'
      }
    }, [
      React.createElement('strong', { key: 'pattern-name' }, `Pattern: ${analysis.pattern}`),
      analysis.focus && React.createElement('div', {
        key: 'focus',
        style: { fontSize: '14px', color: '#4a5568', marginTop: '4px' }
      }, `Focus: ${analysis.focus}`)
    ]),
    
    React.createElement('div', {
      key: 'lenses',
      className: 'lens-outputs'
    }, lensOutputs.map(([lensType, output]) => 
      React.createElement('div', {
        key: lensType,
        style: {
          marginBottom: '16px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }
      }, [
        React.createElement('div', {
          key: 'header',
          style: {
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '8px 12px',
            fontWeight: '600',
            fontSize: '14px',
            textTransform: 'uppercase'
          }
        }, `${lensType} Lens`),
        React.createElement('div', {
          key: 'content',
          style: {
            padding: '12px',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }
        }, output)
      ])
    ))
  ]);
}

// React Component for cognitive input enhancement
function TriviumEnhancedInput({ 
  onAnalyze, 
  placeholder = "Enter text to analyze...",
  className = '',
  autoAnalyze = false,
  selectedLenses = ['ethical', 'logical']
}) {
  const [text, setText] = React.useState('');
  const { analyzeWithLenses, isAnalyzing, lastAnalysis } = useTriviumAnalysis();
  
  const handleAnalyze = React.useCallback(async () => {
    if (!text.trim()) return;
    
    const result = await analyzeWithLenses(text, selectedLenses);
    if (onAnalyze) onAnalyze(result);
  }, [text, analyzeWithLenses, selectedLenses, onAnalyze]);
  
  React.useEffect(() => {
    if (autoAnalyze && text.trim()) {
      const timer = setTimeout(handleAnalyze, 1000);
      return () => clearTimeout(timer);
    }
  }, [text, autoAnalyze, handleAnalyze]);
  
  return React.createElement('div', {
    className: `trivium-enhanced-input ${className}`
  }, [
    React.createElement('textarea', {
      key: 'textarea',
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder,
      style: {
        width: '100%',
        minHeight: '120px',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        resize: 'vertical'
      }
    }),
    
    React.createElement('div', {
      key: 'controls',
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px'
      }
    }, [
      React.createElement('div', {
        key: 'lens-selector',
        style: { fontSize: '12px', color: '#4a5568' }
      }, `Active lenses: ${selectedLenses.join(', ')}`),
      
      React.createElement('button', {
        key: 'analyze-btn',
        onClick: handleAnalyze,
        disabled: isAnalyzing || !text.trim(),
        style: {
          padding: '8px 16px',
          backgroundColor: isAnalyzing ? '#a0aec0' : '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer'
        }
      }, isAnalyzing ? 'Analyzing...' : 'Analyze')
    ]),
    
    lastAnalysis && React.createElement(TriviumAnalysisDisplay, {
      key: 'analysis',
      analysis: lastAnalysis
    })
  ]);
}

// React Provider for global Trivium context
const TriviumContext = React.createContext();

function TriviumProvider({ children, config = {} }) {
  const [middleware] = React.useState(() => new TriviumMiddleware(config));
  
  const value = React.useMemo(() => ({
    middleware,
    analyzeText: (text, pattern) => middleware.trivium.processWithPattern(text, pattern),
    analyzeWithLenses: (text, lenses) => middleware.trivium.processText(text, lenses),
    interceptRequest: (request) => middleware.interceptRequest(request),
    interceptResponse: (response, request) => middleware.interceptResponse(response, request)
  }), [middleware]);
  
  return React.createElement(TriviumContext.Provider, { value }, children);
}

function useTriviumContext() {
  const context = React.useContext(TriviumContext);
  if (!context) {
    throw new Error('useTriviumContext must be used within a TriviumProvider');
  }
  return context;
}

// Higher-order component for AI enhancement
function withTriviumAI(WrappedComponent, config = {}) {
  return function TriviumEnhancedComponent(props) {
    const { enhancedFetch, middleware } = useTriviumAI(config);
    
    return React.createElement(WrappedComponent, {
      ...props,
      triviumFetch: enhancedFetch,
      triviumMiddleware: middleware
    });
  };
}

module.exports = {
  useTriviumAnalysis,
  useTriviumAI,
  TriviumAnalysisDisplay,
  TriviumEnhancedInput,
  TriviumProvider,
  useTriviumContext,
  withTriviumAI
};