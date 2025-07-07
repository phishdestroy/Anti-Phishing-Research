import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { PayloadProcessor } from "./services/payload-processor";
import { RequestSender } from "./services/request-sender";
import { requestConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const processor = new PayloadProcessor();
  const sender = new RequestSender();

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket for real-time logs
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/ws'
  });
  
  // Store WebSocket connections
  const wsConnections = new Set<any>();

  wss.on('connection', (ws) => {
    wsConnections.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      wsConnections.delete(ws);
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast log to all connected WebSocket clients
  const broadcastLog = (log: any) => {
    const message = JSON.stringify({ type: 'log', data: log });
    wsConnections.forEach(ws => {
      if (ws.readyState === 1) { // WebSocket.OPEN
        ws.send(message);
      }
    });
  };

  // Override storage.createLog to broadcast logs
  const originalCreateLog = storage.createLog.bind(storage);
  storage.createLog = async (logData) => {
    const log = await originalCreateLog(logData);
    broadcastLog(log);
    return log;
  };

  // Process payload and detect variables
  app.post("/api/process-payload", async (req, res) => {
    try {
      const config = requestConfigSchema.parse(req.body);
      const result = await processor.processRequest(config);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Send HTTP request
  app.post("/api/send-request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const request = await storage.getRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      if (!request.generatedPayload) {
        return res.status(400).json({ error: "Request payload not processed" });
      }

      const config = requestConfigSchema.parse(req.body);

      // Log start of request
      await storage.createLog({
        level: 'PROC',
        message: `Preparing POST request to ${request.url}`,
        requestId: request.id,
      });

      // Send the request
      const result = await sender.sendRequest({
        url: request.url,
        payload: request.generatedPayload,
        userAgentMode: config.userAgentMode,
        customUserAgent: config.customUserAgent,
        proxyMode: config.proxyMode,
        customProxy: config.customProxy,
      });

      // Update request with results
      await storage.updateRequest(requestId, {
        status: result.success ? 'success' : 'error',
        responseStatus: result.statusCode,
        responseBody: result.responseBody || result.error,
        userAgent: result.userAgent,
        proxy: result.proxy,
      });

      // Log result
      if (result.success) {
        await storage.createLog({
          level: 'SUCC',
          message: `Request sent successfully - Status: ${result.statusCode}`,
          requestId: request.id,
          metadata: { 
            statusCode: result.statusCode, 
            duration: result.duration,
            userAgent: result.userAgent 
          },
        });
      } else {
        await storage.createLog({
          level: 'ERRO',
          message: `Request failed: ${result.error}`,
          requestId: request.id,
          metadata: { error: result.error, duration: result.duration },
        });
      }

      res.json({
        success: result.success,
        statusCode: result.statusCode,
        responseBody: result.responseBody,
        error: result.error,
        duration: result.duration,
      });

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get request details
  app.get("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getRequest(id);
      
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const variables = await storage.getVariablesByRequestId(id);
      res.json({ ...request, variables });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all requests
  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get logs
  app.get("/api/logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.getAllLogs(limit);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clear logs
  app.delete("/api/logs", async (req, res) => {
    try {
      await storage.clearLogs();
      await storage.createLog({
        level: 'INFO',
        message: 'Logs cleared by user',
        requestId: null,
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getRequestStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Detect variables in payload (without processing)
  app.post("/api/detect-variables", async (req, res) => {
    try {
      const { payload } = req.body;
      if (!payload) {
        return res.status(400).json({ error: "Payload is required" });
      }
      
      const variables = await processor.detectVariablesOnly(payload);
      res.json({ variables });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
