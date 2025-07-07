# 🔧 Installation Guide
## Anti-Phishing Research Tool

### 📋 System Requirements

#### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 18+)
- **Node.js**: Version 20.0 or higher
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

#### Step 3: Database Setup (Optional)
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

#### Docker (if installed)
```bash
# Build Docker image
docker build -t anti-phishing-tool .

# Run the container
docker run -p 5000:5000 anti-phishing-tool
```

### 🔧 Configuration

#### `.env` File (Optional)
Create a `.env` file in the root of the project to configure environment variables:

```env
# Database settings
DATABASE_URL=postgresql://user:password@localhost:5432/antiphishing

# Server settings
PORT=5000
NODE_ENV=development

# Security settings
ENABLE_CORS=true
```

#### Proxy Setup (Optional)
To use a proxy, create a `proxy-config.json` file:

```json
{
  "proxies": [
    "http://proxy1.example.com:8080",
    "http://proxy2.example.com:8080"
  ],
  "rotation": "random"
}
```

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

# Or use a different port
PORT=3000 npm run dev
```

#### Issue: WebSocket not connecting
**Solution**:
1. Check firewall settings
2. Temporarily disable antivirus
3. Try a different browser

#### Issue: Database not connecting
**Solution**:
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
3. Disable mixed content blocking (if using HTTP)

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
- `TROUBLESHOOTING.md` - Detailed troubleshooting guide

#### Contact
If issues arise:
1. Check error logs
2. Refer to the troubleshooting section
3. Open an issue with detailed problem description

---

### 🌍 Deployment on Free Platforms

#### Railway Deployment

1. **Create a Railway account**: Go to [https://railway.app](https://railway.app) and create an account.
2. **Create a new project**: Select "New Project" and connect to your GitHub repository containing the tool.
3. **Set environment variables**:
   - Go to your Railway project settings.
   - Add the following environment variables:
     - `DATABASE_URL=postgresql://user:password@localhost:5432/antiphishing`
     - `PORT=5000`
4. **Deploy**: Railway will automatically deploy the application once connected. Your app will be available at the provided Railway URL.
   
#### Render Deployment

1. **Create a Render account**: Go to [https://render.com](https://render.com) and create an account.
2. **Create a new Web Service**:
   - Select the Node.js option.
   - Connect your GitHub repository with the project.
3. **Set environment variables** in the Render dashboard, similar to the Railway setup.
4. **Deploy**: Render will deploy the application and provide a public URL.

#### Heroku Deployment

1. **Create a Heroku account**: Go to [https://www.heroku.com](https://www.heroku.com) and sign up.
2. **Install the Heroku CLI**: Follow the instructions [here](https://devcenter.heroku.com/articles/heroku-cli).
3. **Deploy with Heroku**:
   - Initialize a git repository if not already done: `git init`
   - Commit your changes: `git commit -m "Initial commit"`
   - Create a new Heroku app: `heroku create`
   - Push the code to Heroku: `git push heroku master`
4. **Set environment variables**:
   - `heroku config:set DATABASE_URL=postgresql://user:password@localhost:5432/antiphishing`
   - `heroku config:set PORT=5000`
5. **Access the app**: Once the deployment is finished, your app will be accessible at the Heroku URL provided.

---

**Good luck with the installation and deployment! 🎉**
