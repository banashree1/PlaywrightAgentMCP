#!/usr/bin/env node

/**
 * JIRA Workspace Setup Script
 * Initializes BanaMCPAgentsAutomobile workspace with user stories
 */

import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_BASE_URL || "https://banashreerautray.atlassian.net",
  email: process.env.JIRA_EMAIL || "banashree.rautray@gmail.com",
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY || "DEV",
  workspace: process.env.JIRA_WORKSPACE || "BanaMCPAgentsAutomobile"
};

// User Stories and Epics from Test Plan
const EPICS = [
  {
    name: "Vehicle Data Entry and Management",
    description: "Epic for managing all vehicle data entry functionality in the Tricentis automobile insurance application",
    labels: ["automobile-insurance", "vehicle-data"]
  },
  {
    name: "Form Validation and Error Handling",
    description: "Epic for comprehensive form validation and error handling across all application forms", 
    labels: ["validation", "error-handling"]
  },
  {
    name: "Personal Information Management",
    description: "Epic for managing customer personal information entry and validation",
    labels: ["personal-info", "customer-data"]
  },
  {
    name: "Input Validation and Data Quality", 
    description: "Epic for ensuring high data quality through comprehensive input validation",
    labels: ["validation", "data-quality"]
  },
  {
    name: "Insurance Product Configuration",
    description: "Epic for configuring insurance products, policy details and coverage options",
    labels: ["product-config", "insurance-options"]
  },
  {
    name: "Price Option Access Control",
    description: "Epic for controlling access to pricing information based on prerequisite completion", 
    labels: ["pricing", "access-control"]
  }
];

const USER_STORIES = [
  {
    epic: "Vehicle Data Entry and Management",
    summary: "Complete Automobile Vehicle Data Information Entry",
    description: "As a customer seeking automobile insurance I want to enter complete vehicle information for my automobile So that I can receive accurate insurance quotes based on my vehicle specifications",
    priority: "High",
    testRef: "tests/vehicle-data/complete-automobile-data.spec.js",
    acceptanceCriteria: `
- AC1: Make dropdown displays all available automobile manufacturers
- AC2: Model dropdown becomes enabled and populated with appropriate models when make is selected  
- AC3: Engine Performance field accepts valid numeric values and displays correctly
- AC4: Date of Manufacture field accepts valid dates in MM/DD/YYYY format
- AC5: Number of Seats dropdown allows selection and saves correctly
- AC6: Fuel Type dropdown allows selection and saves correctly
- AC7: All remaining required fields accept valid data without validation errors
- AC8: 'Next >' button successfully validates form and navigates to 'Enter Insurant Data' tab
- AC9: All entered vehicle data is preserved during navigation`
  },
  {
    epic: "Vehicle Data Entry and Management",
    summary: "Automobile Make and Model Selection Validation", 
    description: "As a customer entering vehicle information I want to select from available automobile makes and see corresponding model options So that I can specify my exact vehicle for accurate insurance rating",
    priority: "Medium",
    testRef: "tests/vehicle-data/automobile-make-model-options.spec.js",
    acceptanceCriteria: `
- AC1: Make dropdown opens and displays complete list of 15 automobile manufacturers
- AC2: Model dropdown becomes enabled only after make selection
- AC3: Model options change dynamically based on selected make
- AC4: Each make/model combination can be selected and saved properly
- AC5: No JavaScript errors occur during make/model selection process
- AC6: Selected make/model combination persists when navigating between form sections`
  },
  {
    epic: "Vehicle Data Entry and Management",
    summary: "Date Picker Functionality for Vehicle Manufacturing Date",
    description: "As a customer entering vehicle information I want to use an intuitive date picker for manufacturing date entry So that I can easily and accurately specify when my vehicle was manufactured",
    priority: "Medium", 
    testRef: "tests/vehicle-data/date-picker-validation.spec.js",
    acceptanceCriteria: `
- AC1: Date field shows MM/DD/YYYY placeholder when focused
- AC2: Calendar icon opens date picker widget when clicked
- AC3: Date picker displays current month/year by default
- AC4: Date picker allows navigation through different months and years
- AC5: Dates are selectable from calendar interface
- AC6: Selected date populates input field in correct format`
  },
  // --- Tab 1: Validation Scenarios ---
  {
    epic: "Form Validation and Error Handling",
    summary: "Automobile Required Field Validation",
    description: "As a user I want required field validation so that I cannot proceed without filling mandatory vehicle data fields",
    priority: "High",
    testRef: "tests/vehicle-data/automobile-required-validation.spec.js",
    acceptanceCriteria: `
- AC1: Clicking Next without filling any fields shows validation errors
- AC2: User remains on current tab when validation fails
- AC3: Filling only some required fields shows errors only for remaining empty fields`
  },
  {
    epic: "Form Validation and Error Handling",
    summary: "Invalid Date Input Validation for Vehicle Manufacture Date",
    description: "As a user I want date input validation so that I cannot enter invalid dates in the Date of Manufacture field",
    priority: "Medium",
    testRef: "tests/vehicle-data/invalid-date-validation.spec.js",
    acceptanceCriteria: `
- AC1: Entering invalid format (e.g. 13/45/2020) shows appropriate error
- AC2: Entering unreasonable future dates is prevented with an error message`
  },
  {
    epic: "Form Validation and Error Handling",
    summary: "Automobile Numeric Field Validation",
    description: "As a user I want numeric field validation so that Engine Performance and Cylinder Capacity fields only accept valid numbers",
    priority: "Medium",
    testRef: "tests/vehicle-data/automobile-numeric-validation.spec.js",
    acceptanceCriteria: `
- AC1: Non-numeric characters in Engine Performance show a validation error
- AC2: Negative values are rejected
- AC3: Extremely large values are handled appropriately`
  },
  // --- Tab 2: Insurant Data Happy Path ---
  {
    epic: "Personal Information Management",
    summary: "Complete Personal Information Form - Insurant Data Tab",
    description: "As a customer I want to enter my personal information so that the insurance quote is tailored to me",
    priority: "High",
    testRef: "tests/insurant-data/complete-personal-info.spec.js",
    acceptanceCriteria: `
- AC1: All personal information fields are visible after navigating to Insurant Data tab
- AC2: First Name, Last Name and Date of Birth fields accept valid input
- AC3: Gender radio buttons work correctly
- AC4: Address fields (Street, Country, Zip, City) accept input correctly
- AC5: Occupation dropdown contains Employee, Public Official, Farmer, Unemployed, Selfemployed
- AC6: Multiple hobby checkboxes can be selected
- AC7: Clicking Next proceeds to Enter Product Data tab`
  },
  {
    epic: "Personal Information Management",
    summary: "Country Dropdown Functionality in Insurant Data",
    description: "As a customer I want a comprehensive country dropdown so that I can select my country of residence accurately",
    priority: "Low",
    testRef: "tests/insurant-data/country-dropdown-test.spec.js",
    acceptanceCriteria: `
- AC1: Country dropdown opens with a comprehensive alphabetical list
- AC2: Selected country is properly saved and displayed`
  },
  {
    epic: "Personal Information Management",
    summary: "Picture Upload Functionality in Insurant Data",
    description: "As a customer I want to upload a picture for my insurance profile",
    priority: "Low",
    testRef: "tests/insurant-data/picture-upload-test.spec.js",
    acceptanceCriteria: `
- AC1: Clicking Choose File opens file browser
- AC2: Selecting a valid image shows the filename in the input
- AC3: Upload is accepted without errors`
  },
  // --- Tab 2: Validation Scenarios ---
  {
    epic: "Input Validation and Data Quality",
    summary: "Personal Information Field Validation",
    description: "As a user I want personal information validation so I cannot proceed with empty or invalid fields",
    priority: "High",
    testRef: "tests/insurant-data/personal-info-validation.spec.js",
    acceptanceCriteria: `
- AC1: Leaving required fields empty prevents proceeding
- AC2: Special characters in name fields trigger appropriate validation`
  },
  {
    epic: "Input Validation and Data Quality",
    summary: "Address Validation Testing",
    description: "As a user I want address fields validated so that only proper postal formats are accepted",
    priority: "Low",
    testRef: "tests/insurant-data/address-validation.spec.js",
    acceptanceCriteria: `
- AC1: Postal code validation matches country-specific requirements if implemented
- AC2: Fields handle long addresses without breaking layout`
  },
  // --- Tab 3: Product Data Happy Path ---
  {
    epic: "Insurance Product Configuration",
    summary: "Complete Insurance Product Configuration",
    description: "As a customer I want to configure my insurance product preferences so that my quote reflects the coverage I need",
    priority: "High",
    testRef: "tests/product-data/complete-product-config.spec.js",
    acceptanceCriteria: `
- AC1: Start Date field accepts future dates in correct format
- AC2: Insurance Sum dropdown shows amounts from 3,000,000 to 35,000,000
- AC3: Merit Rating options include Super Bonus, Bonus 1-9, Malus 10-17
- AC4: Damage Insurance options include No Coverage, Partial Coverage, Full Coverage
- AC5: Optional products (Euro Protection, Legal Defense) can be multi-selected
- AC6: Courtesy Car Yes/No selection is saved
- AC7: Clicking Next proceeds to Select Price Option tab`
  },
  {
    epic: "Insurance Product Configuration",
    summary: "Insurance Sum Options Validation",
    description: "As a customer I want to see all available insurance sum options so that I can choose appropriate coverage amount",
    priority: "Low",
    testRef: "tests/product-data/insurance-sum-options.spec.js",
    acceptanceCriteria: `
- AC1: All insurance amount options are displayed with proper currency notation
- AC2: Selection affects subsequent form behaviour if applicable`
  },
  // --- Tab 3: Validation Scenarios ---
  {
    epic: "Input Validation and Data Quality",
    summary: "Product Start Date Validation",
    description: "As a user I want start date validation so that insurance cannot be backdated",
    priority: "Medium",
    testRef: "tests/product-data/start-date-validation.spec.js",
    acceptanceCriteria: `
- AC1: Past dates in Start Date field trigger a validation error
- AC2: Invalid date formats are rejected`
  },
  {
    epic: "Input Validation and Data Quality",
    summary: "Required Product Field Validation",
    description: "As a user I want required product field validation so I cannot proceed without all mandatory product data",
    priority: "Medium",
    testRef: "tests/product-data/required-product-validation.spec.js",
    acceptanceCriteria: `
- AC1: Missing required fields prevent proceeding
- AC2: Clear error messages guide user to complete required fields`
  },
  // --- Tab 4: Price Option ---
  {
    epic: "Price Option Access Control",
    summary: "Price Option Access Without Prerequisites",
    description: "As a user I want to see a clear message when accessing the price tab before completing previous steps",
    priority: "Medium",
    testRef: "tests/price-option/access-without-prerequisites.spec.js",
    acceptanceCriteria: `
- AC1: Navigating directly to Price Option tab shows 'Please, complete the first three steps to see the price table.'
- AC2: No price options are shown without prerequisites`
  },
  {
    epic: "Price Option Access Control",
    summary: "Price Option Access After Completing All Prerequisites",
    description: "As a customer who has completed all prior steps I want to see pricing options so I can choose my plan",
    priority: "High",
    testRef: "tests/price-option/access-with-prerequisites.spec.js",
    acceptanceCriteria: `
- AC1: Price table is visible after completing Vehicle, Insurant and Product Data tabs
- AC2: Multiple pricing options are displayed
- AC3: A price option can be selected and confirmed
- AC4: Proceeding to Send Quote tab becomes available after selection`
  },
  // --- Tab 5: Send Quote ---
  {
    epic: "Price Option Access Control",
    summary: "Send Quote Access Without Price Selection",
    description: "As a user I want a clear message when accessing Send Quote without selecting a price",
    priority: "Medium",
    testRef: "tests/send-quote/access-without-price-selection.spec.js",
    acceptanceCriteria: `
- AC1: Send Quote tab shows 'Please, select a price option to send the quote.' without a price selection
- AC2: Quote sending functionality is disabled`
  },
  {
    epic: "Price Option Access Control",
    summary: "Complete Quote Generation End-to-End Flow",
    description: "As a customer I want to complete the full insurance quote process and receive a confirmation",
    priority: "High",
    testRef: "tests/send-quote/complete-quote-generation.spec.js",
    acceptanceCriteria: `
- AC1: All 5 steps can be completed in sequence
- AC2: Quote is sent successfully
- AC3: Success confirmation modal appears (SweetAlert with 'Sending e-mail success!')
- AC4: All entered data is preserved through the entire flow`
  }
];

class JiraWorkspaceSetup {
  constructor() {
    this.epicKeys = new Map();
  }

  async makeJiraRequest(endpoint, method = "GET", data = null) {
    const fullUrl = `${JIRA_CONFIG.baseUrl}/rest/api/3/${endpoint}`;
    const credentials = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString('base64');
    const options = {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JIRA API ${response.status}: ${errorText}`);
    }
    return response.json();
  }

  async createEpic(epic) {
    console.log(`\n🎯 Creating Epic: ${epic.name}`);
    
    const toADF = (text) => ({
      type: "doc", version: 1,
      content: [{ type: "paragraph", content: [{ type: "text", text }] }]
    });

    const epicData = {
      fields: {
        project: { key: JIRA_CONFIG.projectKey },
        summary: epic.name,
        description: toADF(epic.description),
        issuetype: { name: "Epic" },
        labels: [...epic.labels, "mcp-agents", JIRA_CONFIG.workspace.toLowerCase()]
      }
    };

    const result = await this.makeJiraRequest("issue", "POST", epicData);
    this.epicKeys.set(epic.name, result.key);
    
    console.log(`✅ Created Epic: ${result.key} - ${epic.name}`);
    return result.key;
  }

  async createStory(story) {
    const epicKey = this.epicKeys.get(story.epic);
    if (!epicKey) {
      console.error(`❌ Epic not found: ${story.epic}`);
      return null;
    }

    console.log(`\n📝 Creating Story: ${story.summary}`);

    const toADF = (text) => ({
      type: "doc", version: 1,
      content: text.split('\n').filter(l => l.trim()).map(line => ({
        type: "paragraph",
        content: [{ type: "text", text: line }]
      }))
    });

    const fullText = `${story.description}\n\nTest Reference: ${story.testRef}\n\nAcceptance Criteria:${story.acceptanceCriteria}`;

    const storyData = {
      fields: {
        project: { key: JIRA_CONFIG.projectKey },
        summary: story.summary,
        description: toADF(fullText),
        issuetype: { name: "Task" },
        priority: { name: story.priority },
        parent: { key: epicKey },
        labels: ["automobile-insurance", "mcp-agents", "test-automation"]
      }
    };

    const result = await this.makeJiraRequest("issue", "POST", storyData);
    console.log(`✅ Created Story: ${result.key} - ${story.summary}`);
    return result.key;
  }

  async setupWorkspace() {
    console.log(`🚀 Setting up JIRA Workspace: ${JIRA_CONFIG.workspace}`);
    console.log(`📋 Project: ${JIRA_CONFIG.projectKey}`);
    console.log(`🌐 JIRA URL: ${JIRA_CONFIG.baseUrl}\n`);

    // Create Epics
    console.log("📊 Creating Epics...");
    for (const epic of EPICS) {
      await this.createEpic(epic);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    // Create User Stories
    console.log("\n📝 Creating User Stories...");
    for (const story of USER_STORIES) {
      await this.createStory(story);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    // Create workspace summary
    await this.createWorkspaceSummary();

    console.log("\n✅ JIRA Workspace Setup Complete!");
    console.log(`🔗 View your board: ${JIRA_CONFIG.baseUrl}/jira/software/projects/${JIRA_CONFIG.projectKey}/boards/1`);
  }

  async createWorkspaceSummary() {
    const summary = `
# ${JIRA_CONFIG.workspace} - JIRA Workspace

## 📊 Workspace Overview
- **Project**: ${JIRA_CONFIG.projectKey}
- **Epics Created**: ${EPICS.length}
- **Stories Created**: ${USER_STORIES.length}
- **Test Plan Integration**: ✅ Linked to test scenarios

## 🎯 Epic Structure
${EPICS.map((epic, i) => `${i + 1}. **${epic.name}** - ${epic.description}`).join('\n')}

## 🔗 JIRA Integration Features
- ✅ Automated story creation from test plans
- ✅ Test scenario linking
- ✅ Acceptance criteria mapping
- ✅ Epic organization by workflow
- ✅ MCP server integration ready

## 🚀 Next Steps
1. Review created epics and stories in JIRA
2. Customize story priorities and assignments
3. Set up sprints and planning
4. Link test automation results
5. Configure MCP server for ongoing operations

**JIRA Board**: ${JIRA_CONFIG.baseUrl}/jira/software/projects/${JIRA_CONFIG.projectKey}/boards/1
`;

    await fs.writeFile(
      path.join(process.cwd(), 'docs', 'jira-workspace-summary.md'),
      summary,
      'utf8'
    );

    console.log('\n📄 Created workspace summary: docs/jira-workspace-summary.md');
  }

  async verifyCredentials() {
    if (!JIRA_CONFIG.apiToken) {
      console.error('❌ JIRA_API_TOKEN environment variable not set');
      console.error('   Set it with: $env:JIRA_API_TOKEN="your-token-here"');
      return false;
    }
    try {
      const project = await this.makeJiraRequest(`project/${JIRA_CONFIG.projectKey}`);
      console.log(`✅ JIRA credentials verified. Project: ${project.name} (${project.key})`);
      return true;
    } catch (e) {
      console.error(`❌ JIRA credential check failed: ${e.message}`);
      return false;
    }
  }
}

// Run the setup
async function main() {
  const setup = new JiraWorkspaceSetup();
  
  console.log(`🎯 JIRA Workspace Setup - ${JIRA_CONFIG.workspace}`);
  console.log('=' .repeat(60));

  if (await setup.verifyCredentials()) {
    await setup.setupWorkspace();
  } else {
    console.error('❌ Setup failed - please check JIRA credentials');
    process.exit(1);
  }
}

main().catch(console.error);