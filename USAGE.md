# 📖 User Guide
## Anti-Phishing Research Tool

### 🎯 Application Interface

#### Main Components

##### 1. 🔧 Request Configuration Panel
- **URL Input**: Field to enter the target URL
- **Payload Input**: Large text field for the payload
- **"Paste from Browser" Button**: Paste payload directly from the clipboard
- **Generation Settings**: Switches for variable types
- **Anonymization Settings**: User-Agent and proxy settings

##### 2. 👁️ Payload Preview
- **Generated Payload**: Shows the processed payload
- **Variable Counter**: Number of detected variables
- **Action Buttons**: "Regenerate" and "Send Request"

##### 3. 📊 Status Panel
- **Current Status**: Ready/Processing/Sending/Complete
- **Request Counter**: Total number of requests sent
- **Success Rate**: Statistics on successful requests

##### 4. 🎲 Generated Values Panel
- **Variable List**: All generated variables with their values
- **Copy Buttons**: Quick copy of values

##### 5. 💻 Log Panel
- **Activity Log**: Real-time events
- **Filters**: Options for displaying and exporting logs
- **Management**: Clear and export logs

### 🚀 Step-by-Step Guide

#### Basic Workflow

##### Step 1: Set Up the URL
```
1. Find the "Target URL" field
2. Enter the full URL, for example:
   https://example-site.com/api/submit
3. The URL should start with http:// or https://
```

##### Step 2: Enter Payload
```
1. In the "POST Payload" field, type or paste the data
2. Use variables in curly braces: {variable_name}
3. Example:
   access_key={access_key}&email={email}&word01={word01}
```

##### Step 3: Automatic Processing
```
1. The system will automatically detect variables
2. The "Generated Values" panel will show detected variables
3. The "Payload Preview" will display the processed payload
```

##### Step 4: Send the Request
```
1. Click the "Send Request" button
2. Watch real-time logs
3. Check the result in the status panel
```

### 🔤 Supported Variable Types

#### UUID Variables
**Templates**: `{access_key}`, `{user_id}`, `{token}`, `{api_key}`
**Example Generation**: `725d9138-b81d-46c9-b2d5-37b45b12d1f8`

#### BIP39 Words
**Templates**: `{word01}`, `{word02}`, `{mnemonic}`, `{seed}`
**Example Generation**: `abandon`, `ability`, `about`

#### Random Strings
**Templates**: `{random_string}`, `{botcheck}`, `{captcha}`
**Example Generation**: `aB3dF9kL`

#### Numeric Codes
**Templates**: `{code}`, `{pin}`, `{numeric}`
**Example Generation**: `123456`

#### Alphanumeric
**Templates**: `{alphanumeric}`, `{hash}`
**Example Generation**: `A1B2C3D4`

### 📝 Usage Examples

#### Example 1: Basic Phishing Form
```
URL: https://fake-bank.com/login
Payload: username={email}&password={password}&token={access_key}

Result:
username=test@example.com&password=SecurePass123&token=725d9138-b81d-46c9-b2d5-37b45b12d1f8
```

#### Example 2: Cryptocurrency Phishing
```
URL: https://fake-wallet.com/recover
Payload: phrase={bip39_phrase}&email={email}&backup_code={numeric}

Result:
phrase=abandon+ability+about&email=user@test.com&backup_code=567890
```

#### Example 3: Social Engineering
```
URL: https://fake-support.com/verify
Payload: support_id={uuid}&verification_code={alphanumeric}&session={random_string}

Result:
support_id=e7f5a2b9-8c3d-4e1f-9a6b-2c7d8e9f0a1b&verification_code=X7K9M2N5&session=pQwErTy8
```

### 🔧 Advanced Settings

#### User-Agent Rotation
```
Random Rotation    - Random browser change
Chrome (Latest)    - Emulate latest version of Chrome
Firefox (Latest)   - Emulate latest version of Firefox
Safari (Latest)    - Emulate latest version of Safari
Custom            - Custom User-Agent string
```

#### Proxy Settings
```
No Proxy     - Direct connection
Random Proxy - Random proxy from the list (requires configuration)
Custom Proxy - Custom proxy server
```

#### Custom Proxy Format
```
HTTP Proxy:
http://username:password@proxy.example.com:8080

SOCKS5 Proxy:
socks5://username:password@proxy.example.com:1080
```

### 📊 Log Interpretation

#### Log Types
```
INFO  - Informational messages
PROC  - Processing steps
SUCC  - Successful operations
ERRO  - Errors and issues
```

#### Log Examples

##### Successful Request
```
[12:30:10] INFO: Starting payload processing
[12:30:11] PROC: Preparing POST request to https://example.com
[12:30:12] SUCC: Generated 3 variables
[12:30:13] PROC: Sending POST request...
[12:30:15] SUCC: Request sent successfully - Status: 200
```

##### Connection Error
```
[12:30:10] INFO: Starting payload processing
[12:30:11] PROC: Preparing POST request to https://invalid-url.com
[12:30:13] ERRO: Request failed: Connection refused
```

##### Format Error
```
[12:30:10] ERRO: Invalid URL format
```

### 🛡️ Security Measures

#### ⚠️ Important Warnings
1. **Use only for testing your own systems**
2. **Do not use real credentials**
3. **Do not test third-party sites without permission**
4. **Follow the laws of your country**

#### Recommendations for Safe Use
```
✅ Testing your own infrastructure
✅ Security research with permission
✅ Education and training
✅ Documenting vulnerabilities

❌ Attacks on third-party systems
❌ Using real victim data
❌ Breaking the law
❌ Commercial attacks
```

### 🔍 Diagnostics and Debugging

#### Checking WebSocket Connection
```
1. Open Developer Tools (F12)
2. Go to the Console tab
3. Look for the "WebSocket connected" message
4. Connection status is displayed in the header
```

#### Exporting Logs for Analysis
```
1. Click the "Export" button in the log panel
2. Choose a folder to save
3. The file will be saved as a .txt with a timestamp
```

#### Clearing Data
```
1. "Clear" in the log panel - clears the log
2. "Regenerate" - regenerate variables
3. Refreshing the page - resets all states
```

### 📈 Performance Monitoring

#### Metrics to Track
```
- Server response time (in logs)
- Success rate of requests
- Number of generated variables
- WebSocket connection status
```

#### Performance Optimization
```
1. Use a stable internet connection
2. Avoid very large payloads (>10KB)
3. Limit the frequency of requests
4. Monitor browser memory usage
```

---

**Happy testing! 🎯**
