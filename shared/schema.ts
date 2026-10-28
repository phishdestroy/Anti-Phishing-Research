import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  payload: text("payload").notNull(),
  generatedPayload: text("generated_payload"),
  status: text("status").notNull().default("pending"), // pending, success, error
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  userAgent: text("user_agent"),
  proxy: text("proxy"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // INFO, PROC, SUCC, ERRO
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  requestId: integer("request_id").references(() => requests.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const variables = pgTable("variables", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => requests.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(), // uuid, random_string, bip39_word, custom
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Request schemas
export const insertRequestSchema = createInsertSchema(requests).pick({
  url: true,
  payload: true,
});

export const updateRequestSchema = createInsertSchema(requests).pick({
  generatedPayload: true,
  status: true,
  responseStatus: true,
  responseBody: true,
  userAgent: true,
  proxy: true,
}).partial();

// Log schemas
export const insertLogSchema = createInsertSchema(logs).pick({
  level: true,
  message: true,
  metadata: true,
  requestId: true,
});

// Variable schemas
export const insertVariableSchema = createInsertSchema(variables).pick({
  requestId: true,
  name: true,
  value: true,
  type: true,
});

// Request configuration schema
export const requestConfigSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  payload: z.string().min(1, "Payload is required"),
  enableRandomStrings: z.boolean().default(true),
  enableBip39Words: z.boolean().default(true),
  userAgentMode: z.enum(["random", "chrome", "firefox", "safari", "custom"]).default("random"),
  customUserAgent: z.string().optional(),
  proxyMode: z.enum(["none", "random", "custom"]).default("none"),
  customProxy: z.string().optional(),
});

// Types
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;

export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;

export type Variable = typeof variables.$inferSelect;
export type InsertVariable = z.infer<typeof insertVariableSchema>;

export type RequestConfig = z.infer<typeof requestConfigSchema>;
export type RequestConfigInput = z.input<typeof requestConfigSchema>;
