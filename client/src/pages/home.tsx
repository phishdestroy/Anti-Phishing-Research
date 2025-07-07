import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { RequestConfiguration } from '@/components/request-configuration';
import { PayloadPreview } from '@/components/payload-preview';
import { StatusPanel } from '@/components/status-panel';
import { GeneratedValuesPanel } from '@/components/generated-values-panel';
import { LogsPanel } from '@/components/logs-panel';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { RequestConfig, Log } from '@shared/schema';

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected, lastMessage } = useWebSocket('/ws');
  
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [config, setConfig] = useState<RequestConfig | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);

  // Load initial logs
  const { data: initialLogs } = useQuery({
    queryKey: ['/api/logs'],
    queryFn: () => api.getLogs(100),
  });

  // Load stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  // Set initial logs
  useEffect(() => {
    if (initialLogs) {
      setLogs(initialLogs);
    }
  }, [initialLogs]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'log') {
      setLogs(prev => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  // Process payload mutation
  const processPayloadMutation = useMutation({
    mutationFn: (config: RequestConfig) => api.processPayload(config),
    onSuccess: (data) => {
      setCurrentRequest(data);
      toast({
        title: "Payload processed",
        description: `${data.variables.length} variables generated successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process payload",
        variant: "destructive",
      });
    },
  });

  // Send request mutation
  const sendRequestMutation = useMutation({
    mutationFn: (requestId: number) => {
      if (!config) throw new Error('No configuration available');
      return api.sendRequest(requestId, config);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: data.success ? "Request sent successfully" : "Request failed",
        description: data.success 
          ? `Status: ${data.statusCode}` 
          : data.error || "Unknown error",
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Send failed",
        description: error.message || "Failed to send request",
        variant: "destructive",
      });
    },
  });

  // Clear logs mutation
  const clearLogsMutation = useMutation({
    mutationFn: () => api.clearLogs(),
    onSuccess: () => {
      setLogs([]);
      queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      toast({
        title: "Logs cleared",
        description: "All logs have been cleared",
      });
    },
  });

  const handleConfigChange = (newConfig: RequestConfig) => {
    setConfig(newConfig);
    
    // Auto-process payload when config changes and is valid
    if (newConfig.url && newConfig.payload) {
      processPayloadMutation.mutate(newConfig);
    }
  };

  const handleRegenerate = () => {
    if (config) {
      processPayloadMutation.mutate(config);
    }
  };

  const handleSendRequest = () => {
    if (currentRequest?.requestId) {
      sendRequestMutation.mutate(currentRequest.requestId);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getCurrentStatus = () => {
    if (processPayloadMutation.isPending) return 'Processing';
    if (sendRequestMutation.isPending) return 'Sending';
    if (currentRequest) return 'Ready';
    return 'Ready';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isConnected={isConnected} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <RequestConfiguration
              onConfigChange={handleConfigChange}
              isProcessing={processPayloadMutation.isPending}
            />
            
            <PayloadPreview
              generatedPayload={currentRequest?.processedPayload || ''}
              variableCount={currentRequest?.variables?.length || 0}
              lastUpdated={currentRequest ? formatTime(new Date()) : ''}
              isProcessing={processPayloadMutation.isPending}
              isSending={sendRequestMutation.isPending}
              onRegenerate={handleRegenerate}
              onSend={handleSendRequest}
            />
          </div>

          {/* Right Column - Status and Variables */}
          <div className="space-y-6">
            <StatusPanel
              currentStatus={getCurrentStatus()}
              requestCount={stats?.total || 0}
              successRate={stats?.successRate || 0}
              isProcessing={processPayloadMutation.isPending || sendRequestMutation.isPending}
            />
            
            <GeneratedValuesPanel
              variables={currentRequest?.variables || []}
            />
          </div>
        </div>

        {/* Logs Panel */}
        <div className="mt-6">
          <LogsPanel
            logs={logs}
            onClearLogs={() => clearLogsMutation.mutate()}
            autoScroll={autoScroll}
            onAutoScrollChange={setAutoScroll}
            showTimestamps={showTimestamps}
            onShowTimestampsChange={setShowTimestamps}
          />
        </div>
      </main>
    </div>
  );
}
