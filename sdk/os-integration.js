/**
 * Trivium OS-Level Integration
 * Universal cognitive filter for all AI interactions on user's system
 */

const { TriviumMiddleware } = require('./middleware');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TriviumOSFilter {
  constructor(config = {}) {
    this.middleware = new TriviumMiddleware(config);
    this.interceptors = new Map();
    this.processMonitor = null;
    this.networkProxy = null;
    this.isActive = false;
    
    // OS-specific configurations
    this.platform = process.platform;
    this.homeDir = require('os').homedir();
    this.configDir = path.join(this.homeDir, '.trivium');
    
    this.initializeOSIntegration();
  }

  /**
   * Initialize OS-level integration
   */
  async initializeOSIntegration() {
    // Create config directory
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    // Platform-specific setup
    switch (this.platform) {
      case 'darwin':
        await this.setupMacOS();
        break;
      case 'win32':
        await this.setupWindows();
        break;
      case 'linux':
        await this.setupLinux();
        break;
    }
  }

  /**
   * macOS Integration
   */
  async setupMacOS() {
    // Create LaunchAgent for system-wide integration
    const launchAgentPath = path.join(this.homeDir, 'Library/LaunchAgents/com.trivium.cognitive-filter.plist');
    const launchAgentContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.trivium.cognitive-filter</string>
    <key>ProgramArguments</key>
    <array>
        <string>node</string>
        <string>${path.join(__dirname, 'daemon.js')}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>`;

    fs.writeFileSync(launchAgentPath, launchAgentContent);
    
    // Network proxy configuration for AI service interception
    this.setupNetworkProxy();
  }

  /**
   * Windows Integration
   */
  async setupWindows() {
    // Create Windows service or startup script
    const startupScript = path.join(this.configDir, 'trivium-startup.bat');
    const scriptContent = `@echo off
cd /d "${__dirname}"
node daemon.js`;
    
    fs.writeFileSync(startupScript, scriptContent);
    
    // Add to Windows startup (requires admin privileges)
    // This would typically be done through installer
  }

  /**
   * Linux Integration
   */
  async setupLinux() {
    // Create systemd service
    const servicePath = path.join(this.homeDir, '.config/systemd/user/trivium-cognitive-filter.service');
    const serviceContent = `[Unit]
Description=Trivium Cognitive Filter
After=network.target

[Service]
Type=simple
ExecStart=node ${path.join(__dirname, 'daemon.js')}
Restart=always
RestartSec=3

[Install]
WantedBy=default.target`;

    const serviceDir = path.dirname(servicePath);
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    
    fs.writeFileSync(servicePath, serviceContent);
  }

  /**
   * Network-level interception for AI services
   */
  setupNetworkProxy() {
    const proxyConfig = {
      // OpenAI API
      'api.openai.com': {
        port: 443,
        intercept: true,
        enhance: 'code-analysis'
      },
      
      // Claude API
      'claude.ai': {
        port: 443,
        intercept: true,
        enhance: 'comprehensive'
      },
      
      // Google Gemini
      'generativelanguage.googleapis.com': {
        port: 443,
        intercept: true,
        enhance: 'logical-analysis'
      },
      
      // Local AI services
      'localhost': {
        ports: [8080, 3000, 5000],
        intercept: true,
        enhance: 'auto-detect'
      }
    };

    this.networkProxy = new NetworkProxy(proxyConfig, this.middleware);
  }

  /**
   * Browser extension integration
   */
  createBrowserExtension() {
    const extensionManifest = {
      "manifest_version": 3,
      "name": "Trivium Cognitive Filter",
      "version": "1.0",
      "description": "Universal cognitive lens for all AI interactions",
      "permissions": [
        "webRequest",
        "webRequestBlocking",
        "storage",
        "activeTab",
        "*://api.openai.com/*",
        "*://claude.ai/*",
        "*://chat.openai.com/*",
        "*://bard.google.com/*"
      ],
      "background": {
        "service_worker": "background.js"
      },
      "content_scripts": [{
        "matches": ["*://*/*"],
        "js": ["content.js"]
      }]
    };

    const extensionDir = path.join(this.configDir, 'browser-extension');
    if (!fs.existsSync(extensionDir)) {
      fs.mkdirSync(extensionDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(extensionDir, 'manifest.json'),
      JSON.stringify(extensionManifest, null, 2)
    );

    // Create background script
    const backgroundScript = `
// Trivium Browser Extension Background Script
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === 'POST' && details.requestBody) {
      // Intercept AI API calls
      const enhancedBody = enhanceAIRequest(details.requestBody);
      return { requestBody: enhancedBody };
    }
  },
  { urls: ["*://api.openai.com/*", "*://claude.ai/*"] },
  ["blocking", "requestBody"]
);

function enhanceAIRequest(requestBody) {
  // Apply Trivium cognitive enhancement
  // This would call our middleware
  return requestBody;
}`;

    fs.writeFileSync(
      path.join(extensionDir, 'background.js'),
      backgroundScript
    );

    return extensionDir;
  }

  /**
   * Application-level integration
   */
  integrateWithApplications() {
    const integrations = {
      // Development tools
      'vscode': {
        type: 'extension',
        path: path.join(__dirname, '../vscode-extension'),
        install: 'code --install-extension'
      },
      
      // Chat applications
      'discord': {
        type: 'plugin',
        intercept: 'messages',
        enhance: 'social-communication'
      },
      
      // Writing tools
      'notion': {
        type: 'web-extension',
        intercept: 'ai-blocks',
        enhance: 'documentation'
      },
      
      // Email clients
      'gmail': {
        type: 'web-extension',
        intercept: 'smart-compose',
        enhance: 'professional-communication'
      }
    };

    return integrations;
  }

  /**
   * Start the OS-level filter
   */
  async start() {
    if (this.isActive) return;

    console.log('Starting Trivium OS-level cognitive filter...');
    
    // Start network proxy
    if (this.networkProxy) {
      await this.networkProxy.start();
    }
    
    // Start process monitor
    this.startProcessMonitor();
    
    // Install browser extension
    const extensionPath = this.createBrowserExtension();
    console.log(`Browser extension created at: ${extensionPath}`);
    
    this.isActive = true;
    console.log('Trivium cognitive filter is now active system-wide');
  }

  /**
   * Stop the OS-level filter
   */
  async stop() {
    if (!this.isActive) return;

    console.log('Stopping Trivium OS-level cognitive filter...');
    
    if (this.networkProxy) {
      await this.networkProxy.stop();
    }
    
    if (this.processMonitor) {
      this.processMonitor.kill();
    }
    
    this.isActive = false;
    console.log('Trivium cognitive filter stopped');
  }

  /**
   * Monitor running processes for AI tool usage
   */
  startProcessMonitor() {
    const aiProcesses = [
      'ChatGPT',
      'Claude',
      'Gemini',
      'Copilot',
      'cursor',
      'replit',
      'github-copilot'
    ];

    // Platform-specific process monitoring
    const command = this.platform === 'win32' ? 'tasklist' : 'ps aux';
    
    this.processMonitor = setInterval(() => {
      const proc = spawn(command, [], { shell: true });
      
      proc.stdout.on('data', (data) => {
        const output = data.toString();
        aiProcesses.forEach(processName => {
          if (output.includes(processName)) {
            console.log(`AI tool detected: ${processName}`);
            this.enhanceProcessInteraction(processName);
          }
        });
      });
    }, 5000); // Check every 5 seconds
  }

  /**
   * Enhance specific process interactions
   */
  enhanceProcessInteraction(processName) {
    switch (processName.toLowerCase()) {
      case 'chatgpt':
        this.injectChatGPTEnhancement();
        break;
      case 'cursor':
        this.injectCursorEnhancement();
        break;
      case 'copilot':
        this.injectCopilotEnhancement();
        break;
      default:
        console.log(`Generic enhancement for: ${processName}`);
    }
  }

  /**
   * Status and configuration
   */
  getStatus() {
    return {
      active: this.isActive,
      platform: this.platform,
      configDir: this.configDir,
      interceptors: Array.from(this.interceptors.keys()),
      networkProxy: this.networkProxy ? this.networkProxy.getStatus() : null,
      processMonitor: this.processMonitor ? 'running' : 'stopped'
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.middleware = new TriviumMiddleware(newConfig);
    
    // Save configuration
    const configPath = path.join(this.configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    
    console.log('Trivium configuration updated');
  }
}

/**
 * Network proxy for intercepting AI service requests
 */
class NetworkProxy {
  constructor(config, middleware) {
    this.config = config;
    this.middleware = middleware;
    this.server = null;
    this.isRunning = false;
  }

  async start() {
    // This would implement a proper network proxy
    // For now, we'll use a simple HTTP proxy approach
    console.log('Network proxy would start here');
    this.isRunning = true;
  }

  async stop() {
    if (this.server) {
      this.server.close();
    }
    this.isRunning = false;
  }

  getStatus() {
    return {
      running: this.isRunning,
      intercepting: Object.keys(this.config)
    };
  }
}

module.exports = { TriviumOSFilter };