import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  apiCalls: integer("api_calls").default(0),
  activeNeurons: jsonb("active_neurons").default([]),
  insights: jsonb("insights").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const processRequests = pgTable("process_requests", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => sessions.id),
  text: text("text").notNull(),
  lenses: jsonb("lenses").notNull(),
  outputs: jsonb("outputs").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lensOutputSchema = z.object({
  ethical: z.string().optional(),
  emotional: z.string().optional(),
  logical: z.string().optional(),
  symbolic: z.string().optional(),
});

export const processRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  lenses: z.array(z.enum(["ethical", "emotional", "logical", "symbolic"])).min(1, "At least one lens is required"),
});

export const compareRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  lenses: z.array(z.enum(["ethical", "emotional", "logical", "symbolic"])).min(2, "At least two lenses required for comparison"),
});

export const synthesizeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  lenses: z.array(z.enum(["ethical", "emotional", "logical", "symbolic"])).min(1, "At least one lens is required"),
  blend: z.number().min(0).max(1).optional().default(0.5),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true });
export const insertProcessRequestSchema = createInsertSchema(processRequests).omit({ id: true, createdAt: true });

export type Session = typeof sessions.$inferSelect;
export type ProcessRequest = typeof processRequests.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertProcessRequest = z.infer<typeof insertProcessRequestSchema>;
export type LensOutput = z.infer<typeof lensOutputSchema>;
export type ProcessRequestInput = z.infer<typeof processRequestSchema>;
export type CompareRequestInput = z.infer<typeof compareRequestSchema>;
export type SynthesizeRequestInput = z.infer<typeof synthesizeRequestSchema>;

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

export interface ObserverInsight {
  id: string;
  sovereignty: string;
  type: "light" | "shadow";
  message: string;
  timestamp: Date;
}
