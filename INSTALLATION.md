# 🔧 Installation Guide
## Anti-Phishing Research Tool

### 📋 System Requirements

#### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 18+)
- **Node.js**: 20.19+ within the 20.x line, or 22.12+ (`^20.19.0 || >=22.12.0`)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Disk Space**: 1GB for the project + dependencies

#### Check System
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

### 🚀 Step-by-Step Installation

#### Step 1: Download and Unpack
```bash
# Unzip the archive
unzip anti-phishing-tool.zip

# Navigate to the project folder
cd anti-phishing-tool
```

#### Step 2: Install Dependencies
```bash
# Install all necessary packages
npm install

# Or if using yarn
yarn install
```

#### Step 3: Understand Storage
The current application uses in-memory storage (`MemStorage`); records are lost when the server restarts. Drizzle schema tooling is included, but PostgreSQL persistence is not wired into the default runtime.

For schema development only, configure `DATABASE_URL` for a PostgreSQL instance before using the optional command below:
```bash
# Create and set up the database
npm run db:push
```

#### Step 4: Run the Application
```bash
# Run in development mode
npm run dev
```

#### Step 5: Open in Browser
Open your browser and go to:
```
http://localhost:5000
```

### 🛠️ Alternative Launch Methods

#### Production Build
```bash
# Build for production
npm run build

# Run the production version
npm start
```

#### Docker
A Dockerfile is not included. Create and validate a container configuration before using Docker; the Node.js commands above are the supported local start procedure.

### 🔧 Configuration

#### Environment and Storage
The current application uses in-memory storage (`MemStorage`); records are lost when the server restarts. Drizzle schema tooling is included, but PostgreSQL persistence is not wired into the default runtime.

`DATABASE_URL` is for optional Drizzle tooling. The current server listens on port 5000; `PORT` and `ENABLE_CORS` are not runtime settings implemented by this version.

```env
# Database settings
DATABASE_URL=postgresql://user:password@localhost:5432/antiphishing

NODE_ENV=development
```

#### Proxy Setup (Optional)
Select the custom proxy option in the application and enter its URL. The current sender uses that custom proxy setting; it does not read a `proxy-config.json` file.

### ❗ Troubleshooting

#### Issue: "node: command not found"
**Solution**: Install Node.js from the official website: https://nodejs.org/

#### Issue: "npm install" fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 5000 is in use
**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with the actual process ID)
kill -9 PID

# The current server uses port 5000. To change it, update server/index.ts.
```

#### Issue: WebSocket not connecting
**Solution**:
1. Check firewall settings
2. Check the browser console and whether the local WebSocket connection is being blocked
3. Try a different browser

#### Issue: Optional Drizzle schema command cannot connect
This affects database tooling, not the default in-memory application. Check the PostgreSQL instance referenced by `DATABASE_URL`:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Create the database
createdb antiphishing
```

### 🔐 Security Settings

#### Recommended Firewall Settings
```bash
# Allow only local connections (Linux)
sudo ufw allow from 127.0.0.1 to any port 5000
```

#### Browser Settings
1. Enable JavaScript
2. Allow WebSocket connections
3. Open the frontend and API through the same local origin so WebSocket requests use the matching protocol

### 📊 Verifying Functionality

#### Basic Test
1. Open `http://localhost:5000`
2. Enter URL: `https://httpbin.org/post`
3. Enter payload: `test={test_value}`
4. Click "Generate"
5. Check variable generation
6. Click "Send Request"
7. Ensure the request is sent successfully

#### WebSocket Test
1. Open Developer Tools (F12)
2. Go to the Console tab
3. You should see a message "WebSocket connected"
4. Logs should appear in real-time when requests are sent

#### Variable Generation Test
Use the test payload:
```
access_key={access_key}&word01={word01}&code={numeric}&uuid={uuid}
```

You should see the following generated:
- UUID for `access_key`
- BIP39 word for `word01`
- Numeric code for `code`
- UUID for `uuid`

### 🆘 Getting Help

#### Error Logs
Check the logs in the browser console (F12) and in the terminal where the server is running.

#### Documentation
- `README.md` - Main documentation
- `API.md` - API documentation
- The Troubleshooting section above - Common setup problems

#### Contact
If issues arise:
1. Check error logs
2. Refer to the troubleshooting section
3. Open an issue with detailed problem description

---

### 🌍 Deployment

Use a host that supports the required Node.js version. Build with `npm run build` and start with `npm start`.

- The current server listens on port **5000**. Configure the host to route to that port. A platform that requires its assigned `PORT` value needs a server configuration change first.
- Storage is in memory. A restart or redeployment clears runtime records; setting `DATABASE_URL` does not add persistence.
- Drizzle schema tools are available for development, but a persistent storage implementation must be connected before relying on PostgreSQL.

Consult the platform's current deployment documentation and pricing: [Railway](https://docs.railway.com/), [Render](https://render.com/docs), or [Heroku](https://devcenter.heroku.com/).

---

**Good luck with the installation and deployment! 🎉**
