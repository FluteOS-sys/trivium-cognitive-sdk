import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { LensManager } from "./services/lensManager";
import { KrishnaLayer } from "./services/krishnaLayer";
import { customLensManager } from "./services/customLensManager";
import { 
  processRequestSchema, 
  compareRequestSchema, 
  synthesizeRequestSchema,
  Sovereignty
} from "@shared/schema";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { fileURLToPath } from 'url';

const lensManager = new LensManager();
const krishnaLayer = new KrishnaLayer();

// Load sovereignties from YAML file
function loadSovereignties(): Sovereignty[] {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const yamlPath = path.join(__dirname, "data", "neurons.yaml");
    const yamlContent = fs.readFileSync(yamlPath, "utf8");
    const data = yaml.parse(yamlContent);
    return data.sovereignties || [];
  } catch (error) {
    console.error("Error loading sovereignties:", error);
    return [];
  }
}

// Initialize storage with sovereignties
const sovereignties = loadSovereignties();
storage.setSovereignties(sovereignties);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management
  app.post("/api/v1/session", async (req, res) => {
    try {
      const session = await storage.createSession({});
      res.json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Process endpoint - multi-lens text processing
  app.post("/api/v1/process", async (req, res) => {
    try {
      const { text, lenses } = processRequestSchema.parse(req.body);
      const sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      // Process text through selected lenses
      const outputs = await lensManager.processText(text, lenses, sovereignties);
      
      // Store request
      await storage.createProcessRequest({
        sessionId,
        text,
        lenses,
        outputs,
      });

      // Observer interaction
      await krishnaLayer.observeInteraction(sessionId, "process", { text, lenses });

      res.json({ outputs });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to process text" });
      }
    }
  });

  // Compare endpoint - side-by-side lens comparison
  app.post("/api/v1/compare", async (req, res) => {
    try {
      const { text, lenses } = compareRequestSchema.parse(req.body);
      const sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      // Process text through selected lenses
      const outputs = await lensManager.processText(text, lenses, sovereignties);
      
      // Format for comparison
      const comparison = {
        text,
        lenses,
        outputs,
        comparison: lenses.map(lens => ({
          lens,
          output: outputs[lens],
          wordCount: outputs[lens]?.split(" ").length || 0,
        })),
      };

      // Observer interaction
      await krishnaLayer.observeInteraction(sessionId, "compare", { text, lenses });

      res.json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to compare outputs" });
      }
    }
  });

  // Synthesize endpoint - blend multiple lens outputs
  app.post("/api/v1/synthesize", async (req, res) => {
    try {
      const { text, lenses, blend } = synthesizeRequestSchema.parse(req.body);
      const sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      // Process text through selected lenses
      const outputs = await lensManager.processText(text, lenses, sovereignties);
      
      // Synthesize outputs
      const synthesis = await lensManager.synthesizeOutputs(outputs, blend);

      // Observer interaction
      await krishnaLayer.observeInteraction(sessionId, "synthesize", { text, lenses, blend });

      res.json({ 
        synthesis,
        outputs,
        blend,
        lenses 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to synthesize outputs" });
      }
    }
  });

  // Observer endpoint - Krishna Layer insights
  app.get("/api/v1/observer", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const observerState = await krishnaLayer.getObserverState(sessionId);
      
      res.json(observerState);
    } catch (error) {
      res.status(500).json({ error: "Failed to get observer state" });
    }
  });

  // Sovereignties endpoint - get neuron map
  app.get("/api/v1/sovereignties", async (req, res) => {
    try {
      const sovereignties = await storage.getSovereignties();
      res.json({ sovereignties });
    } catch (error) {
      res.status(500).json({ error: "Failed to get sovereignties" });
    }
  });

  // Custom lens management endpoints
  app.post("/api/v1/custom-lenses", async (req, res) => {
    try {
      const lensData = req.body;
      
      // Validate archetypal coverage
      const validation = customLensManager.validateArchetypalCoverage(lensData);
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: "Invalid lens configuration", 
          suggestions: validation.suggestions 
        });
      }
      
      const customLens = customLensManager.createCustomLens(lensData);
      res.json({ 
        lens: customLens, 
        archetypalAlignment: validation.archetypalAlignment 
      });
    } catch (error) {
      console.error("Error creating custom lens:", error);
      res.status(500).json({ error: "Failed to create custom lens" });
    }
  });

  app.get("/api/v1/custom-lenses", async (req, res) => {
    try {
      const customLenses = customLensManager.getAllCustomLenses();
      res.json({ customLenses });
    } catch (error) {
      console.error("Error getting custom lenses:", error);
      res.status(500).json({ error: "Failed to get custom lenses" });
    }
  });

  app.get("/api/v1/custom-lenses/archetypal-bases", async (req, res) => {
    try {
      const bases = customLensManager.getArchetypalBases();
      res.json({ archetypalBases: bases });
    } catch (error) {
      console.error("Error getting archetypal bases:", error);
      res.status(500).json({ error: "Failed to get archetypal bases" });
    }
  });

  app.get("/api/v1/custom-lenses/suggestions", async (req, res) => {
    try {
      const suggestions = customLensManager.generateSuggestedLenses();
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting lens suggestions:", error);
      res.status(500).json({ error: "Failed to get lens suggestions" });
    }
  });

  app.delete("/api/v1/custom-lenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = customLensManager.deleteCustomLens(id);
      
      if (deleted) {
        res.json({ message: "Custom lens deleted successfully" });
      } else {
        res.status(404).json({ error: "Custom lens not found" });
      }
    } catch (error) {
      console.error("Error deleting custom lens:", error);
      res.status(500).json({ error: "Failed to delete custom lens" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
