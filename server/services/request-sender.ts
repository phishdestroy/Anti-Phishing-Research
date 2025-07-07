import axios, { AxiosResponse } from 'axios';

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36'
];

export interface RequestResult {
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
  userAgent: string;
  proxy?: string;
  duration: number;
}

export interface RequestOptions {
  url: string;
  payload: string;
  userAgentMode: 'random' | 'chrome' | 'firefox' | 'safari' | 'custom';
  customUserAgent?: string;
  proxyMode: 'none' | 'random' | 'custom';
  customProxy?: string;
  timeout?: number;
}

export class RequestSender {
  private getRandomUserAgent(): string {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  }

  private getUserAgent(mode: string, custom?: string): string {
    switch (mode) {
      case 'chrome':
        return USER_AGENTS.find(ua => ua.includes('Chrome') && !ua.includes('Edge')) || USER_AGENTS[0];
      case 'firefox':
        return USER_AGENTS.find(ua => ua.includes('Firefox')) || USER_AGENTS[2];
      case 'safari':
        return USER_AGENTS.find(ua => ua.includes('Safari') && !ua.includes('Chrome')) || USER_AGENTS[3];
      case 'custom':
        return custom || this.getRandomUserAgent();
      default:
        return this.getRandomUserAgent();
    }
  }

  async sendRequest(options: RequestOptions): Promise<RequestResult> {
    const startTime = Date.now();
    const userAgent = this.getUserAgent(options.userAgentMode, options.customUserAgent);
    
    try {
      const axiosConfig: any = {
        method: 'POST',
        url: options.url,
        data: options.payload,
        headers: {
          'User-Agent': userAgent,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: options.timeout || 30000,
        validateStatus: () => true, // Don't throw on any status code
      };

      // Add proxy configuration if specified
      if (options.proxyMode === 'custom' && options.customProxy) {
        // Parse proxy URL
        const proxyUrl = new URL(options.customProxy);
        axiosConfig.proxy = {
          host: proxyUrl.hostname,
          port: parseInt(proxyUrl.port) || 8080,
          protocol: proxyUrl.protocol.replace(':', ''),
        };
        
        if (proxyUrl.username && proxyUrl.password) {
          axiosConfig.proxy.auth = {
            username: proxyUrl.username,
            password: proxyUrl.password,
          };
        }
      }

      const response: AxiosResponse = await axios(axiosConfig);
      const duration = Date.now() - startTime;

      return {
        success: response.status >= 200 && response.status < 400,
        statusCode: response.status,
        responseBody: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
        userAgent,
        proxy: options.proxyMode === 'custom' ? options.customProxy : undefined,
        duration,
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        userAgent,
        proxy: options.proxyMode === 'custom' ? options.customProxy : undefined,
        duration,
      };
    }
  }
}
