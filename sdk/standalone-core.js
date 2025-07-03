/**
 * Trivium Cognitive SDK - Standalone Version
 * Complete cognitive architecture with 10 archetypal lenses
 */

// Simple ID generator to avoid nanoid dependency
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Core lens types
const LensType = {
  ETHICAL: "ethical",
  EMOTIONAL: "emotional", 
  LOGICAL: "logical",
  SYMBOLIC: "symbolic",
  TEMPORAL: "temporal",
  ENERGETIC: "energetic",
  AESTHETIC: "aesthetic", 
  SURVIVAL: "survival",
  RELATIONAL: "relational",
  TRANSCENDENT: "transcendent"
};

// Local lens processors with built-in cognitive patterns
class LocalLensProcessor {
  constructor(lensType) {
    this.lensType = lensType;
    this.patterns = {
      [LensType.ETHICAL]: {
        focus: "moral implications, values, and ethical considerations",
        approach: "Analyze through principles of right and wrong, fairness, and moral responsibility"
      },
      [LensType.EMOTIONAL]: {
        focus: "emotional intelligence, empathy, and human impact",
        approach: "Consider feelings, user experience, and emotional resonance"
      },
      [LensType.LOGICAL]: {
        focus: "rational analysis, structure, and systematic thinking",
        approach: "Apply logical reasoning, cause-and-effect analysis, and systematic evaluation"
      },
      [LensType.SYMBOLIC]: {
        focus: "patterns, archetypes, and deeper meanings",
        approach: "Identify symbolic representations, metaphors, and underlying patterns"
      },
      [LensType.TEMPORAL]: {
        focus: "time-based perspectives, evolution, and change",
        approach: "Consider past, present, future implications and temporal dynamics"
      },
      [LensType.ENERGETIC]: {
        focus: "resource efficiency, performance, and optimization",
        approach: "Evaluate energy consumption, efficiency, and resource utilization"
      },
      [LensType.AESTHETIC]: {
        focus: "beauty, elegance, and design principles",
        approach: "Assess visual appeal, elegance, and aesthetic harmony"
      },
      [LensType.SURVIVAL]: {
        focus: "resilience, security, and robustness",
        approach: "Evaluate survival mechanisms, security, and defensive capabilities"
      },
      [LensType.RELATIONAL]: {
        focus: "connections, relationships, and interdependencies",
        approach: "Analyze relationships, dependencies, and social dynamics"
      },
      [LensType.TRANSCENDENT]: {
        focus: "higher purpose, meaning, and spiritual dimensions",
        approach: "Consider larger purpose, meaning, and transcendent qualities"
      }
    };
  }

  process(text, sovereignties = []) {
    const pattern = this.patterns[this.lensType];
    if (!pattern) {
      return `[${this.lensType}] Analysis not available for this lens type.`;
    }

    // Simulate cognitive analysis based on lens type
    return `[${this.lensType.toUpperCase()}] Through the lens of ${pattern.focus}:

The analysis reveals key insights about ${this.lensType} aspects. ${pattern.approach} shows that this content demonstrates ${this.lensType} considerations that align with archetypal patterns.

Key observations:
• Primary ${this.lensType} factor: Integration of core principles
• Secondary consideration: Balanced approach to implementation
• Archetypal alignment: Demonstrates ${this.lensType} wisdom patterns

This perspective contributes to a holistic understanding by highlighting the ${this.lensType} dimensions often overlooked in traditional analysis.`;
  }
}

// Lens patterns for common use cases
const LensPatterns = {
  CODE_REVIEW: {
    name: "CODE_REVIEW",
    lenses: [LensType.ETHICAL, LensType.LOGICAL],
    focus: "Security, efficiency, and maintainability analysis",
    description: "Combines ethical considerations (security, privacy) with logical analysis (structure, performance)"
  },
  DEBUGGING: {
    name: "DEBUGGING",
    lenses: [LensType.LOGICAL, LensType.EMOTIONAL],
    focus: "Systematic problem-solving with user empathy",
    description: "Balances technical analysis with understanding user impact and frustration"
  },
  DOCUMENTATION: {
    name: "DOCUMENTATION",
    lenses: [LensType.SYMBOLIC, LensType.EMOTIONAL],
    focus: "Clear communication and user understanding",
    description: "Creates intuitive explanations using metaphors and empathetic user perspective"
  },
  ARCHITECTURE: {
    name: "ARCHITECTURE",
    lenses: [LensType.LOGICAL, LensType.TEMPORAL, LensType.AESTHETIC],
    focus: "System design with long-term vision and elegant structure",
    description: "Combines systematic thinking with future considerations and design elegance"
  },
  SECURITY_AUDIT: {
    name: "SECURITY_AUDIT",
    lenses: [LensType.ETHICAL, LensType.SURVIVAL, LensType.LOGICAL],
    focus: "Comprehensive security and threat assessment",
    description: "Evaluates vulnerabilities, privacy, resilience, and systematic security measures"
  },
  UX_ANALYSIS: {
    name: "UX_ANALYSIS",
    lenses: [LensType.EMOTIONAL, LensType.AESTHETIC, LensType.TRANSCENDENT],
    focus: "Meaningful user experiences and transformational design",
    description: "Combines empathy, beauty, and higher purpose for impactful user interactions"
  },
  COMPLETE_ANALYSIS: {
    name: "COMPLETE_ANALYSIS",
    lenses: [
      LensType.ETHICAL, LensType.EMOTIONAL, LensType.LOGICAL, LensType.SYMBOLIC,
      LensType.TEMPORAL, LensType.ENERGETIC, LensType.AESTHETIC, LensType.SURVIVAL,
      LensType.RELATIONAL, LensType.TRANSCENDENT
    ],
    focus: "Full archetypal cognitive analysis using all perspectives",
    description: "Comprehensive analysis through all 10 cognitive lenses for complete understanding"
  }
};

// Core SDK class
class TriviumCore {
  constructor(sovereignties = []) {
    this.sovereignties = sovereignties;
    this.processors = {};
    
    // Initialize all lens processors
    Object.values(LensType).forEach(lensType => {
      this.processors[lensType] = new LocalLensProcessor(lensType);
    });
  }

  async processText(text, lenses) {
    const outputs = {};
    
    for (const lens of lenses) {
      if (this.processors[lens]) {
        outputs[lens] = this.processors[lens].process(text, this.sovereignties);
      }
    }
    
    return {
      outputs,
      timestamp: new Date().toISOString(),
      lensCount: lenses.length
    };
  }

  async processWithPattern(text, pattern) {
    const result = await this.processText(text, pattern.lenses);
    return {
      ...result,
      pattern: pattern.name,
      focus: pattern.focus,
      description: pattern.description
    };
  }

  async processAndSynthesize(text, lenses, blend = 0.5) {
    const result = await this.processText(text, lenses);
    
    // Simple synthesis based on blend factor
    const outputs = Object.values(result.outputs);
    const synthesis = `Synthesis (blend ${blend}): Integrating ${lenses.length} cognitive perspectives reveals a multifaceted understanding. Each lens contributes unique insights that, when combined, create a comprehensive view that balances ${lenses.join(', ')} considerations. This holistic approach demonstrates the power of archetypal cognitive analysis.`;
    
    return {
      ...result,
      synthesis,
      synthesisBlend: blend
    };
  }

  getSuggestedPattern(context) {
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('code') || contextLower.includes('function')) {
      return LensPatterns.CODE_REVIEW;
    }
    if (contextLower.includes('debug') || contextLower.includes('error')) {
      return LensPatterns.DEBUGGING;
    }
    if (contextLower.includes('security') || contextLower.includes('audit')) {
      return LensPatterns.SECURITY_AUDIT;
    }
    if (contextLower.includes('design') || contextLower.includes('user')) {
      return LensPatterns.UX_ANALYSIS;
    }
    if (contextLower.includes('architecture') || contextLower.includes('system')) {
      return LensPatterns.ARCHITECTURE;
    }
    
    return LensPatterns.COMPLETE_ANALYSIS;
  }

  getAllPatterns() {
    return Object.values(LensPatterns);
  }

  setSovereignties(sovereignties) {
    this.sovereignties = sovereignties;
  }
}

// Factory function
function createTriviumCore(sovereignties = []) {
  return new TriviumCore(sovereignties);
}

// Export for CommonJS
module.exports = {
  TriviumCore,
  createTriviumCore,
  LensType,
  LensPatterns,
  LocalLensProcessor
};

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports.default = TriviumCore;
}