import { Shuffle, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GeneratedVariable {
  name: string;
  value: string;
  type: string;
}

interface GeneratedValuesPanelProps {
  variables: GeneratedVariable[];
}

export function GeneratedValuesPanel({ variables }: GeneratedValuesPanelProps) {
  const { toast } = useToast();

  const copyToClipboard = async (value: string, name: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: `${name} value copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center">
          <Shuffle className="text-primary mr-2 w-5 h-5" />
          Generated Values
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {variables.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Shuffle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">No variables generated yet</p>
            <p className="text-xs text-gray-400">Process a payload to see generated values</p>
          </div>
        ) : (
          <div className="space-y-3">
            {variables.map((variable, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 block">
                    {variable.name}
                  </span>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {variable.value}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(variable.value, variable.name)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
