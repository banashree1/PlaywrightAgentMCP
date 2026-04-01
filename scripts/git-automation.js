#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitAutomation {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.projectRoot }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Command failed: ${stderr || error.message}`));
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  async autoCommitAndPush() {
    try {
      console.log('🔍 Checking for changes...');
      
      // Check if there are changes
      const status = await this.executeCommand('git status --porcelain');
      if (!status) {
        console.log('✅ No changes to commit');
        return;
      }

      console.log('📝 Changes detected:');
      console.log(status);

      // Generate smart commit message
      const commitMessage = await this.generateCommitMessage();
      console.log(`💬 Commit message: ${commitMessage}`);

      // Stage all changes
      await this.executeCommand('git add .');
      console.log('📤 Staged all changes');

      // Commit
      await this.executeCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
      console.log('✅ Committed changes');

      // Push
      await this.executeCommand('git push');
      console.log('🚀 Pushed to remote repository');

      console.log('\n🎉 Auto-commit and push completed successfully!');
    } catch (error) {
      console.error('❌ Auto-commit failed:', error.message);
      process.exit(1);
    }
  }

  async generateCommitMessage() {
    try {
      const changedFiles = await this.executeCommand('git diff --name-only');
      const stagedFiles = await this.executeCommand('git diff --name-only --cached');
      
      const allFiles = [...new Set([...changedFiles.split('\n'), ...stagedFiles.split('\n')])].filter(f => f);
      
      // Analyze file types for smart commit messages
      const testFiles = allFiles.filter(f => f.includes('.spec.') || f.includes('test/') || f.includes('tests/'));
      const configFiles = allFiles.filter(f => f.includes('config') || f.includes('.json') || f.includes('.yml') || f.includes('.yaml'));
      const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.ts'));
      const pageObjects = allFiles.filter(f => f.includes('page-object') || f.includes('pages/'));
      
      if (testFiles.length > 0 && testFiles.length === allFiles.length) {
        return `test: Update Playwright test scenarios`;
      } else if (testFiles.length > 0) {
        return `test: Update tests and related files (${allFiles.length} files)`;
      } else if (pageObjects.length > 0) {
        return `refactor: Update page object models`;
      } else if (configFiles.length > 0) {
        return `config: Update configuration files`;
      } else if (jsFiles.length > 0) {
        return `feat: Update automation scripts`;
      } else {
        return `chore: Update project files - ${new Date().toISOString()}`;
      }
    } catch (error) {
      return `chore: Auto-commit - ${new Date().toISOString()}`;
    }
  }

  async quickCommit(message) {
    try {
      await this.executeCommand('git add .');
      await this.executeCommand(`git commit -m "${message.replace(/"/g, '\\"')}"`);
      console.log(`✅ Quick commit: ${message}`);
    } catch (error) {
      console.error('❌ Quick commit failed:', error.message);
    }
  }

  async quickPush() {
    try {
      await this.executeCommand('git push');
      console.log('🚀 Pushed to remote repository');
    } catch (error) {
      console.error('❌ Push failed:', error.message);
    }
  }

  async status() {
    try {
      const status = await this.executeCommand('git status --porcelain');
      const branch = await this.executeCommand('git branch --show-current');
      const lastCommit = await this.executeCommand('git log -1 --pretty=format:"%s"');
      
      console.log('📋 Git Status:');
      console.log(`🌿 Branch: ${branch}`);
      console.log(`📝 Last Commit: ${lastCommit}`);
      console.log('📁 Changes:');
      if (status) {
        console.log(status);
      } else {
        console.log('No changes');
      }
    } catch (error) {
      console.error('❌ Failed to get status:', error.message);
    }
  }
}

// CLI interface
const automation = new GitAutomation();
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'auto':
    automation.autoCommitAndPush();
    break;
  case 'commit':
    if (!arg) {
      console.error('Usage: node git-automation.js commit "Your commit message"');
      process.exit(1);
    }
    automation.quickCommit(arg);
    break;
  case 'push':
    automation.quickPush();
    break;
  case 'status':
    automation.status();
    break;
  default:
    console.log(`
🤖 Git Automation Tool

Usage:
  node scripts/git-automation.js auto              # Auto-commit and push all changes
  node scripts/git-automation.js commit "message"  # Quick commit with message
  node scripts/git-automation.js push              # Push to remote
  node scripts/git-automation.js status            # Show git status

Examples:
  node scripts/git-automation.js auto
  node scripts/git-automation.js commit "fix: Update test scenario"
    `);
    break;
}