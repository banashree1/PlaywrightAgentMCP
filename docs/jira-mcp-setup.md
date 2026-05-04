# JIRA MCP Server Setup Instructions
## BanaMCPAgentsAutomobile Workspace

This guide will set up your JIRA MCP Server for seamless integration between VS Code, Playwright tests, and JIRA issue tracking.

## 🎯 Overview

The JIRA MCP Server provides:
- ✅ **Automated story creation** from test scenarios
- ✅ **Test-to-issue linking** for traceability  
- ✅ **Real-time JIRA operations** from VS Code
- ✅ **Sprint and board management** 
- ✅ **Automated test result reporting**

## 📋 Prerequisites

1. **JIRA Account**: Access to https://banashreerautray.atlassian.net
2. **API Token**: Generate from JIRA account settings
3. **Node.js**: Version 18+ installed
4. **VS Code**: With MCP extension support

## 🚀 Quick Setup

### Step 1: Generate JIRA API Token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Label: "MCP Server - BanaMCPAgents"
4. Copy the token (save securely)

### Step 2: Install Dependencies

```bash
# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Or use the provided package file
cp jira-mcp-package.json package.json
npm install
```

### Step 3: Configure Environment

Update the JIRA_API_TOKEN in `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "jira-automation": {
      "command": "node",
      "args": ["jira-mcp-server.mjs"],
      "env": {
        "JIRA_BASE_URL": "https://banashreerautray.atlassian.net",
        "JIRA_EMAIL": "banashree.rautray@gmail.com",
        "JIRA_API_TOKEN": "YOUR_API_TOKEN_HERE",
        "JIRA_PROJECT_KEY": "DEV",
        "JIRA_WORKSPACE": "BanaMCPAgentsAutomobile"
      }
    }
  }
}
```

### Step 4: Initialize Workspace

```bash
# Run the setup script to create initial stories
node setup-jira-workspace.mjs

# Or use the npm script
npm run setup
```

### Step 5: Restart VS Code

Restart VS Code to load the MCP server configuration.

## 🔧 Available MCP Tools

Once configured, you'll have these JIRA tools available in VS Code:

### 📝 Issue Management
- **`create_jira_issue`** - Create stories, epics, bugs, tasks
- **`update_jira_issue`** - Update existing issues  
- **`search_jira_issues`** - Search with JQL queries

### 🧪 Test Integration
- **`link_test_to_issue`** - Link test files to JIRA issues
- **`bulk_import_stories`** - Import from test plans

### 📊 Workspace Management  
- **`create_jira_workspace`** - Set up project structure
- **`get_board_info`** - Get sprint and board data

## 📖 Usage Examples

### Create a User Story

```javascript
// In VS Code, use MCP command:
create_jira_issue({
  issueType: "Story",
  summary: "Add vehicle make validation",
  description: "As a user I want make selection to be validated...",
  priority: "High",
  labels: ["automation", "vehicle-data"],
  acceptanceCriteria: "AC1: Make dropdown validates...",
  testReference: "tests/vehicle-data/make-validation.spec.js"
})
```

### Link Test Results to Story

```javascript
link_test_to_issue({
  issueKey: "DEV-123", 
  testFile: "tests/vehicle-data/complete-automobile-data.spec.js",
  testResult: "passed",
  automationStatus: "automated"
})
```

### Search for Issues

```javascript
search_jira_issues({
  jql: "project = DEV AND labels = automobile-insurance",
  maxResults: 20
})
```

## 🏗️ Workspace Structure

The setup creates this JIRA structure:

```
BanaMCPAgentsAutomobile/
├── 🎯 Epic: Vehicle Data Entry
│   ├── 📝 Story: Complete Vehicle Data Form
│   ├── 📝 Story: Make/Model Selection
│   └── 📝 Story: Date Picker Functionality
├── 🎯 Epic: Form Validation  
│   ├── 📝 Story: Required Field Validation
│   └── 📝 Story: Input Format Validation
└── 🎯 Epic: Test Automation
    ├── 📝 Story: Playwright Integration
    └── 📝 Story: CI/CD Pipeline
```

## 🔄 Integration Workflow

1. **Test Development**: Write Playwright tests
2. **Story Creation**: Auto-create JIRA stories from test scenarios  
3. **Test Execution**: Run tests and link results to stories
4. **Sprint Planning**: Use JIRA board for planning
5. **Progress Tracking**: Monitor automation coverage

## 🔧 Troubleshooting

### Common Issues

**1. Authentication Failed**
```bash
# Check API token is correct
curl -u "email@domain.com:API_TOKEN" \
  https://banashreerautray.atlassian.net/rest/api/3/myself
```

**2. MCP Server Not Loading**
- Check VS Code MCP extension is installed
- Verify mcp.json syntax is valid
- Restart VS Code after configuration changes

**3. Project Permissions**
- Ensure your account has write access to DEV project
- Check project exists and is accessible

### Logs and Debugging

```bash
# Start MCP server with debug logging
node --inspect jira-mcp-server.mjs

# Check VS Code MCP logs 
# Command Palette > "MCP: Show Logs"
```

## 🔗 JIRA URLs

- **Board**: https://banashreerautray.atlassian.net/jira/software/projects/DEV/boards/1
- **Project**: https://banashreerautray.atlassian.net/jira/software/projects/DEV
- **API Tokens**: https://id.atlassian.com/manage-profile/security/api-tokens

## 📚 Additional Resources

- [MCP SDK Documentation](https://modelcontextprotocol.io)
- [JIRA REST API](https://developer.atlassian.com/server/jira/platform/rest-apis/)
- [Playwright Test Integration](./docs/playwright-jira-integration.md)

---

## ✅ Setup Checklist

- [ ] JIRA API token generated
- [ ] Dependencies installed (`npm install`)
- [ ] MCP configuration updated with API token
- [ ] VS Code restarted
- [ ] Workspace setup script executed (`npm run setup`)
- [ ] Test story creation using MCP tools
- [ ] Verify JIRA board shows created stories

**Ready to automate!** 🚀

Your JIRA MCP Server is now configured for the **BanaMCPAgentsAutomobile** workspace.