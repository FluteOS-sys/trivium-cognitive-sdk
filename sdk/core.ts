import { LensManager } from "../server/services/lensManager";
import { Sovereignty } from "../shared/schema";

export enum LensType {
  ETHICAL = "ethical",
  EMOTIONAL = "emotional", 
  LOGICAL = "logical",
  SYMBOLIC = "symbolic",
  TEMPORAL = "temporal",
  ENERGETIC = "energetic",
  AESTHETIC = "aesthetic", 
  SURVIVAL = "survival",
  RELATIONAL = "relational",
  TRANSCENDENT = "transcendent"
}

export interface LensPattern {
  name: string;
  lenses: LensType[];
  focus: string;
  description: string;
}

export interface ProcessResult {
  outputs: Record<LensType, string>;
  pattern?: LensPattern;
  synthesisBlend?: number;
  synthesis?: string;
}

export class LensPatterns {
  static readonly CODE_REVIEW: LensPattern = {
    name: "CODE_REVIEW",
    lenses: [LensType.ETHICAL, LensType.LOGICAL],
    focus: "Security, efficiency, and maintainability analysis",
    description: "Combines ethical considerations (security, privacy) with logical analysis (structure, performance)"
  };

  static readonly DEBUGGING: LensPattern = {
    name: "DEBUGGING", 
    lenses: [LensType.LOGICAL, LensType.EMOTIONAL],
    focus: "Systematic problem-solving with user empathy",
    description: "Balances technical analysis with understanding user impact and frustration"
  };

  static readonly DOCUMENTATION: LensPattern = {
    name: "DOCUMENTATION",
    lenses: [LensType.SYMBOLIC, LensType.EMOTIONAL],
    focus: "Clear communication and user understanding", 
    description: "Creates intuitive explanations using metaphors and empathetic user perspective"
  };

  static readonly ARCHITECTURE: LensPattern = {
    name: "ARCHITECTURE",
    lenses: [LensType.ETHICAL, LensType.EMOTIONAL, LensType.LOGICAL, LensType.SYMBOLIC],
    focus: "Holistic system design and decision-making",
    description: "Comprehensive analysis for major technical decisions using all cognitive perspectives"
  };

  static readonly API_DESIGN: LensPattern = {
    name: "API_DESIGN",
    lenses: [LensType.LOGICAL, LensType.EMOTIONAL],
    focus: "Developer experience and technical efficiency",
    description: "Optimizes both technical implementation and developer usability"
  };

  static readonly UX_ANALYSIS: LensPattern = {
    name: "UX_ANALYSIS", 
    lenses: [LensType.EMOTIONAL, LensType.SYMBOLIC],
    focus: "User experience and interface intuition",
    description: "Analyzes user feelings and symbolic meaning in interface design"
  };

  static readonly SECURITY_AUDIT: LensPattern = {
    name: "SECURITY_AUDIT",
    lenses: [LensType.ETHICAL, LensType.LOGICAL],
    focus: "Comprehensive security and privacy assessment",
    description: "Combines moral/privacy implications with systematic security analysis"
  };
}

export class TriviumCore {
  private lensManager: LensManager;
  private sovereignties: Sovereignty[];

  constructor(sovereignties: Sovereignty[] = []) {
    this.lensManager = new LensManager();
    this.sovereignties = sovereignties;
  }

  /**
   * Process text through specified lenses
   */
  async processText(text: string, lenses: LensType[]): Promise<ProcessResult> {
    const outputs = await this.lensManager.processText(text, lenses, this.sovereignties);
    
    return {
      outputs: outputs as Record<LensType, string>
    };
  }

  /**
   * Process text using a predefined cognitive pattern
   */
  async processWithPattern(text: string, pattern: LensPattern): Promise<ProcessResult> {
    const outputs = await this.lensManager.processText(text, pattern.lenses, this.sovereignties);
    
    return {
      outputs: outputs as Record<LensType, string>,
      pattern
    };
  }

  /**
   * Process and synthesize outputs with specified blend
   */
  async processAndSynthesize(
    text: string, 
    lenses: LensType[], 
    blend: number = 0.5
  ): Promise<ProcessResult> {
    const outputs = await this.lensManager.processText(text, lenses, this.sovereignties);
    const synthesis = await this.lensManager.synthesizeOutputs(outputs, blend);
    
    return {
      outputs: outputs as Record<LensType, string>,
      synthesis,
      synthesisBlend: blend
    };
  }

  /**
   * Get suggested lens pattern based on context
   */
  getSuggestedPattern(context: string): LensPattern {
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('review') || contextLower.includes('audit')) {
      return LensPatterns.CODE_REVIEW;
    }
    if (contextLower.includes('debug') || contextLower.includes('bug') || contextLower.includes('error')) {
      return LensPatterns.DEBUGGING;
    }
    if (contextLower.includes('doc') || contextLower.includes('readme') || contextLower.includes('guide')) {
      return LensPatterns.DOCUMENTATION;
    }
    if (contextLower.includes('api') || contextLower.includes('endpoint')) {
      return LensPatterns.API_DESIGN;
    }
    if (contextLower.includes('ui') || contextLower.includes('ux') || contextLower.includes('user')) {
      return LensPatterns.UX_ANALYSIS;
    }
    if (contextLower.includes('security') || contextLower.includes('auth') || contextLower.includes('secure')) {
      return LensPatterns.SECURITY_AUDIT;
    }
    if (contextLower.includes('architecture') || contextLower.includes('design') || contextLower.includes('system')) {
      return LensPatterns.ARCHITECTURE;
    }
    
    // Default to architecture pattern for comprehensive analysis
    return LensPatterns.ARCHITECTURE;
  }

  /**
   * Set sovereignties data for enhanced processing
   */
  setSovereignties(sovereignties: Sovereignty[]): void {
    this.sovereignties = sovereignties;
  }

  /**
   * Get all available patterns
   */
  getAllPatterns(): LensPattern[] {
    return [
      LensPatterns.CODE_REVIEW,
      LensPatterns.DEBUGGING,
      LensPatterns.DOCUMENTATION,
      LensPatterns.ARCHITECTURE,
      LensPatterns.API_DESIGN,
      LensPatterns.UX_ANALYSIS,
      LensPatterns.SECURITY_AUDIT
    ];
  }
}

// Factory function for easy instantiation
export function createTriviumCore(sovereignties?: Sovereignty[]): TriviumCore {
  return new TriviumCore(sovereignties);
}

// Export types for TypeScript users  
export { type Sovereignty };