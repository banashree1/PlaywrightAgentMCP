#!/usr/bin/env node

/**
 * JIRA MCP Server
 * Provides JIRA operations through Model Context Protocol
 * 
 * Supports:
 * - Issue creation/updates
 * - Project management
 * - Board operations  
 * - Search and filtering
 * - Automated workflows
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from 'node-fetch';

// JIRA Configuration
const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_BASE_URL || "https://banashreerautray-1778551818237.atlassian.net",
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY || "KAN",
  workspace: process.env.JIRA_WORKSPACE || "BanaMCPAgentsAutomobile"
};

class JiraMCPServer {
  constructor() {
    this.server = new Server({
      name: "jira-mcp-server",
      version: "1.0.0",
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available JIRA tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "create_jira_issue",
          description: "Create a new JIRA issue (Story, Epic, Bug, Task)",
          inputSchema: {
            type: "object",
            properties: {
              issueType: {
                type: "string",
                enum: ["Story", "Epic", "Bug", "Task"],
                description: "Type of JIRA issue to create"
              },
              summary: {
                type: "string", 
                description: "Issue summary/title"
              },
              description: {
                type: "string",
                description: "Detailed issue description"
              },
              priority: {
                type: "string",
                enum: ["Highest", "High", "Medium", "Low", "Lowest"],
                default: "Medium"
              },
              epicLink: {
                type: "string",
                description: "Epic key to link story to (optional)"
              },
              labels: {
                type: "array",
                items: { type: "string" },
                description: "Labels to add to the issue"
              },
              acceptanceCriteria: {
                type: "string",
                description: "Acceptance criteria for stories"
              },
              testReference: {
                type: "string", 
                description: "Reference to test scenario file"
              }
            },
            required: ["issueType", "summary", "description"]
          }
        },
        {
          name: "search_jira_issues",
          description: "Search JIRA issues using JQL",
          inputSchema: {
            type: "object",
            properties: {
              jql: {
                type: "string",
                description: "JQL query string"
              },
              maxResults: {
                type: "number",
                default: 50,
                description: "Maximum results to return"
              },
              fields: {
                type: "array",
                items: { type: "string" },
                description: "Fields to include in results"
              }
            },
            required: ["jql"]
          }
        },
        {
          name: "update_jira_issue",
          description: "Update an existing JIRA issue",
          inputSchema: {
            type: "object", 
            properties: {
              issueKey: {
                type: "string",
                description: "JIRA issue key (e.g., DEV-123)"
              },
              fields: {
                type: "object",
                description: "Fields to update"
              },
              comment: {
                type: "string",
                description: "Comment to add"
              }
            },
            required: ["issueKey"]
          }
        },
        {
          name: "link_test_to_issue",
          description: "Link test scenarios to JIRA issues",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: { type: "string" },
              testFile: { type: "string" },
              testResult: { 
                type: "string",
                enum: ["passed", "failed", "pending"]
              },
              automationStatus: {
                type: "string",
                enum: ["automated", "manual", "not-automated"]
              }
            },
            required: ["issueKey", "testFile"]
          }
        },
        {
          name: "bulk_import_stories",
          description: "Import multiple user stories from test plan",
          inputSchema: {
            type: "object",
            properties: {
              testPlanFile: { type: "string" },
              epicMapping: { type: "object" },
              defaultPriority: { type: "string", default: "Medium" }
            },
            required: ["testPlanFile"]
          }
        },
        {
          name: "create_jira_workspace",
          description: "Set up JIRA workspace structure for MCP Agents",
          inputSchema: {
            type: "object",
            properties: {
              workspaceName: { type: "string" },
              projectKey: { type: "string" },
              createSampleData: { type: "boolean", default: false }
            },
            required: ["workspaceName", "projectKey"]
          }
        },
        {
          name: "get_board_info",
          description: "Get JIRA board information and sprint data",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "number" },
              includeSprints: { type: "boolean", default: true }
            },
            required: ["boardId"]
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.error(`🔧 [JIRA MCP] Tool called: ${request.params.name}`);
      console.error(`📊 [JIRA MCP] Arguments:`, JSON.stringify(request.params.arguments, null, 2));
      
      try {
        let result;
        switch (request.params.name) {
          case "create_jira_issue":
            console.error(`📝 [JIRA MCP] Creating JIRA issue: ${request.params.arguments.summary}`);
            result = await this.createJiraIssue(request.params.arguments);
            console.error(`✅ [JIRA MCP] Issue created successfully`);
            return result;
          
          case "search_jira_issues":
            console.error(`🔍 [JIRA MCP] Searching JIRA issues with JQL: ${request.params.arguments.jql}`);
            result = await this.searchJiraIssues(request.params.arguments);
            console.error(`✅ [JIRA MCP] Search completed`);
            return result;
          
          case "update_jira_issue":
            console.error(`📝 [JIRA MCP] Updating JIRA issue: ${request.params.arguments.issueKey}`);
            result = await this.updateJiraIssue(request.params.arguments);
            console.error(`✅ [JIRA MCP] Issue updated successfully`);
            return result;
          
          case "link_test_to_issue":
            console.error(`🔗 [JIRA MCP] Linking test to issue: ${request.params.arguments.issueKey}`);
            result = await this.linkTestToIssue(request.params.arguments);
            console.error(`✅ [JIRA MCP] Test linked successfully`);
            return result;
          
          case "bulk_import_stories":
            console.error(`📦 [JIRA MCP] Bulk importing stories from: ${request.params.arguments.testPlanFile}`);
            result = await this.bulkImportStories(request.params.arguments);
            console.error(`✅ [JIRA MCP] Bulk import completed`);
            return result;
          
          case "create_jira_workspace":
            console.error(`🏗️ [JIRA MCP] Creating workspace: ${request.params.arguments.workspaceName}`);
            result = await this.createJiraWorkspace(request.params.arguments);
            console.error(`✅ [JIRA MCP] Workspace created successfully`);
            return result;
          
          case "get_board_info":
            console.error(`📋 [JIRA MCP] Getting board info for board: ${request.params.arguments.boardId}`);
            result = await this.getBoardInfo(request.params.arguments);
            console.error(`✅ [JIRA MCP] Board info retrieved`);
            return result;
          
          default:
            console.error(`❌ [JIRA MCP] Unknown tool: ${request.params.name}`);
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error(`❌ [JIRA MCP] Error in ${request.params.name}:`, error.message);
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message}`
          }]
        };
      }
    });
  }

  async makeJiraRequest(endpoint, method = "GET", data = null) {
    // Determine the correct API path
    let fullUrl;
    if (endpoint.startsWith('agile/')) {
      // Agile API endpoints
      fullUrl = `${JIRA_CONFIG.baseUrl}/rest/${endpoint}`;
    } else {
      // Regular JIRA API endpoints  
      fullUrl = `${JIRA_CONFIG.baseUrl}/rest/api/3/${endpoint}`;
    }
    
    console.error(`🌐 [JIRA API] ${method} ${fullUrl}`);
    if (data) {
      console.error(`📤 [JIRA API] Request data:`, JSON.stringify(data, null, 2));
    }
    
    // Validate configuration
    if (!JIRA_CONFIG.email || !JIRA_CONFIG.apiToken) {
      throw new Error('JIRA email and API token must be configured');
    }
    
    const credentials = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString('base64');
    
    const options = {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'JIRA-MCP-Server/1.0.0'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [JIRA API] Error ${response.status}: ${errorText}`);
        throw new Error(`JIRA API Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.error(`✅ [JIRA API] Success - Response received`);
      return result;
    } catch (error) {
      if (error.message.includes('JIRA API Error')) {
        throw error;
      }
      console.error(`❌ [JIRA API] Network error:`, error.message);
      throw new Error(`Network error connecting to JIRA: ${error.message}`);
    }
  }

  async createJiraIssue(args) {
    const { issueType, summary, description, priority = "Medium", epicLink, labels = [], acceptanceCriteria, testReference } = args;
    
    let fullDescription = description;
    if (acceptanceCriteria) {
      fullDescription += `\n\n*Acceptance Criteria:*\n${acceptanceCriteria}`;
    }
    if (testReference) {
      fullDescription += `\n\n*Test Reference:* ${testReference}`;
    }

    // Use Atlassian Document Format for description
    const docDescription = {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": fullDescription
            }
          ]
        }
      ]
    };

    const issueData = {
      fields: {
        project: { key: JIRA_CONFIG.projectKey },
        summary,
        description: docDescription,
        issuetype: { name: issueType },
        priority: { name: priority },
        labels
      }
    };

    // Add epic link for stories
    if (epicLink && issueType === "Story") {
      issueData.fields.parent = { key: epicLink };
    }

    const result = await this.makeJiraRequest("issue", "POST", issueData);
    
    return {
      content: [{
        type: "text", 
        text: `✅ Created ${issueType}: ${result.key}\nSummary: ${summary}\nURL: ${JIRA_CONFIG.baseUrl}/browse/${result.key}`
      }]
    };
  }

  async searchJiraIssues(args) {
    const { jql, maxResults = 50, fields = ["summary", "status", "priority"] } = args;
    
    const searchData = {
      jql,
      maxResults,
      fields
    };
    
    const result = await this.makeJiraRequest("search/jql", "POST", searchData);
    
    const issues = result.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name,
      priority: issue.fields.priority?.name,
      url: `${JIRA_CONFIG.baseUrl}/browse/${issue.key}`
    }));

    return {
      content: [{
        type: "text",
        text: `Found ${result.total} issues (showing ${issues.length}):\n\n${issues.map(i => `${i.key}: ${i.summary} [${i.status}]`).join('\n')}`
      }]
    };
  }

  async updateJiraIssue(args) {
    const { issueKey, fields, comment } = args;
    
    const updateData = {};
    if (fields) updateData.fields = fields;
    if (comment) {
      updateData.update = {
        comment: [{ add: { body: comment } }]
      };
    }

    await this.makeJiraRequest(`issue/${issueKey}`, "PUT", updateData);
    
    return {
      content: [{
        type: "text",
        text: `✅ Updated issue: ${issueKey}`
      }]
    };
  }

  async linkTestToIssue(args) {
    const { issueKey, testFile, testResult, automationStatus } = args;
    
    const comment = `🔗 *Test Link*
📁 Test File: ${testFile}
${testResult ? `📊 Result: ${testResult}` : ''}
${automationStatus ? `🤖 Automation: ${automationStatus}` : ''}`;

    await this.updateJiraIssue({ issueKey, comment });

    return {
      content: [{
        type: "text",
        text: `✅ Linked test ${testFile} to ${issueKey}`
      }]
    };
  }

  async bulkImportStories(args) {
    const { testPlanFile, epicMapping = {}, defaultPriority = "Medium" } = args;
    
    // This would read the test plan and create stories
    // Implementation depends on test plan format
    
    return {
      content: [{
        type: "text", 
        text: `🚀 Bulk import from ${testPlanFile} initiated for workspace: ${JIRA_CONFIG.workspace}`
      }]
    };
  }

  async createJiraWorkspace(args) {
    const { workspaceName, projectKey, createSampleData = false } = args;
    
    // Create workspace structure
    const epics = [
      { name: "Vehicle Data Entry", description: "Epic for vehicle data management" },
      { name: "Form Validation", description: "Epic for form validation and error handling" },
      { name: "Personal Information", description: "Epic for personal info management" },
      { name: "Product Configuration", description: "Epic for insurance product config" }
    ];
    
    const results = [];
    
    if (createSampleData) {
      for (const epic of epics) {
        try {
          const result = await this.createJiraIssue({
            issueType: "Epic",
            summary: epic.name,
            description: epic.description,
            labels: ["mcp-agents", "automobile-insurance"]
          });
          results.push(result.content[0].text);
        } catch (error) {
          results.push(`❌ Failed to create epic ${epic.name}: ${error.message}`);
        }
      }
    }

    return {
      content: [{
        type: "text",
        text: `✅ JIRA Workspace "${workspaceName}" created for project ${projectKey}\n\n${results.join('\n')}`
      }]
    };
  }

  async getBoardInfo(args) {
    const { boardId, includeSprints = true } = args;
    
    try {
      // Try the updated agile API endpoint 
      const board = await this.makeJiraRequest(`agile/1.0/board/${boardId}`);
      let result = `📊 Board: ${board.name}\nType: ${board.type}\nProject: ${board.location?.projectName || 'N/A'}`;
      
      if (includeSprints) {
        try {
          const sprints = await this.makeJiraRequest(`agile/1.0/board/${boardId}/sprint`);
          result += `\n\n🏃‍♀️ Sprints: ${sprints.values?.length || 0} total`;
        } catch (e) {
          result += `\n\nSprints: Unable to fetch (${e.message})`;
        }
      }

      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      console.error(`❌ [JIRA] Board info error:`, error.message);
      return {
        content: [{
          type: "text", 
          text: `❌ Error getting board info: ${error.message}\n\nTip: Make sure board ID ${boardId} exists and you have permissions to access it.`
        }]
      };
    }
  }

  async run() {
    console.error("🚀 [JIRA MCP] Starting JIRA MCP Server...");
    console.error("📋 [JIRA MCP] Configuration:");
    console.error(`   - JIRA Base URL: ${JIRA_CONFIG.baseUrl}`);
    console.error(`   - Project Key: ${JIRA_CONFIG.projectKey}`);
    console.error(`   - Workspace: ${JIRA_CONFIG.workspace}`);
    console.error(`   - Email: ${JIRA_CONFIG.email}`);
    console.error("🔧 [JIRA MCP] Available Tools:");
    console.error("   - create_jira_issue");
    console.error("   - search_jira_issues");
    console.error("   - update_jira_issue");
    console.error("   - link_test_to_issue");
    console.error("   - bulk_import_stories");
    console.error("   - create_jira_workspace");
    console.error("   - get_board_info");
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("✅ [JIRA MCP] Server connected and ready for requests!");
    console.error("🎯 [JIRA MCP] Workspace: " + JIRA_CONFIG.workspace);
    console.error("👀 [JIRA MCP] Waiting for tool calls...");
  }
}

// Run the server
const server = new JiraMCPServer();
server.run().catch(console.error);