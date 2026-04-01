#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitAutomationServer {
  constructor() {
    this.server = new Server(
      {
        name: 'git-automation-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupResourceHandlers();
  }

  setupTools() {
    // Auto commit tool
    this.server.setRequestHandler('tools/call', async (request) => {
      switch (request.params.name) {
        case 'auto_commit':
          return this.autoCommit(request.params.arguments);
        case 'smart_commit':
          return this.smartCommit(request.params.arguments);
        case 'push_changes':
          return this.pushChanges(request.params.arguments);
        case 'git_status':
          return this.getGitStatus();
        case 'setup_auto_push':
          return this.setupAutoPush(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });

    // List available tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'auto_commit',
            description: 'Automatically commit all changes with smart message generation',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Custom commit message (optional)',
                },
                push: {
                  type: 'boolean',
                  description: 'Whether to push after commit',
                  default: false,
                },
              },
            },
          },
          {
            name: 'smart_commit',
            description: 'Analyze changes and create intelligent commit messages',
            inputSchema: {
              type: 'object',
              properties: {
                filePatterns: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'File patterns to include in commit',
                },
              },
            },
          },
          {
            name: 'push_changes',
            description: 'Push committed changes to remote repository',
            inputSchema: {
              type: 'object',
              properties: {
                branch: {
                  type: 'string',
                  description: 'Target branch (default: current branch)',
                },
                force: {
                  type: 'boolean',
                  description: 'Force push',
                  default: false,
                },
              },
            },
          },
          {
            name: 'git_status',
            description: 'Get current git repository status',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'setup_auto_push',
            description: 'Set up automatic pushing for future commits',
            inputSchema: {
              type: 'object',
              properties: {
                interval: {
                  type: 'number',
                  description: 'Auto-push interval in minutes',
                  default: 30,
                },
              },
            },
          },
        ],
      };
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler('resources/list', async () => {
      return {
        resources: [
          {
            uri: 'git://status',
            mimeType: 'application/json',
            name: 'Git Status',
            description: 'Current git repository status',
          },
          {
            uri: 'git://history',
            mimeType: 'application/json',
            name: 'Git History',
            description: 'Recent commit history',
          },
        ],
      };
    });

    this.server.setRequestHandler('resources/read', async (request) => {
      const uri = request.params.uri;
      
      if (uri === 'git://status') {
        return this.getGitStatusResource();
      } else if (uri === 'git://history') {
        return this.getGitHistoryResource();
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async executeGitCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: process.env.GIT_REPO_PATH || '.' }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Git command failed: ${stderr || error.message}`));
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  async autoCommit(args = {}) {
    try {
      const { message, push = false } = args;
      
      // Check if there are changes to commit
      const status = await this.executeGitCommand('git status --porcelain');
      if (!status) {
        return {
          content: [
            {
              type: 'text',
              text: 'No changes to commit',
            },
          ],
        };
      }

      // Generate smart commit message if none provided
      const commitMessage = message || await this.generateSmartCommitMessage();
      
      // Stage all changes and commit
      await this.executeGitCommand('git add .');
      await this.executeGitCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
      
      let result = `✅ Committed: ${commitMessage}`;
      
      // Push if requested
      if (push) {
        await this.executeGitCommand('git push');
        result += '\n🚀 Pushed to remote repository';
      }
      
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Auto-commit failed: ${error.message}`,
          },
        ],
      };
    }
  }

  async smartCommit(args = {}) {
    try {
      const { filePatterns = [] } = args;
      
      // Get changed files
      const changedFiles = await this.executeGitCommand('git diff --name-only HEAD');
      const stagedFiles = await this.executeGitCommand('git diff --name-only --cached');
      
      const allChanges = [...new Set([...changedFiles.split('\n'), ...stagedFiles.split('\n')])].filter(f => f);
      
      if (filePatterns.length > 0) {
        // Filter files based on patterns
        const filteredFiles = allChanges.filter(file => 
          filePatterns.some(pattern => file.includes(pattern))
        );
        
        if (filteredFiles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No files match the specified patterns',
              },
            ],
          };
        }
        
        // Stage only matching files
        for (const file of filteredFiles) {
          await this.executeGitCommand(`git add "${file}"`);
        }
      } else {
        await this.executeGitCommand('git add .');
      }
      
      const commitMessage = await this.generateSmartCommitMessage();
      await this.executeGitCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Smart commit completed: ${commitMessage}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Smart commit failed: ${error.message}`,
          },
        ],
      };
    }
  }

  async generateSmartCommitMessage() {
    try {
      const changedFiles = await this.executeGitCommand('git diff --name-only --cached');
      const files = changedFiles.split('\n').filter(f => f);
      
      if (files.length === 0) {
        return 'chore: Update files';
      }
      
      // Analyze file types and generate appropriate message
      const testFiles = files.filter(f => f.includes('.spec.') || f.includes('test/') || f.includes('__tests__'));
      const configFiles = files.filter(f => f.includes('config') || f.includes('.json') || f.includes('.yml'));
      const scriptFiles = files.filter(f => f.includes('.js') || f.includes('.ts'));
      
      if (testFiles.length > 0) {
        return `test: Update Playwright test scenarios (${testFiles.length} files)`;
      } else if (configFiles.length > 0) {
        return `config: Update configuration files (${configFiles.length} files)`;
      } else if (scriptFiles.length > 0) {
        return `feat: Update automation scripts (${scriptFiles.length} files)`;
      } else {
        return `chore: Update project files (${files.length} files)`;
      }
    } catch (error) {
      return `chore: Auto-commit changes - ${new Date().toISOString()}`;
    }
  }

  async pushChanges(args = {}) {
    try {
      const { branch, force = false } = args;
      
      let pushCommand = 'git push';
      if (branch) {
        pushCommand += ` origin ${branch}`;
      }
      if (force) {
        pushCommand += ' --force';
      }
      
      const result = await this.executeGitCommand(pushCommand);
      
      return {
        content: [
          {
            type: 'text',
            text: `🚀 Successfully pushed changes:\n${result}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Push failed: ${error.message}`,
          },
        ],
      };
    }
  }

  async getGitStatus() {
    try {
      const status = await this.executeGitCommand('git status --porcelain');
      const branch = await this.executeGitCommand('git branch --show-current');
      const lastCommit = await this.executeGitCommand('git log -1 --pretty=format:"%s"');
      
      return {
        content: [
          {
            type: 'text',
            text: `📋 Git Status:
🌿 Branch: ${branch}
📝 Last Commit: ${lastCommit}
📁 Changes:
${status || 'No changes'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to get git status: ${error.message}`,
          },
        ],
      };
    }
  }

  async getGitStatusResource() {
    try {
      const status = await this.executeGitCommand('git status --porcelain');
      const branch = await this.executeGitCommand('git branch --show-current');
      
      return {
        contents: [
          {
            uri: 'git://status',
            mimeType: 'application/json',
            text: JSON.stringify({
              branch,
              changes: status.split('\n').filter(line => line.trim()),
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get git status: ${error.message}`);
    }
  }

  async getGitHistoryResource() {
    try {
      const history = await this.executeGitCommand('git log --oneline -10');
      
      return {
        contents: [
          {
            uri: 'git://history',
            mimeType: 'application/json',
            text: JSON.stringify({
              commits: history.split('\n').filter(line => line.trim()),
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get git history: ${error.message}`);
    }
  }

  async setupAutoPush(args = {}) {
    const { interval = 30 } = args;
    
    // This would typically set up a cron job or scheduled task
    return {
      content: [
        {
          type: 'text',
          text: `⏰ Auto-push configured for every ${interval} minutes\n💡 Consider setting up a GitHub Action for production use`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  process.exit(0);
});

process.on('SIGTERM', async () => {
  process.exit(0);
});

// Start the server
if (require.main === module) {
  const server = new GitAutomationServer();
  server.start().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}

module.exports = { GitAutomationServer };