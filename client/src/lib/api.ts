import { apiRequest } from "./queryClient";

export interface ProcessRequest {
  text: string;
  lenses: string[];
}

export interface ProcessResponse {
  outputs: Record<string, string>;
}

export interface CompareRequest {
  text: string;
  lenses: string[];
}

export interface CompareResponse {
  text: string;
  lenses: string[];
  outputs: Record<string, string>;
  comparison: Array<{
    lens: string;
    output: string;
    wordCount: number;
  }>;
}

export interface SynthesizeRequest {
  text: string;
  lenses: string[];
  blend?: number;
}

export interface SynthesizeResponse {
  synthesis: string;
  outputs: Record<string, string>;
  blend: number;
  lenses: string[];
}

export interface ObserverState {
  apiCalls: number;
  nextPulse: number;
  activeNeurons: number[];
  insights: Array<{
    id: string;
    sovereignty: string;
    type: "light" | "shadow";
    message: string;
    timestamp: string;
  }>;
}

export interface SessionResponse {
  sessionId: string;
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

export interface SovereigntiesResponse {
  sovereignties: Sovereignty[];
}

class APIClient {
  private sessionId: string | null = null;

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.sessionId) {
      headers["x-session-id"] = this.sessionId;
    }
    return headers;
  }

  async createSession(): Promise<string> {
    const response = await apiRequest("POST", "/api/v1/session", {});
    const data: SessionResponse = await response.json();
    this.sessionId = data.sessionId;
    return data.sessionId;
  }

  async processText(request: ProcessRequest): Promise<ProcessResponse> {
    if (!this.sessionId) {
      await this.createSession();
    }
    
    const response = await fetch("/api/v1/process", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Process request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async compareOutputs(request: CompareRequest): Promise<CompareResponse> {
    if (!this.sessionId) {
      await this.createSession();
    }

    const response = await fetch("/api/v1/compare", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Compare request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async synthesizeOutputs(request: SynthesizeRequest): Promise<SynthesizeResponse> {
    if (!this.sessionId) {
      await this.createSession();
    }

    const response = await fetch("/api/v1/synthesize", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Synthesize request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getObserverState(): Promise<ObserverState> {
    if (!this.sessionId) {
      await this.createSession();
    }

    const response = await fetch("/api/v1/observer", {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Observer request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getSovereignties(): Promise<SovereigntiesResponse> {
    const response = await fetch("/api/v1/sovereignties", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Sovereignties request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const apiClient = new APIClient();
