# Tricentis Insurance Application - Test Automation Knowledge Base

## Application Architecture Overview

### Multi-Vehicle Insurance Quote System
The Tricentis Vehicle Insurance Application is a comprehensive 5-step progressive web application designed for generating insurance quotes across multiple vehicle types.

### Application Flow
```
Homepage → Vehicle Type Selection → 5-Step Process → Quote Generation
```

### 5-Step Sequential Process
1. **Enter Vehicle Data** - Vehicle specifications and details
2. **Enter Insurant Data** - Personal information of the insured
3. **Enter Product Data** - Insurance product preferences
4. **Select Price Option** - Choose from available pricing plans
5. **Send Quote** - Generate and send final quote

## Vehicle Types & Configurations

### Supported Vehicle Types
| Vehicle Type | Tab Numbers | Unique Fields | Special Behaviors |
|--------------|-------------|---------------|------------------|
| **Automobile** | Standard (12,7,6,1,4) | Model dropdown, Standard fields | Default configuration |
| **Truck** | Modified (9,4) | No Model dropdown, Commercial fields | Simplified navigation |
| **Motorcycle** | Standard (12,7,6,1,4) | Model: Scooter/Three-Wheeler/Moped/Motorcycle, Cylinder Capacity [ccm] | Enhanced form fields |
| **Camper** | Standard | Payload [kg], Total Weight [kg] | Commercial specifications |

### Dynamic Form Field Variations

#### Common Fields (All Vehicle Types)
- Make (dropdown with 15 manufacturers)
- Engine Performance [kW]
- Date of Manufacture (MM/DD/YYYY format)
- Number of Seats
- Fuel Type (Petrol, Diesel, Electric Power, Gas, Other)
- List Price [$]
- License Plate Number
- Annual Mileage [mi]

#### Vehicle-Specific Fields
**Motorcycle Only:**
- Model dropdown (Scooter, Three-Wheeler, Moped, Motorcycle)
- Cylinder Capacity [ccm]
- Right Hand Drive (Yes/No radio buttons)

**Truck/Camper:**
- Payload [kg]
- Total Weight [kg]
- No Model dropdown

**Automobile:**
- Standard Model dropdown (becomes enabled after Make selection)
- Right Hand Drive options

## Technical Implementation Patterns

### Locator Strategies
```javascript
// Reliable element selection patterns discovered during automation
await page.selectOption('[id="make"]', 'Toyota');          // Dropdown by ID
await page.fill('[id="engineperformance"]', '120');       // Text input by ID
await page.selectOption('[id="numberofseats"]', '5');     // Multi-step dropdown
await page.click('#nextenterinsurantdata');               // Navigation button
```

### Form Validation Behaviors
- **Required Field Validation**: Triggered on Next button click
- **Date Validation**: MM/DD/YYYY format enforced
- **Numeric Field Validation**: Engine Performance, Cylinder Capacity
- **Dropdown Dependencies**: Model dropdown enabled after Make selection

### Progressive Tab Access Control
- Tabs are sequentially unlocked
- Previous step completion required
- Price Option tab requires first 3 steps completed
- Send Quote tab requires all 4 previous steps completed

## Test Automation Best Practices

### Setup Patterns
```javascript
// Standard setup for vehicle testing
const { test, expect } = require('@playwright/test');

test.describe('Vehicle Type Selection and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/');
  });
});
```

### Common Assertions
```javascript
// Header validation
await expect(page.locator('h1')).toContainText('Vehicle Insurance Application');

// Tab number verification  
await expect(page.locator('[id="entervehicledata"] span')).toHaveText('12');

// Form field presence
await expect(page.locator('[id="make"]')).toBeVisible();

// Navigation success
await expect(page).toHaveURL(/.*insurantdata.*/);
```

### Wait Strategies
```javascript
// Wait for dynamic content
await page.waitForSelector('[id="model"]:not([disabled])');

// Wait for navigation
await page.waitForURL('**/insurantdata/**');

// Wait for form elements
await page.waitForLoadState('networkidle');
```

## Known Issues & Workarounds

### Browser Compatibility
- **Date Picker**: Different behavior across browsers
- **Dropdown Animations**: May require explicit waits
- **Tab Navigation**: Progressive unlock may have timing issues

### Form Dependencies
- **Model Dropdown**: Only enabled after Make selection
- **Tab Access**: Sequential dependency enforcement
- **Validation Timing**: Occurs on navigation attempt, not real-time

## Test Data Recommendations

### Valid Test Data Sets
```javascript
const validVehicleData = {
  automobile: {
    make: 'Toyota',
    model: 'Model Option 1', // Will be available after make selection
    enginePerformance: '120',
    dateOfManufacture: '01/15/2020',
    numberOfSeats: '5',
    fuelType: 'Petrol',
    listPrice: '25000',
    licensePlate: 'ABC123',
    annualMileage: '10000'
  },
  motorcycle: {
    make: 'Honda',
    model: 'Motorcycle',
    cylinderCapacity: '600',
    enginePerformance: '85',
    rightHandDrive: 'No',
    // ... other fields
  }
};
```

### Edge Case Test Data
```javascript
const edgeTestData = {
  invalidDates: ['13/45/2020', '00/00/0000', '99/99/9999'],
  invalidNumbers: ['ABC', '-100', '99999999'],
  boundaryValues: ['1', '999999', '0']
};
```

## Performance Considerations

### Page Load Optimization
- Initial load time: ~2-3 seconds
- Tab switching: ~500ms
- Form submission: ~1-2 seconds
- Dynamic content loading: ~300ms

### Test Execution Timing
- Single vehicle type test: ~30-45 seconds
- Complete form fill test: ~2-3 minutes
- Full end-to-end flow: ~8-10 minutes

## Maintenance Notes

### Regular Updates Required
- Vehicle make/model options may change
- Form field validations may be updated
- Tab numbering system might be modified
- URL patterns could change

### Version Information
- Current Version: 1.0.1
- Last Updated: March 2026
- Test Environment: https://sampleapp.tricentis.com/101/

---

*This knowledge base is maintained by the QA Automation team for Tricentis Insurance Application testing. Update as new patterns and issues are discovered.*