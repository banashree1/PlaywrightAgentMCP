# JIRA Integration Instructions

## 🎯 Your JIRA Instance
- **URL**: https://banashreerautray.atlassian.net/jira/software/projects/DEV/boards/1
- **Project**: DEV
- **Board**: 1

## 📊 Stories Created
- **17 User Stories** across **6 Epics**
- All stories reference specific test scenarios
- Complete acceptance criteria based on test plan

---

## 🚀 Import Options

### Option 1: CSV Bulk Import (Recommended)

1. **Download CSV**: [jira-stories-import.csv](jira-stories-import.csv)

2. **Import to JIRA**:
   - Go to your DEV project: https://banashreerautray.atlassian.net/jira/software/projects/DEV
   - Click **Issues** → **Import Issues from CSV** 
   - Upload `jira-stories-import.csv`
   - Map fields according to your JIRA configuration
   - Review and confirm import

3. **Field Mapping**:
   ```
   CSV Column          → JIRA Field
   Issue Type          → Issue Type
   Summary             → Summary  
   Description         → Description
   Priority            → Priority
   Epic Name           → Epic Name
   Labels              → Labels
   Acceptance Criteria → Custom field or Description
   ```

### Option 2: PowerShell API Script (Automated)

1. **Get API Token**:
   - Go to: https://id.atlassian.com/manage-profile/security/api-tokens
   - Create API token for your account

2. **Run PowerShell Script**:
   ```powershell
   .\import-jira-stories.ps1 -Email "your-email@domain.com" -ApiToken "your-api-token"
   ```

3. **Script Features**:
   - ✅ Creates all 6 epics automatically
   - ✅ Creates all 17 user stories linked to epics  
   - ✅ Includes full acceptance criteria
   - ✅ Sets proper labels and priorities
   - ✅ Links stories to test scenarios

### Option 3: Manual Creation

Copy story details from [userstory.md](userstory.md) and create manually in JIRA interface.

---

## 🏗️ Story Structure Created

### Epic 1: Vehicle Data Entry (3 stories)
- TRI-101: Complete Automobile Vehicle Data Information Entry
- TRI-102: Automobile Make and Model Selection Validation  
- TRI-103: Date Picker Functionality for Vehicle Manufacturing Date

### Epic 2: Form Validation (3 stories)
- TRI-201: Vehicle Data Required Field Validation
- TRI-202: Invalid Date Input Validation
- TRI-203: Numeric Field Validation for Vehicle Data

### Epic 3: Personal Information (3 stories)
- TRI-301: Complete Personal Information Form Entry
- TRI-302: Country Selection Functionality
- TRI-303: File Upload Functionality for Pictures

### Epic 4: Data Quality (2 stories)
- TRI-401: Personal Information Field Validation
- TRI-402: Address Validation and Postal Code Verification

### Epic 5: Product Configuration (2 stories)
- TRI-501: Complete Insurance Product Configuration
- TRI-502: Insurance Sum Selection and Display

### Epic 6: Price Access Control (2 stories)  
- TRI-701: Price Option Access Without Prerequisites
- TRI-702: Price Option Access After Completing Prerequisites

---

## 🔗 Test Plan Integration

Each story includes:
- ✅ **Test Scenario Reference**: Direct link to test file
- ✅ **Acceptance Criteria**: Derived from test plan expectations  
- ✅ **Labels**: For easy filtering and organization
- ✅ **Epic Linking**: Proper story hierarchy

## 📝 Next Steps

1. **Choose import method** (CSV recommended for bulk import)
2. **Import stories** to your DEV project
3. **Customize fields** as needed for your workflow
4. **Link to test automation** when Playwright tests are implemented
5. **Track progress** through your JIRA board

---

**Ready to import?** Use the CSV file for fastest bulk import, or run the PowerShell script for full automation!