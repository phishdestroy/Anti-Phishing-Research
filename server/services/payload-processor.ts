import { PayloadVariableDetector } from './variable-generator';
import { storage } from '../storage';
import type { RequestConfig } from '@shared/schema';

export class PayloadProcessor {
  private detector: PayloadVariableDetector;

  constructor() {
    this.detector = new PayloadVariableDetector();
  }

  async processRequest(config: RequestConfig): Promise<{
    requestId: number;
    processedPayload: string;
    variables: Array<{ name: string; value: string; type: string }>;
  }> {
    // Create request record
    const request = await storage.createRequest({
      url: config.url,
      payload: config.payload,
    });

    // Log start of processing
    await storage.createLog({
      level: 'INFO',
      message: 'Starting payload processing',
      requestId: request.id,
      metadata: { originalPayload: config.payload },
    });

    // Process payload and generate variables
    const result = this.detector.processPayload(config.payload, {
      randomStrings: config.enableRandomStrings,
      bip39Words: config.enableBip39Words,
    });

    // Save generated variables
    for (const variable of result.variables) {
      await storage.createVariable({
        requestId: request.id,
        name: variable.name,
        value: variable.value,
        type: variable.type,
      });
    }

    // Update request with generated payload
    await storage.updateRequest(request.id, {
      generatedPayload: result.processedPayload,
    });

    // Log successful processing
    await storage.createLog({
      level: 'SUCC',
      message: `Generated ${result.variables.length} variables`,
      requestId: request.id,
      metadata: { variables: result.variables },
    });

    return {
      requestId: request.id,
      processedPayload: result.processedPayload,
      variables: result.variables,
    };
  }

  async detectVariablesOnly(payload: string): Promise<Array<{ name: string; type: string }>> {
    const variables = this.detector.detectVariables(payload);
    return variables.map(v => ({ name: v.name, type: v.type }));
  }
}
