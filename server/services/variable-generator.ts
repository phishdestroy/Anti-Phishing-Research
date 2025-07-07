import { randomBytes, randomUUID } from 'crypto';

// BIP39 wordlist (subset for demonstration)
const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
  'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
  'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
  'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
  'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
  'arcade', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed',
  'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art',
  'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist',
  'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract',
  'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average',
  'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward'
];

export interface VariableGenerator {
  generateUUID(): string;
  generateRandomString(length?: number): string;
  generateBip39Word(): string;
  generateBip39Phrase(wordCount?: number): string;
  generateAlphanumeric(length?: number): string;
  generateNumeric(length?: number): string;
}

export class DefaultVariableGenerator implements VariableGenerator {
  generateUUID(): string {
    return randomUUID();
  }

  generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    
    return result;
  }

  generateBip39Word(): string {
    const randomIndex = Math.floor(Math.random() * BIP39_WORDS.length);
    return BIP39_WORDS[randomIndex];
  }

  generateBip39Phrase(wordCount: number = 3): string {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(this.generateBip39Word());
    }
    return words.join(' ');
  }

  generateAlphanumeric(length: number = 8): string {
    return this.generateRandomString(length);
  }

  generateNumeric(length: number = 6): string {
    const bytes = randomBytes(length);
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += (bytes[i] % 10).toString();
    }
    
    return result;
  }
}

export interface DetectedVariable {
  name: string;
  type: 'uuid' | 'random_string' | 'bip39_word' | 'bip39_phrase' | 'alphanumeric' | 'numeric';
  length?: number;
  wordCount?: number;
}

export class PayloadVariableDetector {
  private generator: VariableGenerator;

  constructor(generator: VariableGenerator = new DefaultVariableGenerator()) {
    this.generator = generator;
  }

  detectVariables(payload: string): DetectedVariable[] {
    const variableRegex = /\{([^}]+)\}/g;
    const variables: DetectedVariable[] = [];
    const seen = new Set<string>();
    let match;

    while ((match = variableRegex.exec(payload)) !== null) {
      const fullMatch = match[1];
      const name = fullMatch.split('=')[0].trim();
      
      if (seen.has(name)) continue;
      seen.add(name);

      const variable = this.analyzeVariableName(name);
      variables.push(variable);
    }

    return variables;
  }

  private analyzeVariableName(name: string): DetectedVariable {
    const lowerName = name.toLowerCase();
    
    // Check for UUID patterns
    if (lowerName.includes('uuid') || lowerName.includes('id') || lowerName.includes('key')) {
      return { name, type: 'uuid' };
    }
    
    // Check for BIP39 word patterns
    if (lowerName.includes('word') || lowerName.includes('mnemonic') || lowerName.includes('phrase')) {
      if (lowerName.includes('phrase') || lowerName.match(/word\d+/)) {
        return { name, type: 'bip39_word' };
      }
      return { name, type: 'bip39_phrase', wordCount: 3 };
    }
    
    // Check for numeric patterns
    if (lowerName.includes('num') || lowerName.includes('code') || lowerName.includes('pin')) {
      return { name, type: 'numeric', length: 6 };
    }
    
    // Default to random string
    return { name, type: 'random_string', length: 8 };
  }

  generateVariableValue(variable: DetectedVariable): string {
    switch (variable.type) {
      case 'uuid':
        return this.generator.generateUUID();
      case 'bip39_word':
        return this.generator.generateBip39Word();
      case 'bip39_phrase':
        return this.generator.generateBip39Phrase(variable.wordCount);
      case 'numeric':
        return this.generator.generateNumeric(variable.length);
      case 'alphanumeric':
        return this.generator.generateAlphanumeric(variable.length);
      default:
        return this.generator.generateRandomString(variable.length);
    }
  }

  processPayload(payload: string, enabledTypes: { randomStrings: boolean; bip39Words: boolean }): {
    processedPayload: string;
    variables: Array<{ name: string; value: string; type: string }>;
  } {
    const detectedVariables = this.detectVariables(payload);
    const generatedVariables: Array<{ name: string; value: string; type: string }> = [];
    let processedPayload = payload;

    for (const variable of detectedVariables) {
      // Skip if type is disabled
      if (variable.type.includes('bip39') && !enabledTypes.bip39Words) continue;
      if (!variable.type.includes('bip39') && !enabledTypes.randomStrings) continue;

      const value = this.generateVariableValue(variable);
      generatedVariables.push({
        name: variable.name,
        value,
        type: variable.type,
      });

      // Replace all occurrences of this variable in the payload
      const regex = new RegExp(`\\{${variable.name}[^}]*\\}`, 'g');
      processedPayload = processedPayload.replace(regex, value);
    }

    return { processedPayload, variables: generatedVariables };
  }
}
