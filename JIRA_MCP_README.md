# 🚀 JIRA MCP Server - BanaMCPAgentsAutomobile

**Workspace**: BanaMCPAgentsAutomobile  
**JIRA Project**: DEV  
**Application**: Tricentis Automobile Insurance Testing  

## 🎯 Quick Start

### 1. Complete Setup ✅
Your JIRA MCP server is ready to use! All files have been configured:

- ✅ **JIRA MCP Server**: `jira-mcp-server.mjs` 
- ✅ **VS Code Integration**: `.vscode/mcp.json`
- ✅ **Dependencies**: MCP SDK installed
- ✅ **Setup Script**: `setup-jira-workspace.mjs`

### 2. Get Your JIRA API Token 🔑

1. **Go to**: https://id.atlassian.com/manage-profile/security/api-tokens
2. **Create token** with label: "BanaMCPAgents-Automation"
3. **Copy the token** (save securely)
4. **Update** `.vscode/mcp.json` with your token

### 3. Initialize Your Workspace 🏗️

```bash
# Create all epics and stories in JIRA
npm run setup

# Or run directly
node setup-jira-workspace.mjs
```

## 🔧 Available MCP Commands

Once VS Code is restarted with the MCP configuration, you'll have these JIRA tools:

### 📝 Issue Management
```javascript
// Create a new story
create_jira_issue({
  issueType: "Story",
  summary: "Vehicle make dropdown validation", 
  description: "As a user I want to select vehicle make...",
  priority: "High",
  labels: ["vehicle-data", "validation"],
  acceptanceCriteria: "AC1: Dropdown shows all makes...",
  testReference: "tests/vehicle-data/make-validation.spec.js"
})

// Search for issues  
search_jira_issues({
  jql: "project = DEV AND labels = automobile-insurance"
})

// Update existing issue
update_jira_issue({
  issueKey: "DEV-123",
  comment: "Test automation completed ✅"
})
```

### 🧪 Test Integration
```javascript
// Link test results to JIRA issues
link_test_to_issue({
  issueKey: "DEV-123",
  testFile: "tests/vehicle-data/complete-automobile-data.spec.js", 
  testResult: "passed",
  automationStatus: "automated"
})
```

## 📊 Workspace Structure Created

The setup creates **17 user stories** across **6 epics**:

### 🎯 Epic 1: Vehicle Data Entry (3 stories)
- Complete Automobile Vehicle Data Information Entry
- Automobile Make and Model Selection Validation
- Date Picker Functionality for Vehicle Manufacturing Date

### 🎯 Epic 2: Form Validation (3 stories)  
- Vehicle Data Required Field Validation
- Invalid Date Input Validation
- Numeric Field Validation for Vehicle Data

### 🎯 Epic 3: Personal Information (3 stories)
- Complete Personal Information Form Entry
- Country Selection Functionality
- File Upload Functionality for Pictures

### 🎯 Epic 4: Data Quality (2 stories)
- Personal Information Field Validation
- Address Validation and Postal Code Verification

### 🎯 Epic 5: Product Configuration (2 stories)
- Complete Insurance Product Configuration
- Insurance Sum Selection and Display

### 🎯 Epic 6: Price Access Control (2 stories)
- Price Option Access Without Prerequisites
- Price Option Access After Completing Prerequisites

## 🔗 Integration Features

### ✅ Test Plan Mapping
Each story links directly to test scenarios from:
- `specs/tricentis-insurance-test-plan.md`
- Test files in `tests/` directory

### ✅ Acceptance Criteria
All stories include detailed acceptance criteria derived from test expectations

### ✅ Automated Workflows  
- Create stories from test scenarios
- Link test results to JIRA issues
- Track automation coverage
- Sprint planning integration

### ✅ VS Code Integration
Direct JIRA operations from VS Code using MCP commands

## 🚀 Usage Workflow

1. **Development**: Write Playwright tests for new features
2. **Story Creation**: Use MCP to create corresponding JIRA stories
3. **Test Execution**: Run automated tests
4. **Results Linking**: Automatically link test results to stories
5. **Sprint Planning**: Use JIRA board for planning and tracking

## 📋 Next Steps

1. **Generate API Token**: https://id.atlassian.com/manage-profile/security/api-tokens
2. **Update Configuration**: Add token to `.vscode/mcp.json`
3. **Restart VS Code**: To load MCP server
4. **Run Setup**: `npm run setup` to create initial stories  
5. **Test Integration**: Create a test story using MCP tools
6. **Board Review**: Check your JIRA board for created issues

## 🔗 Important URLs

- **JIRA Board**: https://banashreerautray.atlassian.net/jira/software/projects/DEV/boards/1
- **Test Plan**: [specs/tricentis-insurance-test-plan.md](specs/tricentis-insurance-test-plan.md)
- **Setup Instructions**: [docs/jira-mcp-setup.md](docs/jira-mcp-setup.md)

## 🆘 Support & Troubleshooting

If you encounter issues:

1. **Check API Token**: Verify it's correct in mcp.json
2. **Restart VS Code**: After configuration changes
3. **Check Logs**: VS Code > Command Palette > "MCP: Show Logs"
4. **Verify Permissions**: Ensure DEV project write access

---

**Your JIRA MCP Server for BanaMCPAgentsAutomobile is ready! 🎉**

Run `npm run setup` and start automating your JIRA workflow!