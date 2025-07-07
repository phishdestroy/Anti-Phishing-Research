import { apiRequest } from './queryClient';
import type { RequestConfig } from '@shared/schema';

export const api = {
  // Process payload and detect variables
  processPayload: async (config: RequestConfig) => {
    const response = await apiRequest('POST', '/api/process-payload', config);
    return response.json();
  },

  // Send HTTP request
  sendRequest: async (requestId: number, config: RequestConfig) => {
    const response = await apiRequest('POST', `/api/send-request/${requestId}`, config);
    return response.json();
  },

  // Get request details
  getRequest: async (id: number) => {
    const response = await apiRequest('GET', `/api/requests/${id}`);
    return response.json();
  },

  // Get all requests
  getRequests: async () => {
    const response = await apiRequest('GET', '/api/requests');
    return response.json();
  },

  // Get logs
  getLogs: async (limit?: number) => {
    const url = limit ? `/api/logs?limit=${limit}` : '/api/logs';
    const response = await apiRequest('GET', url);
    return response.json();
  },

  // Clear logs
  clearLogs: async () => {
    const response = await apiRequest('DELETE', '/api/logs');
    return response.json();
  },

  // Get statistics
  getStats: async () => {
    const response = await apiRequest('GET', '/api/stats');
    return response.json();
  },

  // Detect variables without processing
  detectVariables: async (payload: string) => {
    const response = await apiRequest('POST', '/api/detect-variables', { payload });
    return response.json();
  },
};
