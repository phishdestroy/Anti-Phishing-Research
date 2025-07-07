import { useState, useEffect, useRef } from 'react';
import { Terminal, Download, Trash2, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Log } from '@shared/schema';

interface LogsPanelProps {
  logs: Log[];
  onClearLogs: () => void;
  autoScroll: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  showTimestamps: boolean;
  onShowTimestampsChange: (enabled: boolean) => void;
}

export function LogsPanel({
  logs,
  onClearLogs,
  autoScroll,
  onAutoScrollChange,
  showTimestamps,
  onShowTimestampsChange,
}: LogsPanelProps) {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-400';
      case 'PROC':
        return 'text-yellow-400';
      case 'SUCC':
        return 'text-green-400';
      case 'ERRO':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const exportLogs = () => {
    const logText = logs
      .map(log => `[${formatTime(log.createdAt)}] ${log.level}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anti-phishing-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs exported",
      description: "Log file has been downloaded",
    });
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      onClearLogs();
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Terminal className="text-primary mr-2 w-5 h-5" />
            Activity Logs
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="text-gray-600 hover:text-gray-900"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="text-gray-600 hover:text-gray-900"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="bg-gray-900 rounded-lg p-4 h-80 relative">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Terminal className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                  <p className="text-sm">No logs yet</p>
                  <p className="text-xs text-gray-600">Activity will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-sm">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    {showTimestamps && (
                      <span className="text-gray-400 text-xs min-w-[80px]">
                        [{formatTime(log.createdAt)}]
                      </span>
                    )}
                    <span className={`text-xs min-w-[60px] ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-gray-100 flex-1 break-words">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {autoScroll && logs.length > 0 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center text-gray-500 text-xs">
              <ArrowDown className="w-3 h-3 mr-1" />
              Auto-scrolling enabled
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Terminal className="w-4 h-4 mr-1" />
            {logs.length} log entries
          </span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={autoScroll}
                onCheckedChange={onAutoScrollChange}
              />
              <span>Auto-scroll</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={showTimestamps}
                onCheckedChange={onShowTimestampsChange}
              />
              <span>Show timestamps</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
