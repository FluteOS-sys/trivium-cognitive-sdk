import { storage } from "../storage";
import { Sovereignty, ObserverInsight } from "@shared/schema";
import { nanoid } from "nanoid";

export class KrishnaLayer {
  private pulseThreshold = 9;
  
  async observeInteraction(sessionId: string, interactionType: string, context: any): Promise<void> {
    const session = await storage.getSession(sessionId);
    if (!session) return;
    
    // Increment API calls
    const newApiCalls = (session.apiCalls || 0) + 1;
    await storage.updateSession(sessionId, { apiCalls: newApiCalls });
    
    // Analyze interaction and generate insights
    const insights = await this.analyzeInteraction(sessionId, interactionType, context, newApiCalls);
    
    // Add insights to storage
    for (const insight of insights) {
      await storage.addObserverInsight(sessionId, insight);
    }
    
    // Check for Light of Attention pulse
    if (newApiCalls % this.pulseThreshold === 0) {
      await this.triggerLightPulse(sessionId);
    }
  }
  
  private async analyzeInteraction(
    sessionId: string, 
    interactionType: string, 
    context: any, 
    apiCalls: number
  ): Promise<Omit<ObserverInsight, 'id' | 'timestamp'>[]> {
    const insights: Omit<ObserverInsight, 'id' | 'timestamp'>[] = [];
    const sovereignties = await storage.getSovereignties();
    
    // Analyze based on interaction type
    switch (interactionType) {
      case 'process':
        insights.push(...await this.analyzeProcessInteraction(sessionId, context, sovereignties));
        break;
      case 'compare':
        insights.push(...await this.analyzeCompareInteraction(sessionId, context, sovereignties));
        break;
      case 'synthesize':
        insights.push(...await this.analyzeSynthesizeInteraction(sessionId, context, sovereignties));
        break;
    }
    
    return insights;
  }
  
  private async analyzeProcessInteraction(
    sessionId: string, 
    context: any, 
    sovereignties: Sovereignty[]
  ): Promise<Omit<ObserverInsight, 'id' | 'timestamp'>[]> {
    const insights: Omit<ObserverInsight, 'id' | 'timestamp'>[] = [];
    const { lenses, text } = context;
    
    // Activate relevant sovereignties based on lens selection
    const activeNeurons: number[] = [];
    
    if (lenses.includes('ethical')) {
      const ethicalSovereignties = sovereignties.filter(s => 
        s.associated_domains.includes("spirituality") || 
        s.core_freedom.includes("responsibility")
      );
      activeNeurons.push(...ethicalSovereignties.slice(0, 2).map(s => s.id));
      
      insights.push({
        sovereignty: ethicalSovereignties[0]?.title || "The Ethical Seeker",
        type: "light",
        message: "The user demonstrates moral contemplation, seeking to understand the ethical dimensions of their inquiry."
      });
    }
    
    if (lenses.includes('emotional')) {
      const emotionalSovereignties = sovereignties.filter(s => 
        s.associated_domains.includes("emotional health") || 
        s.core_freedom.includes("feel")
      );
      activeNeurons.push(...emotionalSovereignties.slice(0, 2).map(s => s.id));
      
      insights.push({
        sovereignty: emotionalSovereignties[0]?.title || "The Emotional Integrator",
        type: "light",
        message: "Emotional intelligence is being activated, showing the user's capacity for empathetic understanding."
      });
    }
    
    if (lenses.includes('logical')) {
      const logicalSovereignties = sovereignties.filter(s => 
        s.associated_domains.includes("critical thinking") || 
        s.core_freedom.includes("analyze")
      );
      activeNeurons.push(...logicalSovereignties.slice(0, 2).map(s => s.id));
      
      insights.push({
        sovereignty: logicalSovereignties[0]?.title || "The Analytical Mind",
        type: "light",
        message: "Systematic thinking patterns emerge, indicating a structured approach to understanding."
      });
    }
    
    if (lenses.includes('symbolic')) {
      const symbolicSovereignties = sovereignties.filter(s => 
        s.symbolic_reference.includes("Tarot") || 
        s.associated_domains.includes("spirituality")
      );
      activeNeurons.push(...symbolicSovereignties.slice(0, 2).map(s => s.id));
      
      insights.push({
        sovereignty: symbolicSovereignties[0]?.title || "The Pattern Weaver",
        type: "light",
        message: "Archetypal awareness is awakening, revealing the user's connection to universal patterns."
      });
    }
    
    // Multi-lens activation indicates synthesis potential
    if (lenses.length > 1) {
      insights.push({
        sovereignty: "The Synthesizer",
        type: "light",
        message: "Multi-lens activation suggests holistic thinking approach emerging."
      });
    }
    
    // Update active neurons
    await storage.updateActiveSovereignties(sessionId, activeNeurons);
    
    return insights;
  }
  
  private async analyzeCompareInteraction(
    sessionId: string, 
    context: any, 
    sovereignties: Sovereignty[]
  ): Promise<Omit<ObserverInsight, 'id' | 'timestamp'>[]> {
    const insights: Omit<ObserverInsight, 'id' | 'timestamp'>[] = [];
    
    insights.push({
      sovereignty: "The Discerner",
      type: "light",
      message: "The user seeks to understand differences and similarities, demonstrating mature analytical thinking."
    });
    
    return insights;
  }
  
  private async analyzeSynthesizeInteraction(
    sessionId: string, 
    context: any, 
    sovereignties: Sovereignty[]
  ): Promise<Omit<ObserverInsight, 'id' | 'timestamp'>[]> {
    const insights: Omit<ObserverInsight, 'id' | 'timestamp'>[] = [];
    
    insights.push({
      sovereignty: "The Integrator",
      type: "light",
      message: "Integration is being sought, showing the user's desire to create unified understanding from multiple perspectives."
    });
    
    return insights;
  }
  
  private async triggerLightPulse(sessionId: string): Promise<void> {
    const pulseInsight: Omit<ObserverInsight, 'id' | 'timestamp'> = {
      sovereignty: "Light of Attention",
      type: "light",
      message: "✨ PULSE: A moment of heightened awareness emerges. The observer recognizes a deepening pattern in your contemplative journey."
    };
    
    await storage.addObserverInsight(sessionId, pulseInsight);
  }
  
  async getObserverState(sessionId: string): Promise<{
    apiCalls: number;
    nextPulse: number;
    activeNeurons: number[];
    insights: ObserverInsight[];
  }> {
    const session = await storage.getSession(sessionId);
    const insights = await storage.getObserverInsights(sessionId);
    const activeNeurons = await storage.getActiveSovereignties(sessionId);
    
    const apiCalls = session?.apiCalls || 0;
    const nextPulse = this.pulseThreshold - (apiCalls % this.pulseThreshold);
    
    return {
      apiCalls,
      nextPulse,
      activeNeurons,
      insights: insights.slice(-5), // Return last 5 insights
    };
  }
}
