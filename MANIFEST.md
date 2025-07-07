# 📦 Archive Contents
## Anti-Phishing Research Tool v1.0

### 📁 Archive Structure

```
anti-phishing-tool.tar.gz
├── 📖 Documentation
│   ├── README.md           ✨ Main project description
│   ├── QUICK_START.md      ⚡ Quick start in 3 minutes
│   ├── INSTALLATION.md     🔧 Detailed installation guide
│   ├── USAGE.md           📖 Full user guide
│   ├── API.md             🔌 API documentation and integrations
│   └── MANIFEST.md        📦 This file - content description
│
├── 🎨 Frontend (React)
│   └── client/
│       ├── src/
│       │   ├── components/    # UI components
│       │   ├── hooks/         # React hooks
│       │   ├── lib/          # Utilities and API
│       │   └── pages/        # Application pages
│       └── index.html        # HTML template
│
├── ⚙️ Backend (Express)
│   └── server/
│       ├── services/         # Business logic
│       ├── index.ts         # Main server file
│       ├── routes.ts        # API routes
│       ├── storage.ts       # Data management
│       └── vite.ts          # Vite configuration
│
├── 🔗 Shared Components
│   └── shared/
│       └── schema.ts        # Data types and schemas
│
└── ⚙️ Configuration
    ├── package.json         # Node.js dependencies
    ├── tsconfig.json        # TypeScript settings
    ├── vite.config.ts       # Bundler configuration
    ├── tailwind.config.ts   # Styling settings
    ├── components.json      # UI components
    ├── drizzle.config.ts    # ORM settings
    ├── postcss.config.js    # CSS processing
    └── .env.example         # Example environment variables
```

### 🔍 Key Files

#### 📚 Must Read
| File | Description | Priority |
|------|-------------|----------|
| `README.md` | General project description and capabilities | 🔥 High |
| `QUICK_START.md` | Quick start in 3 minutes | 🔥 High |
| `INSTALLATION.md` | Detailed installation instructions | ⚡ Medium |
| `USAGE.md` | User guide | ⚡ Medium |

#### 🏗️ Application Architecture
| Component | Location | Technology |
|-----------|----------|------------|
| Frontend | `client/` | React + TypeScript |
| Backend | `server/` | Express.js + TypeScript |
| Types | `shared/` | TypeScript + Zod |
| Styles | `client/src/` | Tailwind CSS |

#### 🛠️ Core Services
| Service | File | Function |
|---------|------|---------|
| Payload Processing | `server/services/payload-processor.ts` | Variable detection and generation |
| Request Sending | `server/services/request-sender.ts` | HTTP client with proxy support |
| Variable Generation | `server/services/variable-generator.ts` | Random value generation |

### 📋 Installation Checklist

#### ✅ Prerequisites
- [ ] Node.js 20+ installed
- [ ] npm or yarn available
- [ ] Port 5000 is free
- [ ] Browser supports WebSocket

#### ✅ Installation
- [ ] Archive extracted
- [ ] `npm install` executed successfully
- [ ] `npm run dev` started
- [ ] App is running at `localhost:5000`
- [ ] WebSocket connection is active

#### ✅ First Test
- [ ] URL entered: `https://httpbin.org/post`
- [ ] Payload entered: `test={test_value}`
- [ ] Variables generated automatically
- [ ] Request sent successfully
- [ ] Logs displayed in real-time

### ✅ Customization

#### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
nano .env
```

#### Proxy Settings
Edit `server/services/request-sender.ts` to add proxy servers.

#### UI Components
All components are in `client/src/components/` and use `shadcn/ui`.

### 📊 Component Sizes

| Component | Size | Description |
|-----------|------|-------------|
| Archive | ~130KB | Compressed archive |
| Frontend | ~50KB | React application |
| Backend | ~30KB | Express server |
| Documentation | ~50KB | Full documentation |
| Configuration | ~5KB | Project settings |

### 🛡️ Security

#### ⚠️ Important Notes
- The tool is intended for security research only
- Do not use on third-party systems without permission
- Follow the laws of your country
- Use only test data

#### 🔒 Recommendations
```
✅ Test your own infrastructure
✅ Security research with permission
✅ Education and training
✅ Document vulnerabilities

❌ Attacks on third-party systems
❌ Using real victim data
❌ Breaking the law
❌ Commercial attacks
```

### 📞 Support

#### 🐛 Troubleshooting
1. Check `INSTALLATION.md` for common issues
2. View logs in the browser console (F12)
3. Ensure all dependencies are installed
4. Check port availability

#### 📖 Additional Information
- `API.md` - for integrations
- `USAGE.md` - for advanced usage
- Application logs for diagnostics

## 🚀 What's Next?

### First Steps
1. Follow `QUICK_START.md`
2. Review examples in `USAGE.md`
3. Test on safe URLs
4. Customize to your needs

### Extensions
- Add custom variable types
- Integrate with CI/CD
- Create automated tests
- Extend API functionality

---

**Archive Version: 1.0 | Created on: 07.07.2025 | Size: 130KB**

**Happy testing! 🎯**
