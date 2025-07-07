import { Eye, RefreshCw, Send, Info, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PayloadPreviewProps {
  generatedPayload: string;
  variableCount: number;
  lastUpdated: string;
  isProcessing: boolean;
  isSending: boolean;
  onRegenerate: () => void;
  onSend: () => void;
}

export function PayloadPreview({
  generatedPayload,
  variableCount,
  lastUpdated,
  isProcessing,
  isSending,
  onRegenerate,
  onSend
}: PayloadPreviewProps) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center">
          <Eye className="text-primary mr-2 w-5 h-5" />
          Generated Payload Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words">
            {generatedPayload || 'No payload generated yet...'}
          </pre>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 flex items-center">
              <Info className="text-primary mr-1 w-4 h-4" />
              {variableCount} variables detected
            </span>
            {lastUpdated && (
              <span className="text-sm text-gray-600 flex items-center">
                <Clock className="text-primary mr-1 w-4 h-4" />
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isProcessing || isSending || !generatedPayload}
              className="text-primary border-primary hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button
              onClick={onSend}
              disabled={isProcessing || isSending || !generatedPayload}
              size="sm"
            >
              <Send className={`w-4 h-4 mr-2 ${isSending ? 'animate-pulse' : ''}`} />
              {isSending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
