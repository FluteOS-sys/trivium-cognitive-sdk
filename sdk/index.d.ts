// TypeScript definitions for trivium-cognitive-sdk
declare module 'trivium-cognitive-sdk' {
  export enum LensType {
    ETHICAL = 'ethical',
    EMOTIONAL = 'emotional',
    LOGICAL = 'logical',
    SYMBOLIC = 'symbolic',
    TEMPORAL = 'temporal',
    ENERGETIC = 'energetic',
    AESTHETIC = 'aesthetic',
    SURVIVAL = 'survival',
    RELATIONAL = 'relational',
    TRANSCENDENT = 'transcendent'
  }

  export interface LensPattern {
    name: string;
    lenses: LensType[];
    focus: string;
    description: string;
  }

  export interface ProcessResult {
    outputs: Record<string, string>;
    pattern?: string;
    focus?: string;
    description?: string;
    timestamp?: string;
    lensCount?: number;
    synthesis?: string;
    synthesisBlend?: number;
  }

  export interface Sovereignty {
    id: number;
    title: string;
    core_freedom: string;
    dual_potential: [string, string];
    associated_domains: string[];
    examples: {
      aligned: string;
      distorted: string;
    };
    symbolic_reference: string;
  }

  export class TriviumCore {
    constructor(sovereignties?: Sovereignty[]);
    
    processText(text: string, lenses: LensType[]): Promise<ProcessResult>;
    processWithPattern(text: string, pattern: LensPattern): Promise<ProcessResult>;
    processAndSynthesize(text: string, lenses: LensType[], blend?: number): Promise<ProcessResult>;
    getSuggestedPattern(context: string): LensPattern;
    getAllPatterns(): LensPattern[];
    setSovereignties(sovereignties: Sovereignty[]): void;
  }

  export class LocalLensProcessor {
    constructor(lensType: LensType);
    process(text: string, sovereignties?: Sovereignty[]): string;
  }

  export const LensPatterns: {
    CODE_REVIEW: LensPattern;
    DEBUGGING: LensPattern;
    DOCUMENTATION: LensPattern;
    ARCHITECTURE: LensPattern;
    SECURITY_AUDIT: LensPattern;
    UX_ANALYSIS: LensPattern;
    COMPLETE_ANALYSIS: LensPattern;
  };

  export function createTriviumCore(sovereignties?: Sovereignty[]): TriviumCore;
}