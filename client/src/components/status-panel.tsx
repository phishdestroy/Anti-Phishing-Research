import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatusPanelProps {
  currentStatus: string;
  requestCount: number;
  successRate: number;
  isProcessing: boolean;
  progress?: number;
}

export function StatusPanel({ 
  currentStatus, 
  requestCount, 
  successRate, 
  isProcessing, 
  progress 
}: StatusPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'bg-yellow-50 text-yellow-700';
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      case 'sending':
        return 'bg-blue-50 text-blue-700';
      case 'complete':
      case 'success':
        return 'bg-green-50 text-green-700';
      case 'error':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center">
          <TrendingUp className="text-primary mr-2 w-5 h-5" />
          Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Task</span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Requests Sent</span>
          <span className="text-sm font-semibold text-gray-900">{requestCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Success Rate</span>
          <span className="text-sm font-semibold text-green-600">
            {requestCount > 0 ? `${successRate.toFixed(1)}%` : '--'}
          </span>
        </div>

        {/* Progress Bar */}
        {isProcessing && progress !== undefined && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
