# 🔌 API Documentation
## Anti-Phishing Research Tool

### 📡 API Overview

The REST API provides programmatic access to all functionalities of the anti-phishing tool. All endpoints return JSON responses.

**Base URL**: `http://localhost:5000/api`

### 🔐 Authentication

Authentication is not required in the current version. All endpoints are available directly.

### 📋 API Endpoints

#### 1. Payload Processing

##### `POST /api/process-payload`
Processes the incoming payload, detects variables, and generates random values.

**Request:**
```json
{
  "url": "https://example.com/api/submit",
  "payload": "access_key={access_key}&word01={word01}",
  "enableRandomStrings": true,
  "enableBip39Words": true,
  "userAgentMode": "random",
  "proxyMode": "none"
}
```

**Response:**
```json
{
  "requestId": 1,
  "processedPayload": "access_key=725d9138-b81d-46c9-b2d5-37b45b12d1f8&word01=abandon",
  "variables": [
    {
      "name": "access_key",
      "value": "725d9138-b81d-46c9-b2d5-37b45b12d1f8",
      "type": "uuid"
    },
    {
      "name": "word01",
      "value": "abandon",
      "type": "bip39_word"
    }
  ]
}
```

#### 2. Send HTTP Request

##### `POST /api/send-request/:requestId`
Sends the processed payload to the target URL.

**Parameters:**
- `requestId` - ID of the processed request

**Request:**
```json
{
  "url": "https://example.com/api/submit",
  "payload": "test=value",
  "userAgentMode": "chrome",
  "proxyMode": "none"
}
```

**Response (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "responseBody": "{\"status\":\"ok\"}",
  "duration": 1250
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Connection refused",
  "duration": 5000
}
```

#### 3. Request Management

##### `GET /api/requests`
Retrieves a list of all requests.

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "payload": "test={test}",
    "generatedPayload": "test=abc123",
    "status": "success",
    "responseStatus": 200,
    "createdAt": "2025-07-07T12:00:00Z"
  }
]
```

##### `GET /api/requests/:id`
Retrieves the details of a specific request.

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com",
  "payload": "test={test}",
  "generatedPayload": "test=abc123",
  "status": "success",
  "responseStatus": 200,
  "createdAt": "2025-07-07T12:00:00Z",
  "variables": [
    {
      "name": "test",
      "value": "abc123",
      "type": "random_string"
    }
  ]
}
```

#### 4. Logging System

##### `GET /api/logs`
Retrieves the event log.

**Parameters (query):**
- `limit` - limit the number of records (optional)

**Response:**
```json
[
  {
    "id": 1,
    "level": "SUCC",
    "message": "Request sent successfully - Status: 200",
    "requestId": 1,
    "createdAt": "2025-07-07T12:00:00Z",
    "metadata": {
      "statusCode": 200,
      "duration": 1250
    }
  }
]
```

##### `DELETE /api/logs`
Clears all log entries.

**Response:**
```json
{
  "success": true
}
```

#### 5. Statistics

##### `GET /api/stats`
Retrieves request statistics.

**Response:**
```json
{
  "total": 10,
  "success": 8,
  "error": 2,
  "successRate": 80.0
}
```

#### 6. Variable Detection

##### `POST /api/detect-variables`
Detects variables in the payload without processing it.

**Request:**
```json
{
  "payload": "user={user_id}&token={access_key}&word={word01}"
}
```

**Response:**
```json
{
  "variables": [
    {
      "name": "user_id",
      "type": "uuid"
    },
    {
      "name": "access_key",
      "type": "uuid"
    },
    {
      "name": "word01",
      "type": "bip39_word"
    }
  ]
}
```

### 🌐 WebSocket API

#### Connecting
```javascript
const ws = new WebSocket('ws://localhost:5000/api/ws');
```

#### Receiving Real-Time Logs
```javascript
ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  if (message.type === 'log') {
    console.log('New log:', message.data);
  }
};
```

#### WebSocket Message Format
```json
{
  "type": "log",
  "data": {
    "id": 1,
    "level": "SUCC",
    "message": "Request sent successfully",
    "requestId": 1,
    "createdAt": "2025-07-07T12:00:00Z"
  }
}
```

### 📝 Data Schemas

#### RequestConfig
```typescript
interface RequestConfig {
  url: string;                    // URL for the request
  payload: string;                // Payload
  enableRandomStrings: boolean;   // Generate random strings
  enableBip39Words: boolean;      // Generate BIP39 words
  userAgentMode: 'random' | 'chrome' | 'firefox' | 'safari' | 'custom';
  customUserAgent?: string;       // Custom User-Agent
  proxyMode: 'none' | 'random' | 'custom';
  customProxy?: string;           // Custom proxy
}
```

#### Log
```typescript
interface Log {
  id: number;
  level: 'INFO' | 'PROC' | 'SUCC' | 'ERRO';
  message: string;
  requestId?: number;
  metadata?: any;
  createdAt: Date;
}
```

#### Variable
```typescript
interface Variable {
  id: number;
  requestId: number;
  name: string;
  value: string;
  type: 'uuid' | 'random_string' | 'bip39_word' | 'bip39_phrase' | 'alphanumeric' | 'numeric';
  createdAt: Date;
}
```

### ⚠️ Error Codes

#### HTTP Status Codes
- `200` - Successful request
- `400` - Invalid request data
- `404` - Resource not found
- `500` - Internal server error

#### Example Errors
```json
{
  "error": "Invalid URL format"
}
```

```json
{
  "error": "Request not found"
}
```

```json
{
  "error": "Payload is required"
}
```

### 🔧 Example Usage

#### JavaScript/Node.js
```javascript
// Process Payload
const response = await fetch('/api/process-payload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    payload: 'test={test_value}',
    enableRandomStrings: true,
    enableBip39Words: true,
    userAgentMode: 'random',
    proxyMode: 'none'
  })
});

const result = await response.json();
console.log('Processed:', result);
```

#### Python
```python
import requests

# Process Payload
response = requests.post('http://localhost:5000/api/process-payload', json={
    'url': 'https://example.com',
    'payload': 'test={test_value}',
    'enableRandomStrings': True,
    'enableBip39Words': True,
    'userAgentMode': 'random',
    'proxyMode': 'none'
})

result = response.json()
print('Processed:', result)
```

#### curl
```bash
# Process Payload
curl -X POST http://localhost:5000/api/process-payload \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "payload": "test={test_value}",
    "enableRandomStrings": true,
    "enableBip39Words": true,
    "userAgentMode": "random",
    "proxyMode": "none"
  }'

# Get Stats
curl http://localhost:5000/api/stats
```

### 🔄 Integration

#### Automated Testing
```javascript
class AntiPhishingTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async processPayload(config) {
    const response = await fetch(`${this.baseUrl}/api/process-payload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.json();
  }

  async sendRequest(requestId, config) {
    const response = await fetch(`${this.baseUrl}/api/send-request/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.json();
  }
}
```

#### CI/CD Integration
```yaml
# GitHub Actions example
name: Security Testing
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start Anti-Phishing Tool
        run: |
          npm install
          npm run dev &
          sleep 10
      - name: Run Tests
        run: |
          curl -X POST http://localhost:5000/api/process-payload \
            -H "Content-Type: application/json" \
            -d '{"url":"https://httpbin.org/post","payload":"test=value"}'
```

---

**API Documentation v1.0 📚**
