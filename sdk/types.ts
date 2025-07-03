// Core SDK types for export
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

export interface ProcessResult {
  outputs: Record<string, string>;
  pattern?: any;
  synthesisBlend?: number;
  synthesis?: string;
}

export interface LensPattern {
  name: string;
  lenses: string[];
  focus: string;
  description: string;
}

export interface CustomLensDefinition {
  name: string;
  description: string;
  prompt: string;
  perspective: string;
  archetypalCore: string;
}