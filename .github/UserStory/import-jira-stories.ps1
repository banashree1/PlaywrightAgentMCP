# JIRA Story Import Script
# This script creates all user stories in JIRA using REST API

param(
    [Parameter(Mandatory=$true)]
    [string]$JiraUrl = "https://banashreerautray.atlassian.net",
    
    [Parameter(Mandatory=$true)]
    [string]$Email,  # Your JIRA email
    
    [Parameter(Mandatory=$true)]
    [string]$ApiToken,  # Generate from: https://id.atlassian.com/manage-profile/security/api-tokens
    
    [string]$ProjectKey = "DEV"
)

# Create base64 encoded credentials
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Email`:$ApiToken"))

# Headers for JIRA API
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Function to create JIRA issue
function Create-JiraIssue {
    param($issueData)
    
    $uri = "$JiraUrl/rest/api/3/issue"
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body ($issueData | ConvertTo-Json -Depth 10)
        Write-Host "✅ Created: $($response.key) - $($issueData.fields.summary)" -ForegroundColor Green
        return $response.key
    }
    catch {
        Write-Host "❌ Failed to create issue: $($issueData.fields.summary)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Epic definitions
$epics = @(
    @{
        summary = "Vehicle Data Entry and Management"
        description = "Epic for managing all vehicle data entry functionality in the Tricentis automobile insurance application"
        labels = @("automobile-insurance", "vehicle-data")
    },
    @{
        summary = "Form Validation and Error Handling" 
        description = "Epic for comprehensive form validation and error handling across all application forms"
        labels = @("validation", "error-handling")
    },
    @{
        summary = "Personal Information Management"
        description = "Epic for managing customer personal information entry and validation" 
        labels = @("personal-info", "customer-data")
    },
    @{
        summary = "Input Validation and Data Quality"
        description = "Epic for ensuring high data quality through comprehensive input validation"
        labels = @("validation", "data-quality", "input-validation")
    },
    @{
        summary = "Insurance Product Configuration"
        description = "Epic for configuring insurance products, policy details and coverage options"
        labels = @("product-config", "insurance-options")
    },
    @{
        summary = "Price Option Access Control"
        description = "Epic for controlling access to pricing information based on prerequisite completion"
        labels = @("pricing", "access-control", "prerequisites")
    }
)

# Store epic keys
$epicKeys = @{}

Write-Host "🚀 Creating Epics..." -ForegroundColor Cyan

# Create Epics first
foreach ($epic in $epics) {
    $epicData = @{
        fields = @{
            project = @{ key = $ProjectKey }
            summary = $epic.summary
            description = $epic.description
            issuetype = @{ name = "Epic" }
            labels = $epic.labels
        }
    }
    
    $key = Create-JiraIssue -issueData $epicData
    if ($key) {
        $epicKeys[$epic.summary] = $key
        Start-Sleep -Seconds 1  # Rate limiting
    }
}

Write-Host "`n📝 Creating User Stories..." -ForegroundColor Cyan

# Story definitions
$stories = @(
    @{
        summary = "Complete Automobile Vehicle Data Information Entry"
        epicName = "Vehicle Data Entry and Management"
        description = @"
**User Story:**
As a customer seeking automobile insurance
I want to enter complete vehicle information for my automobile  
So that I can receive accurate insurance quotes based on my vehicle specifications

**Test Scenario Reference:** tests/vehicle-data/complete-automobile-data.spec.js
"@
        acceptanceCriteria = @"
- AC1: Make dropdown displays all available automobile manufacturers
- AC2: Model dropdown becomes enabled and populated with appropriate models when make is selected
- AC3: Engine Performance field accepts valid numeric values and displays correctly
- AC4: Date of Manufacture field accepts valid dates in MM/DD/YYYY format
- AC5: Number of Seats dropdown allows selection and saves correctly
- AC6: Fuel Type dropdown allows selection and saves correctly  
- AC7: All remaining required fields accept valid data without validation errors
- AC8: 'Next >' button successfully validates form and navigates to 'Enter Insurant Data' tab
- AC9: All entered vehicle data is preserved during navigation
"@
        priority = "High"
        labels = @("automobile-insurance", "vehicle-data", "form-entry")
    },
    @{
        summary = "Automobile Make and Model Selection Validation"
        epicName = "Vehicle Data Entry and Management"
        description = @"
**User Story:**
As a customer entering vehicle information
I want to select from available automobile makes and see corresponding model options
So that I can specify my exact vehicle for accurate insurance rating

**Test Scenario Reference:** tests/vehicle-data/automobile-make-model-options.spec.js
"@
        acceptanceCriteria = @"
- AC1: Make dropdown opens and displays complete list of 15 automobile manufacturers
- AC2: Model dropdown becomes enabled only after make selection
- AC3: Model options change dynamically based on selected make
- AC4: Each make/model combination can be selected and saved properly
- AC5: No JavaScript errors occur during make/model selection process
- AC6: Selected make/model combination persists when navigating between form sections
"@
        priority = "Medium"
        labels = @("automobile-insurance", "vehicle-data", "validation")
    },
    @{
        summary = "Date Picker Functionality for Vehicle Manufacturing Date"
        epicName = "Vehicle Data Entry and Management"
        description = @"
**User Story:**
As a customer entering vehicle information
I want to use an intuitive date picker for manufacturing date entry
So that I can easily and accurately specify when my vehicle was manufactured

**Test Scenario Reference:** tests/vehicle-data/date-picker-validation.spec.js
"@
        acceptanceCriteria = @"
- AC1: Date field shows MM/DD/YYYY placeholder when focused
- AC2: Calendar icon opens date picker widget when clicked
- AC3: Date picker displays current month/year by default
- AC4: Date picker allows navigation through different months and years
- AC5: Dates are selectable from calendar interface
- AC6: Selected date populates input field in correct format
"@
        priority = "Medium"
        labels = @("automobile-insurance", "vehicle-data", "date-picker")
    }
    # Add more stories here...
)

# Create Stories
foreach ($story in $stories) {
    $epicKey = $epicKeys[$story.epicName]
    
    if (-not $epicKey) {
        Write-Host "⚠️  Epic not found for story: $($story.summary)" -ForegroundColor Yellow
        continue
    }
    
    $storyData = @{
        fields = @{
            project = @{ key = $ProjectKey }
            summary = $story.summary
            description = "$($story.description)`n`n**Acceptance Criteria:**`n$($story.acceptanceCriteria)"
            issuetype = @{ name = "Story" }
            priority = @{ name = $story.priority }
            labels = $story.labels
            parent = @{ key = $epicKey }  # Link to epic
        }
    }
    
    Create-JiraIssue -issueData $storyData
    Start-Sleep -Seconds 1  # Rate limiting
}

Write-Host "`n✅ JIRA Story Import Complete!" -ForegroundColor Green
Write-Host "📋 Check your JIRA board: $JiraUrl/jira/software/projects/$ProjectKey/boards/1" -ForegroundColor Cyan

# Instructions for getting API token
Write-Host "`n💡 To get your API token:" -ForegroundColor Yellow
Write-Host "1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens" -ForegroundColor White
Write-Host "2. Click 'Create API token'" -ForegroundColor White  
Write-Host "3. Use your email and the token with this script" -ForegroundColor White