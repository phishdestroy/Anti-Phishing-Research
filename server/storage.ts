import { requests, logs, variables, type Request, type InsertRequest, type UpdateRequest, type Log, type InsertLog, type Variable, type InsertVariable } from "@shared/schema";

export interface IStorage {
  // Requests
  createRequest(request: InsertRequest): Promise<Request>;
  getRequest(id: number): Promise<Request | undefined>;
  updateRequest(id: number, updates: UpdateRequest): Promise<Request | undefined>;
  getAllRequests(): Promise<Request[]>;

  // Logs
  createLog(log: InsertLog): Promise<Log>;
  getLogsByRequestId(requestId: number): Promise<Log[]>;
  getAllLogs(limit?: number): Promise<Log[]>;
  clearLogs(): Promise<void>;

  // Variables
  createVariable(variable: InsertVariable): Promise<Variable>;
  getVariablesByRequestId(requestId: number): Promise<Variable[]>;
  
  // Statistics
  getRequestStats(): Promise<{
    total: number;
    success: number;
    error: number;
    successRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private requests: Map<number, Request>;
  private logs: Map<number, Log>;
  private variables: Map<number, Variable>;
  private currentRequestId: number;
  private currentLogId: number;
  private currentVariableId: number;

  constructor() {
    this.requests = new Map();
    this.logs = new Map();
    this.variables = new Map();
    this.currentRequestId = 1;
    this.currentLogId = 1;
    this.currentVariableId = 1;
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const id = this.currentRequestId++;
    const request: Request = {
      ...insertRequest,
      id,
      generatedPayload: null,
      status: "pending",
      responseStatus: null,
      responseBody: null,
      userAgent: null,
      proxy: null,
      createdAt: new Date(),
    };
    this.requests.set(id, request);
    return request;
  }

  async getRequest(id: number): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async updateRequest(id: number, updates: UpdateRequest): Promise<Request | undefined> {
    const existing = this.requests.get(id);
    if (!existing) return undefined;
    
    const updated: Request = { ...existing, ...updates };
    this.requests.set(id, updated);
    return updated;
  }

  async getAllRequests(): Promise<Request[]> {
    return Array.from(this.requests.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const id = this.currentLogId++;
    const log: Log = {
      ...insertLog,
      id,
      metadata: insertLog.metadata || null,
      requestId: insertLog.requestId || null,
      createdAt: new Date(),
    };
    this.logs.set(id, log);
    return log;
  }

  async getLogsByRequestId(requestId: number): Promise<Log[]> {
    return Array.from(this.logs.values())
      .filter(log => log.requestId === requestId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getAllLogs(limit?: number): Promise<Log[]> {
    const allLogs = Array.from(this.logs.values())
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return limit ? allLogs.slice(-limit) : allLogs;
  }

  async clearLogs(): Promise<void> {
    this.logs.clear();
  }

  async createVariable(insertVariable: InsertVariable): Promise<Variable> {
    const id = this.currentVariableId++;
    const variable: Variable = {
      ...insertVariable,
      id,
      requestId: insertVariable.requestId || null,
      createdAt: new Date(),
    };
    this.variables.set(id, variable);
    return variable;
  }

  async getVariablesByRequestId(requestId: number): Promise<Variable[]> {
    return Array.from(this.variables.values())
      .filter(variable => variable.requestId === requestId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getRequestStats(): Promise<{
    total: number;
    success: number;
    error: number;
    successRate: number;
  }> {
    const allRequests = Array.from(this.requests.values());
    const total = allRequests.length;
    const success = allRequests.filter(r => r.status === "success").length;
    const error = allRequests.filter(r => r.status === "error").length;
    const successRate = total > 0 ? (success / total) * 100 : 0;

    return { total, success, error, successRate };
  }
}

export const storage = new MemStorage();
