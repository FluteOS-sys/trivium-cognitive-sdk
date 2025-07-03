import { LensProcessor, LensType } from "./lensManager";
import { Sovereignty } from "../../shared/schema";

export interface CustomLens {
  id: string;
  name: string;
  description: string;
  prompt: string;
  perspective: string;
  archetypalCore: string;
  created: Date;
  author?: string;
}

export class CustomLensProcessor implements LensProcessor {
  constructor(private customLens: CustomLens) {}

  async process(text: string, sovereignties: Sovereignty[]): Promise<string> {
    // Create relevant sovereignty context
    const relevantSovereignties = sovereignties.slice(0, 5).map(s => 
      `${s.title}: ${s.core_freedom} (${s.dual_potential.join(' / ')})`
    ).join('\n');

    // Build comprehensive prompt with archetypal grounding
    const prompt = `
${this.customLens.prompt}

ARCHETYPAL CORE: ${this.customLens.archetypalCore}
PERSPECTIVE: ${this.customLens.perspective}

SOVEREIGNTY CONTEXT:
${relevantSovereignties}

ANALYZE THE FOLLOWING TEXT:
${text}

Provide insights from the ${this.customLens.name} perspective, grounding your analysis in the archetypal core and drawing upon the sovereignty patterns where relevant.
`;

    // For now, return structured response - in production this would call an LLM
    return `[${this.customLens.name} Analysis]

From the perspective of ${this.customLens.perspective}, examining through the archetypal lens of ${this.customLens.archetypalCore}:

The text reveals patterns that connect to deeper structural themes. When viewed through this cognitive lens, we can observe how the surface elements reflect underlying archetypal dynamics.

Key insights:
• The archetypal core of ${this.customLens.archetypalCore} manifests in the text's approach to [specific patterns]
• The perspective of ${this.customLens.perspective} reveals [deeper meanings]
• Connection to sovereignty patterns: [relevant sovereignty themes]

This analysis suggests that the text embodies both the constructive and shadow aspects of the ${this.customLens.archetypalCore} archetype.`;
  }
}

export class CustomLensManager {
  private customLenses: Map<string, CustomLens> = new Map();
  private customProcessors: Map<string, CustomLensProcessor> = new Map();

  // Archetypal foundation lenses that developers can build upon
  private archetypalBases = [
    {
      id: "creator",
      name: "Creator/Destroyer",
      description: "The archetypal force of creation and destruction, building and breaking down",
      archetypalCore: "Creative-Destructive Principle",
      examples: ["Innovation vs. Disruption", "Building vs. Refactoring", "Growth vs. Pruning"]
    },
    {
      id: "caregiver", 
      name: "Caregiver/Orphan",
      description: "Nurturing and being nurtured, protection and vulnerability",
      archetypalCore: "Care-Dependency Principle",
      examples: ["Documentation vs. Assumptions", "Error handling vs. Happy path", "Support vs. Self-reliance"]
    },
    {
      id: "ruler",
      name: "Ruler/Rebel",
      description: "Order and chaos, control and freedom, structure and flexibility",
      archetypalCore: "Order-Chaos Principle", 
      examples: ["Architecture vs. Agility", "Standards vs. Innovation", "Control vs. Autonomy"]
    },
    {
      id: "explorer",
      name: "Explorer/Innocent",
      description: "Seeking and discovering vs. simplicity and trust",
      archetypalCore: "Discovery-Simplicity Principle",
      examples: ["Complexity vs. Clarity", "Exploration vs. Convention", "Adventure vs. Safety"]
    },
    {
      id: "hero",
      name: "Hero/Everyman",
      description: "Individual excellence vs. collective belonging",
      archetypalCore: "Individual-Collective Principle",
      examples: ["Optimization vs. Accessibility", "Performance vs. Usability", "Elite vs. Democratic"]
    },
    {
      id: "lover",
      name: "Lover/Magician",
      description: "Connection and transformation, passion and alchemy",
      archetypalCore: "Connection-Transformation Principle",
      examples: ["Integration vs. Isolation", "Harmony vs. Efficiency", "Beauty vs. Function"]
    },
    {
      id: "sage",
      name: "Sage/Fool",
      description: "Wisdom and spontaneity, knowledge and intuition",
      archetypalCore: "Wisdom-Spontaneity Principle",
      examples: ["Best practices vs. Experimentation", "Analysis vs. Intuition", "Caution vs. Boldness"]
    }
  ];

  createCustomLens(lensData: Omit<CustomLens, 'id' | 'created'>): CustomLens {
    const lens: CustomLens = {
      ...lensData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date()
    };

    this.customLenses.set(lens.id, lens);
    this.customProcessors.set(lens.id, new CustomLensProcessor(lens));

    return lens;
  }

  getCustomLens(id: string): CustomLens | undefined {
    return this.customLenses.get(id);
  }

  getAllCustomLenses(): CustomLens[] {
    return Array.from(this.customLenses.values());
  }

  getCustomProcessor(id: string): CustomLensProcessor | undefined {
    return this.customProcessors.get(id);
  }

  deleteCustomLens(id: string): boolean {
    const deleted = this.customLenses.delete(id);
    this.customProcessors.delete(id);
    return deleted;
  }

  // Helper method to get archetypal foundation templates
  getArchetypalBases() {
    return this.archetypalBases;
  }

  // Validate custom lens against archetypal completeness
  validateArchetypalCoverage(lens: Omit<CustomLens, 'id' | 'created'>): {
    isValid: boolean;
    suggestions: string[];
    archetypalAlignment: string;
  } {
    const suggestions: string[] = [];
    
    // Check if the lens has clear archetypal grounding
    if (!lens.archetypalCore || lens.archetypalCore.length < 10) {
      suggestions.push("Define a clear archetypal core principle (e.g., 'Order-Chaos Principle')");
    }

    // Check if perspective is well-defined
    if (!lens.perspective || lens.perspective.length < 20) {
      suggestions.push("Expand the perspective description to show how this lens sees the world");
    }

    // Check if prompt has specific guidance
    if (!lens.prompt || lens.prompt.length < 50) {
      suggestions.push("Provide more specific guidance on how this lens should analyze content");
    }

    // Find closest archetypal alignment
    const archetypalAlignment = this.findClosestArchetypalBase(lens);

    return {
      isValid: suggestions.length === 0,
      suggestions,
      archetypalAlignment
    };
  }

  private findClosestArchetypalBase(lens: Omit<CustomLens, 'id' | 'created'>): string {
    // Simple keyword matching - in production this would be more sophisticated
    const lensText = `${lens.name} ${lens.description} ${lens.archetypalCore}`.toLowerCase();
    
    for (const base of this.archetypalBases) {
      const baseText = `${base.name} ${base.description}`.toLowerCase();
      if (lensText.includes(base.id) || baseText.includes(lens.name.toLowerCase())) {
        return base.name;
      }
    }
    
    return "General Archetypal Pattern";
  }

  // Generate suggested custom lenses based on gaps in current coverage
  generateSuggestedLenses(): Array<{
    name: string;
    description: string;
    archetypalCore: string;
    perspective: string;
    rationale: string;
  }> {
    return [
      {
        name: "Temporal Lens",
        description: "Analyzes time-based patterns, legacy vs. future, maintenance vs. innovation",
        archetypalCore: "Time-Eternity Principle",
        perspective: "Views everything through the lens of temporal dynamics and sustainability",
        rationale: "Missing temporal dimension in current ethical/emotional/logical/symbolic framework"
      },
      {
        name: "Energetic Lens", 
        description: "Examines energy flow, efficiency, sustainability, and resource consumption",
        archetypalCore: "Energy-Conservation Principle",
        perspective: "Sees all systems as energy transformations and flows",
        rationale: "Environmental and resource considerations often missing from technical analysis"
      },
      {
        name: "Relational Lens",
        description: "Focuses on relationships, dependencies, networks, and social dynamics",
        archetypalCore: "Connection-Isolation Principle",
        perspective: "Understands everything as part of interconnected relationship networks",
        rationale: "Social and systemic relationship patterns need dedicated lens"
      },
      {
        name: "Aesthetic Lens",
        description: "Evaluates beauty, elegance, harmony, and artistic expression",
        archetypalCore: "Beauty-Functionality Principle", 
        perspective: "Sees the world through patterns of beauty, elegance, and aesthetic harmony",
        rationale: "Beauty and aesthetic considerations are distinct from symbolic analysis"
      },
      {
        name: "Survival Lens",
        description: "Examines resilience, robustness, failure modes, and existential threats",
        archetypalCore: "Survival-Transcendence Principle",
        perspective: "Evaluates everything for survival potential and existential robustness",
        rationale: "Survival and risk assessment deserves dedicated archetypal perspective"
      }
    ];
  }
}

export const customLensManager = new CustomLensManager();