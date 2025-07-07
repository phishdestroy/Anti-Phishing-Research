# 🛡️ Anti-Phishing Research Tool

## 📋 Project Description

A professional security research tool designed for testing anti-phishing measures with automatic payload generation and comprehensive logging.

## ✨ Key Features

### 🎯 User-Friendly Interface
- **URL Input**: Simple field for entering the URL where the POST request will be sent.
- **Payload Input**: Text field for entering raw POST request data.
- **Copy from Browser**: Option to copy POST payloads from browser developer tools (F12 > Network > POST > Payload).
- **Automatic Variable Detection**: The program automatically detects placeholders like `{access_key}`, `{word01}`, and replaces them with random values.

### 🔄 Payload Processing
- **Automatic Variable Detection**: The system automatically finds placeholders like `{access_key=rand22}` and replaces them with random values.
- **Random BIP39 Words**: For fields requiring random phrases, the tool generates valid BIP39 words.
- **Dynamic Variable Generation**: Supports variables like `access_key={rand_string}` or `word01={bip39_word}`.

### 📊 Logging System
- **Success Logs**: After a successful POST request, the log shows success details (e.g., Status Code: 200 OK).
- **Error Logs**: In case of a failed request, the log clearly explains the cause (e.g., "Invalid URL format", "Connection failed").
- **Status Updates**: Notifies the user of progress ("Preparing data", "Sending request").
- **Clear Formatting**: All logs are easy to understand, showing step-by-step progress, results, and error explanations.

### 🔒 Proxy and User-Agent Handling
- **User-Agent Rotation**: The tool randomly changes user-agent strings to avoid detection.
- **Proxy Support**: Integration of proxy use for request anonymization.

### 📈 Output Information
- **Formatted Payload**: Displays the processed payload with random values.
- **Success/Error Messages**: Displays clear success or failure messages for the request.
- **Generated Values**: Generated values are shown in the logs.

## 🚀 Quick Start

### System Requirements
- Node.js 20+
- npm or yarn

### Installation and Launch

1. **Unzip the Archive**
```bash
unzip anti-phishing-tool.zip
cd anti-phishing-tool
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start the Project**
```bash
npm run dev
```

4. **Open the Browser**
Navigate to: `http://localhost:5000`

## 📖 User Guide

### Example Workflow

#### Step 1: Enter URL
Enter the URL for the POST request:
```
https://example-phishing-site.com
```

#### Step 2: Insert Payload
Paste or type the original payload:
```
access_key=725d9138-b81d-46c9-b2d5-37b45b12d1f8&subject=Submitted+Ledger+Live+Recovery+Phrase&redirect=https%3Aledger.com&botcheck=&word01=neck&word02=ready&word03=gift
```

#### Step 3: Set Up Generation
Choose which fields to generate random values for:
- `access_key` → UUID
- `word01`, `word02`, `word03` → BIP39 words
- `botcheck` → Random string

#### Step 4: Generate
Click "Generate" to automatically replace placeholders with random values.

#### Step 5: Send
Click "Send" to submit the POST request.

#### Step 6: Check Logs
Check the results in the log panel:

**Success:**
```
[2025-07-07 12:30:15] SUCCESS: Request sent to https://example-phishing-site.com with status 200 OK
```

**Error:**
```
[2025-07-07 12:30:15] ERROR: Invalid URL format
```

**Progress:**
```
[2025-07-07 12:30:10] PROCESSING: Preparing request...
[2025-07-07 12:30:12] PROCESSING: Sending POST request...
```

## 🛠️ Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query for server-side state management
- **Forms**: React Hook Form with Zod validation

### Backend (Express.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **WebSocket**: For real-time log streaming
- **Database**: PostgreSQL with Drizzle ORM
- **Architecture**: Service-oriented architecture

### Key Services
- **PayloadProcessor**: Handles variable detection and payload generation.
- **RequestSender**: Manages HTTP requests with user-agent rotation and proxy support.
- **VariableGenerator**: Generates random values (UUID, strings, BIP39 words).

## 📁 File Structure

```
anti-phishing-tool/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities and API client
│   │   └── pages/            # Application pages
│   └── index.html            # HTML template
├── server/                    # Backend application
│   ├── services/             # Business logic
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   └── storage.ts            # Data storage layer
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Zod schemas and types
├── package.json              # Project dependencies
└── README.md                 # This documentation
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root of the project:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/antiphishing
NODE_ENV=development
```

### Database Setup
```bash
# Synchronize the database schema
npm run db:push
```

## 🧪 Testing

### Test URLs
- `https://httpbin.org/post` - for testing HTTP requests
- `https://postman-echo.com/post` - alternative test service

### Example Payloads
```
# Basic example
access_key={access_key}&word01={word01}&botcheck={botcheck}

# Extended example
user_id={uuid}&phrase={bip39_phrase}&token={random_string}&code={numeric}

# Phishing simulation
email={email}&password={password}&recovery_phrase={bip39_phrase}
```

## 🔐 Security

⚠️ **IMPORTANT**: This tool is intended for security research and testing your own systems only. Using it for illegal activities is strictly prohibited.

### Recommendations for Safe Use
1. Use only for testing your own systems
2. Do not use real credentials
3. Set up a VPN/proxy for anonymization
4. Keep documentation of all tests

## 📞 Support

### Logs and Debugging
- All logs are saved in the interface
- Export logs to a text file
- WebSocket for real-time logs

### Known Issues
- WebSocket may disconnect after prolonged inactivity
- Some sites block automated requests

## 📝 License

This tool is provided "as is" exclusively for educational and research purposes in cybersecurity.

---

**Made with ❤️ for security researchers**
