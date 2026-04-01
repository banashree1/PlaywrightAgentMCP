# Git Automation Setup

This document explains how to use the MCP-based Git automation system in your Playwright framework.

## 🚀 Quick Start

### Available Commands

```bash
# Auto-commit and push all changes
npm run git:auto

# Quick commit with custom message
npm run git:commit "your commit message"

# Push to remote repository
npm run git:push

# Check git status
npm run git:status

# Run tests and auto-commit results
npm run test-and-push
```

### Direct Script Usage

```bash
# Auto-commit and push
node scripts/git-automation.js auto

# Custom commit
node scripts/git-automation.js commit "fix: Update test scenario"

# Push only
node scripts/git-automation.js push

# Status check
node scripts/git-automation.js status
```

## 🤖 MCP Server Features

The MCP server provides these tools:

- **auto_commit**: Automatically commit all changes with smart message generation
- **smart_commit**: Analyze changes and create intelligent commit messages  
- **push_changes**: Push committed changes to remote repository
- **git_status**: Get current git repository status
- **setup_auto_push**: Set up automatic pushing for future commits

## 📝 Smart Commit Messages

The system automatically generates appropriate commit messages based on file types:

- **Test files** (`.spec.js`, `/tests/`) → `test: Update Playwright test scenarios`
- **Config files** (`.json`, `.yml`) → `config: Update configuration files`
- **Page objects** (`/page-objects/`, `/pages/`) → `refactor: Update page object models`
- **Scripts** (`.js`, `.ts`) → `feat: Update automation scripts`
- **Mixed changes** → `chore: Update project files - [timestamp]`

## 🔧 Configuration

### MCP Configuration (`.vscode/mcp.json`)

```json
{
  "mcpServers": {
    "git-automation": {
      "command": "node",
      "args": ["./scripts/git-mcp-server.js"],
      "env": {
        "GIT_REPO_PATH": "."
      }
    }
  }
}
```

### Environment Variables

- `GIT_REPO_PATH`: Path to the git repository (default: current directory)

## 📋 Workflow Examples

### Daily Development Workflow

```bash
# 1. Make changes to test files
# 2. Auto-commit and push
npm run git:auto
```

### Test-Driven Workflow

```bash
# Run tests and commit results automatically
npm run test-and-push
```

### Manual Control Workflow

```bash
# Check what's changed
npm run git:status

# Custom commit message
npm run git:commit "feat: Add new test for insurance form validation"

# Push when ready
npm run git:push
```

## 🔄 File Watchers (Optional)

For automatic commits on file changes, you can set up watchers:

### Using nodemon (install first: `npm install -g nodemon`)

```bash
# Watch for changes and auto-commit
nodemon --watch tests --watch page-objects --ext js,json --exec "npm run git:auto"
```

### Using chokidar in package.json

```json
{
  "scripts": {
    "dev:watch": "chokidar \"tests/**/*.js\" \"page-objects/**/*.js\" -c \"npm run git:auto\""
  }
}
```

## 🎯 Best Practices

1. **Use semantic commit messages** - The automation follows conventional commits
2. **Test before pushing** - Use `npm run test-and-push` for safety
3. **Check status regularly** - Use `npm run git:status` to see what's changed
4. **Custom messages for major changes** - Use `git:commit` with custom messages for important updates
5. **Review before auto-push** - For production code, consider staging changes manually first

## 🚨 Error Handling

If automation fails:

1. Check git repository status: `npm run git:status`
2. Ensure you're in a git repository
3. Verify remote repository access
4. Check for merge conflicts
5. Ensure MCP server is running correctly

## 📊 Integration with CI/CD

The system works well with:

- **GitHub Actions** - Auto-commit triggers workflows
- **GitLab CI** - Pipeline triggers on commits
- **Jenkins** - Hooks for automated builds
- **Azure DevOps** - Continuous integration

## 🔍 Troubleshooting

### MCP Server Not Starting

```bash
# Test MCP server directly
node scripts/git-mcp-server.js
```

### Git Commands Failing

```bash
# Check git configuration
git config --list

# Verify remote repository
git remote -v
```

### Permission Issues

Ensure your git credentials are configured:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Playwright Documentation](https://playwright.dev/)