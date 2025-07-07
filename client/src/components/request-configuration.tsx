import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, ClipboardType, Cog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { requestConfigSchema, type RequestConfig } from '@shared/schema';

interface RequestConfigurationProps {
  onConfigChange: (config: RequestConfig) => void;
  isProcessing: boolean;
}

export function RequestConfiguration({ onConfigChange, isProcessing }: RequestConfigurationProps) {
  const { toast } = useToast();
  
  const form = useForm<RequestConfig>({
    resolver: zodResolver(requestConfigSchema),
    defaultValues: {
      url: '',
      payload: '',
      enableRandomStrings: true,
      enableBip39Words: true,
      userAgentMode: 'random',
      proxyMode: 'none',
    },
  });

  const handlePasteFromBrowser = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue('payload', text);
        toast({
          title: "Payload pasted",
          description: "Content has been pasted from clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "ClipboardType failed",
        description: "Could not access clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onConfigChange(values);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center">
          <Cog className="text-primary mr-2 w-5 h-5" />
          Request Configuration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6" onChange={handleFormChange}>
            {/* URL Input */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Target URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example-phishing-site.com"
                        className="pr-10"
                      />
                    </FormControl>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payload Input */}
            <FormField
              control={form.control}
              name="payload"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      POST Payload <span className="text-red-500">*</span>
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handlePasteFromBrowser}
                      className="text-primary hover:text-blue-700"
                    >
                      <ClipboardType className="w-4 h-4 mr-1" />
                      ClipboardType from Browser
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="access_key={access_key}&subject=Submitted+Ledger+Live+Recovery+Phrase&redirect=https%3Aledger.com&botcheck={botcheck}&word01={word01}&word02={word02}&word03={word03}"
                      className="font-mono text-sm resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Use placeholders like {'{access_key}'}, {'{word01}'}, {'{botcheck}'} for auto-generation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Variable Generation Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Variable Generation Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enableRandomStrings"
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Random Strings</span>
                        <p className="text-xs text-gray-500">UUID, alphanumeric</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableBip39Words"
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">BIP39 Words</span>
                        <p className="text-xs text-gray-500">Valid mnemonic words</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Anonymization Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Anonymization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userAgentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">User Agent</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="random">Random Rotation</SelectItem>
                          <SelectItem value="chrome">Chrome (Latest)</SelectItem>
                          <SelectItem value="firefox">Firefox (Latest)</SelectItem>
                          <SelectItem value="safari">Safari (Latest)</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="proxyMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">Proxy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Proxy</SelectItem>
                          <SelectItem value="random">Random Proxy</SelectItem>
                          <SelectItem value="custom">Custom Proxy</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Custom fields for user agent and proxy */}
            {form.watch('userAgentMode') === 'custom' && (
              <FormField
                control={form.control}
                name="customUserAgent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom User Agent</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter custom user agent string..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('proxyMode') === 'custom' && (
              <FormField
                control={form.control}
                name="customProxy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Proxy</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="http://username:password@proxy.example.com:8080" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
