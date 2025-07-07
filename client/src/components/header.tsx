import { Shield, Settings, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="text-2xl text-primary w-8 h-8" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Anti-Phishing Research Tool
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${
              isConnected 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <Circle className="w-2 h-2 mr-1 fill-current" />
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Button variant="ghost" size="sm" title="Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
