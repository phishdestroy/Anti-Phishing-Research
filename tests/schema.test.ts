import assert from 'node:assert/strict';
import test from 'node:test';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertRequestSchema, requestConfigSchema } from '../shared/schema';

test('request configuration retains its defaults after validation', () => {
  const config = requestConfigSchema.parse({ url: 'https://example.test/', payload: '{}' });
  assert.equal(config.enableRandomStrings, true);
  assert.equal(config.enableBip39Words, true);
  assert.equal(config.userAgentMode, 'random');
  assert.equal(config.proxyMode, 'none');
  assert.equal(requestConfigSchema.safeParse({ url: 'invalid', payload: '' }).success, false);
});

test('form resolver applies defaults and reports field errors with Zod 4', async () => {
  const resolve = zodResolver(requestConfigSchema);
  const options = { fields: {}, shouldUseNativeValidation: false };
  const valid = await resolve({ url: 'https://example.test/', payload: '{}' }, undefined, options);
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.values.proxyMode, 'none');
  const invalid = await resolve({ url: 'invalid', payload: '' }, undefined, options);
  assert.ok(invalid.errors.url);
  assert.ok(invalid.errors.payload);
});

test('database-derived input schema preserves the request contract', () => {
  assert.deepEqual(insertRequestSchema.parse({ url: 'https://example.test/', payload: '{}' }),
                   { url: 'https://example.test/', payload: '{}' });
  assert.equal(insertRequestSchema.safeParse({ url: 'https://example.test/' }).success, false);
});
