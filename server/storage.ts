import { 
  Session, 
  ProcessRequest, 
  InsertSession, 
  InsertProcessRequest, 
  ObserverInsight,
  Sovereignty
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Session management
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  
  // Process requests
  createProcessRequest(request: InsertProcessRequest): Promise<ProcessRequest>;
  getProcessRequestsBySession(sessionId: string): Promise<ProcessRequest[]>;
  
  // Observer insights
  getObserverInsights(sessionId: string): Promise<ObserverInsight[]>;
  addObserverInsight(sessionId: string, insight: Omit<ObserverInsight, 'id' | 'timestamp'>): Promise<ObserverInsight>;
  
  // Neuron map
  getSovereignties(): Promise<Sovereignty[]>;
  getActiveSovereignties(sessionId: string): Promise<number[]>;
  updateActiveSovereignties(sessionId: string, neuronIds: number[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private processRequests: Map<string, ProcessRequest>;
  private observerInsights: Map<string, ObserverInsight[]>;
  private sovereignties: Sovereignty[];
  private activeSovereignties: Map<string, number[]>;
  
  constructor() {
    this.sessions = new Map();
    this.processRequests = new Map();
    this.observerInsights = new Map();
    this.sovereignties = [];
    this.activeSovereignties = new Map();
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(session: InsertSession): Promise<Session> {
    const id = nanoid();
    const newSession: Session = {
      id,
      apiCalls: 0,
      activeNeurons: [],
      insights: [],
      createdAt: new Date(),
      ...session,
    };
    this.sessions.set(id, newSession);
    this.observerInsights.set(id, []);
    this.activeSovereignties.set(id, []);
    return newSession;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async createProcessRequest(request: InsertProcessRequest): Promise<ProcessRequest> {
    const id = nanoid();
    const newRequest: ProcessRequest = {
      id: parseInt(id, 16),
      createdAt: new Date(),
      sessionId: request.sessionId || null,
      text: request.text,
      lenses: request.lenses,
      outputs: request.outputs,
    };
    this.processRequests.set(id, newRequest);
    return newRequest;
  }

  async getProcessRequestsBySession(sessionId: string): Promise<ProcessRequest[]> {
    return Array.from(this.processRequests.values()).filter(req => req.sessionId === sessionId);
  }

  async getObserverInsights(sessionId: string): Promise<ObserverInsight[]> {
    return this.observerInsights.get(sessionId) || [];
  }

  async addObserverInsight(sessionId: string, insight: Omit<ObserverInsight, 'id' | 'timestamp'>): Promise<ObserverInsight> {
    const newInsight: ObserverInsight = {
      id: nanoid(),
      timestamp: new Date(),
      ...insight,
    };
    
    const insights = this.observerInsights.get(sessionId) || [];
    insights.push(newInsight);
    this.observerInsights.set(sessionId, insights);
    
    return newInsight;
  }

  async getSovereignties(): Promise<Sovereignty[]> {
    return this.sovereignties;
  }

  async getActiveSovereignties(sessionId: string): Promise<number[]> {
    return this.activeSovereignties.get(sessionId) || [];
  }

  async updateActiveSovereignties(sessionId: string, neuronIds: number[]): Promise<void> {
    this.activeSovereignties.set(sessionId, neuronIds);
  }

  // Method to initialize sovereignties from YAML
  setSovereignties(sovereignties: Sovereignty[]): void {
    this.sovereignties = sovereignties;
  }
}

export class DatabaseStorage implements IStorage {
  private sovereignties: Sovereignty[] = [];
  
  async getSession(id: string): Promise<Session | undefined> {
    try {
      const { db } = await import("./db");
      const { sessions } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
      return session || undefined;
    } catch (error) {
      console.error("Database error in getSession:", error);
      return undefined;
    }
  }

  async createSession(session: InsertSession): Promise<Session> {
    try {
      const { db } = await import("./db");
      const { sessions } = await import("@shared/schema");
      const { nanoid } = await import("nanoid");
      
      const sessionWithId = {
        id: nanoid(),
        ...session
      };
      
      const [newSession] = await db
        .insert(sessions)
        .values(sessionWithId)
        .returning();
      return newSession;
    } catch (error) {
      console.error("Database error in createSession:", error);
      throw new Error("Failed to create session");
    }
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession || undefined;
  }

  async createProcessRequest(request: InsertProcessRequest): Promise<ProcessRequest> {
    const [newRequest] = await db
      .insert(processRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getProcessRequestsBySession(sessionId: string): Promise<ProcessRequest[]> {
    return await db
      .select()
      .from(processRequests)
      .where(eq(processRequests.sessionId, sessionId));
  }

  async getObserverInsights(sessionId: string): Promise<ObserverInsight[]> {
    // For now return empty array - we'll add observer insights table later
    return [];
  }

  async addObserverInsight(sessionId: string, insight: Omit<ObserverInsight, 'id' | 'timestamp'>): Promise<ObserverInsight> {
    const newInsight: ObserverInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...insight,
      timestamp: new Date()
    };
    // For now return the insight - we'll persist to database later
    return newInsight;
  }

  async getSovereignties(): Promise<Sovereignty[]> {
    return memStorage.getSovereignties();
  }

  async getActiveSovereignties(sessionId: string): Promise<number[]> {
    // For now return empty array - we'll add this table later
    return [];
  }

  async updateActiveSovereignties(sessionId: string, neuronIds: number[]): Promise<void> {
    // For now do nothing - we'll implement this later
  }

  setSovereignties(sovereignties: Sovereignty[]): void {
    memStorage.setSovereignties(sovereignties);
  }
}

// Keep memory storage as backup
const memStorage = new MemStorage();

export const storage = new MemStorage();
