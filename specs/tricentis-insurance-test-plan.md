# Tricentis Automobile Insurance Application - Test Plan

## Application Overview

This test plan covers comprehensive testing of the Tricentis Automobile Insurance Application workflow. This plan focuses **exclusively on the Automobile insurance path only** - no testing scenarios are included for Truck, Motorcycle, or Camper vehicle types.

The application follows a 6-step process:
1. **Home page navigation** to Automobile Insurance selection  
2. **Enter Vehicle Data** - Automobile-specific form fields
3. **Enter Insurant Data** - Personal information
4. **Enter Product Data** - Coverage and policy details 
5. **Select Price Option** - Choose from available pricing tiers
6. **Send Quote** - Final quote submission

All scenarios focus specifically on the Automobile insurance path with conditional tab accessibility.

## Test Scenarios

### 1. Tab 1 - Enter Vehicle Data - Happy Path Scenarios

**Seed:** `tests/seed.spec.js`

#### 1.1. Complete Automobile Vehicle Data Form with Valid Information

**File:** `tests/vehicle-data/complete-automobile-data.spec.js`

**Steps:**
  1. Select an automobile make from dropdown (e.g., 'Toyota')
    - expect: Make dropdown shows selected value
  2. Fill Engine Performance field with valid value (e.g., '120')
    - expect: Value is accepted and displayed correctly
  3. Enter a valid Date of Manufacture (e.g., '01/15/2020')
    - expect: Date is formatted correctly
    - expect: Date picker accepts the input
  4. Select Number of Seats (e.g., '5')
    - expect: Selection is saved correctly
  5. Select Fuel Type (e.g., 'Petrol')
    - expect: Selection is saved correctly
  6. Fill all remaining required fields with valid data
    - expect: All fields accept valid input
    - expect: No validation errors appear
  7. Click 'Next >' button
    - expect: Form validation passes
    - expect: Navigation proceeds to 'Enter Insurant Data' tab
    - expect: Vehicle data is preserved

#### 1.2. Test Automobile Make and Model Dropdown Options

**File:** `tests/vehicle-data/automobile-make-model-options.spec.js`

**Steps:**
  1. Click on Make dropdown
    - expect: Dropdown opens showing all available automobile makes
    - expect: Options include: Audi, BMW, Ford, Honda, Mazda, Mercedes Benz, Nissan, Opel, Porsche, Renault, Skoda, Suzuki, Toyota, Volkswagen, Volvo
  2. Select different automobile makes and verify model dropdown behavior
    - expect: Model dropdown becomes enabled after make selection
    - expect: Model options change based on selected make
    - expect: Each make/model combination is properly saved
    - expect: No JavaScript errors occur

#### 1.3. Test Date Picker Functionality

**File:** `tests/vehicle-data/date-picker-validation.spec.js`

**Steps:**
  1. Click on Date of Manufacture field
    - expect: Field focuses and shows MM/DD/YYYY placeholder
  2. Click the calendar icon
    - expect: Date picker widget opens
    - expect: Current month/year is displayed
  3. Navigate through different months and years
    - expect: Date picker responds to navigation
    - expect: Dates are selectable

### 2. Tab 1 - Enter Vehicle Data - Validation and Error Scenarios

**Seed:** `tests/seed.spec.js`

#### 3.1. Automobile Required Field Validation

**File:** `tests/vehicle-data/automobile-required-validation.spec.js`

**Steps:**
  1. Click 'Next >' button without filling any fields
    - expect: Validation errors appear for required fields
    - expect: User remains on current tab
    - expect: Error messages are clear and descriptive
  2. Fill only some required fields and click 'Next >'
    - expect: Validation errors appear only for remaining empty required fields

#### 3.2. Invalid Date Input Validation

**File:** `tests/vehicle-data/invalid-date-validation.spec.js`

**Steps:**
  1. Enter invalid date format in Date of Manufacture (e.g., '13/45/2020')
    - expect: Appropriate validation error message appears
    - expect: Field indicates invalid input
  2. Enter future date beyond reasonable limits
    - expect: Validation prevents unreasonable future dates
    - expect: Appropriate error message is shown

#### 3.3. Automobile Numeric Field Validation

**File:** `tests/vehicle-data/automobile-numeric-validation.spec.js`

**Steps:**
  1. Enter non-numeric characters in Engine Performance field
    - expect: Field rejects non-numeric input or shows validation error
  2. Test Cylinder Capacity field validation (automobile-specific)
    - expect: Accepts valid numeric values for automobile engines
    - expect: Rejects negative values
  3. Enter extremely large values in numeric fields
    - expect: Fields handle large numbers appropriately or show validation errors

### 3. Tab 2 - Enter Insurant Data - Happy Path Scenarios

**Seed:** `tests/seed.spec.js`

#### 4.1. Complete Personal Information Form

**File:** `tests/insurant-data/complete-personal-info.spec.js`

**Steps:**
  1. Navigate to Enter Insurant Data tab
    - expect: Tab loads successfully
    - expect: All personal information fields are visible
  2. Enter valid First Name (e.g., 'John')
    - expect: Value is accepted and displayed
  3. Enter valid Last Name (e.g., 'Doe')
    - expect: Value is accepted and displayed
  4. Enter valid Date of Birth
    - expect: Date picker works correctly
    - expect: Age-appropriate validation if applicable
  5. Select Gender (Male/Female)
    - expect: Radio button selection works correctly
  6. Fill address fields: Street Address, Country, Zip Code, City
    - expect: All address fields accept input correctly
    - expect: Country dropdown contains comprehensive list of countries
  7. Select Occupation from dropdown
    - expect: Occupation options include: Employee, Public Official, Farmer, Unemployed, Selfemployed
  8. Select multiple hobbies using checkboxes
    - expect: Multiple hobby checkboxes can be selected
    - expect: Options include: Speeding, Bungee Jumping, Cliff Diving, Skydiving, Other
  9. Click 'Next >' to proceed
    - expect: Form validation passes
    - expect: Navigation proceeds to Enter Product Data tab

#### 4.2. Test Country Dropdown Functionality

**File:** `tests/insurant-data/country-dropdown-test.spec.js`

**Steps:**
  1. Click on Country dropdown
    - expect: Dropdown opens with comprehensive list of countries
    - expect: Countries are listed alphabetically
    - expect: Includes major countries like United States, United Kingdom, Germany, etc.
  2. Select different countries and verify selection persistence
    - expect: Selected country is properly saved and displayed

#### 4.3. Test File Upload Functionality

**File:** `tests/insurant-data/picture-upload-test.spec.js`

**Steps:**
  1. Click on 'Choose File' button for Picture upload
    - expect: File choice dialog opens
    - expect: User can browse for files
  2. Select a valid image file
    - expect: File name appears in the input field
    - expect: Upload is accepted
  3. Attempt to upload non-image file types
    - expect: Appropriate validation for file type restrictions if implemented

### 4. Tab 2 - Enter Insurant Data - Validation Scenarios

**Seed:** `tests/seed.spec.js`

#### 5.1. Personal Information Field Validation

**File:** `tests/insurant-data/personal-info-validation.spec.js`

**Steps:**
  1. Leave required fields empty and click 'Next >'
    - expect: Validation errors appear for empty required fields
    - expect: User cannot proceed to next step
  2. Enter special characters and numbers in name fields
    - expect: Appropriate validation for name format requirements
  3. Enter invalid email format in Website field if applicable
    - expect: Email validation works correctly

#### 5.2. Address Validation Testing

**File:** `tests/insurant-data/address-validation.spec.js`

**Steps:**
  1. Enter various postal code formats based on selected country
    - expect: Postal code validation matches country-specific requirements if implemented
  2. Test maximum length limits for address fields
    - expect: Fields handle long addresses appropriately

### 5. Tab 3 - Enter Product Data - Happy Path Scenarios

**Seed:** `tests/seed.spec.js`

#### 6.1. Complete Insurance Product Configuration

**File:** `tests/product-data/complete-product-config.spec.js`

**Steps:**
  1. Navigate to Enter Product Data tab
    - expect: Tab loads successfully
    - expect: All insurance configuration fields are visible
  2. Enter valid Start Date for insurance coverage
    - expect: Date picker accepts future dates
    - expect: Date formatting is correct
  3. Select Insurance Sum from dropdown (e.g., '5.000.000,00')
    - expect: Various insurance amounts are available
    - expect: Options range from 3,000,000 to 35,000,000
  4. Select Merit Rating (e.g., 'Bonus 5')
    - expect: Merit rating options include Super Bonus, Bonus 1-9, Malus 10-17
  5. Select Damage Insurance coverage (e.g., 'Full Coverage')
    - expect: Options include: No Coverage, Partial Coverage, Full Coverage
  6. Select optional products using checkboxes
    - expect: Euro Protection and Legal Defense Insurance options are available
    - expect: Multiple selections can be made
  7. Select Courtesy Car option (Yes/No)
    - expect: Selection is properly saved
  8. Click 'Next >' to proceed
    - expect: Form validation passes
    - expect: Navigation proceeds to Select Price Option tab

#### 6.2. Test Insurance Sum Options

**File:** `tests/product-data/insurance-sum-options.spec.js`

**Steps:**
  1. Click on Insurance Sum dropdown
    - expect: All insurance amount options are displayed correctly
    - expect: Amounts are formatted with proper currency notation
  2. Select different insurance amounts and verify impact on form
    - expect: Selection affects subsequent form behavior if applicable

### 6. Tab 3 - Enter Product Data - Validation Scenarios

**Seed:** `tests/seed.spec.js`

#### 7.1. Start Date Validation Testing

**File:** `tests/product-data/start-date-validation.spec.js`

**Steps:**
  1. Enter past dates in Start Date field
    - expect: Validation prevents insurance start dates in the past
    - expect: Appropriate error messages are shown
  2. Enter invalid date formats
    - expect: Date format validation works correctly

#### 7.2. Required Product Field Validation

**File:** `tests/product-data/required-product-validation.spec.js`

**Steps:**
  1. Leave required fields empty and attempt to proceed
    - expect: Validation prevents proceeding with missing required information
    - expect: Clear error messages guide user to complete required fields

### 7. Tab 4 - Select Price Option - Conditional Access and Functionality

**Seed:** `tests/seed.spec.js`

#### 8.1. Price Option Access Without Prerequisites

**File:** `tests/price-option/access-without-prerequisites.spec.js`

**Steps:**
  1. Navigate directly to Select Price Option tab without completing previous steps
    - expect: Message displays: 'Please, complete the first three steps to see the price table.'
    - expect: No price options are shown
    - expect: Tab is accessible but non-functional

#### 8.2. Price Option Access After Completing Prerequisites

**File:** `tests/price-option/access-with-prerequisites.spec.js`

**Steps:**
  1. Complete all fields in Enter Vehicle Data tab and proceed
    - expect: Vehicle data is successfully saved
  2. Complete all fields in Enter Insurant Data tab and proceed
    - expect: Insurant data is successfully saved
  3. Complete all fields in Enter Product Data tab and proceed
    - expect: Product data is successfully saved
  4. Navigate to Select Price Option tab
    - expect: Price table is visible
    - expect: Multiple insurance pricing options are displayed
    - expect: Options can be selected
    - expect: Price calculations are shown based on entered data
  5. Select a price option and proceed
    - expect: Selected option is highlighted/confirmed
    - expect: Ability to proceed to final tab becomes available

### 8. Tab 5 - Send Quote - Final Step and Quote Generation

**Seed:** `tests/seed.spec.js`

#### 9.1. Send Quote Access Without Price Selection

**File:** `tests/send-quote/access-without-price-selection.spec.js`

**Steps:**
  1. Navigate to Send Quote tab without selecting a price option
    - expect: Message displays: 'Please, select a price option to send the quote.'
    - expect: Quote sending functionality is disabled
    - expect: Tab is accessible but non-functional

#### 9.2. Complete Quote Generation Flow

**File:** `tests/send-quote/complete-quote-generation.spec.js`

**Steps:**
  1. Complete entire application flow through price selection
    - expect: All previous steps are completed successfully
  2. Navigate to Send Quote tab
    - expect: Quote form is accessible
    - expect: Quote details/summary are displayed
    - expect: Send quote functionality is available
  3. Complete quote sending process
    - expect: Quote is successfully generated and sent
    - expect: Confirmation message or success page is displayed
    - expect: User receives appropriate feedback about quote submission

### 9. Cross-Browser and Navigation Testing

**Seed:** `tests/seed.spec.js`

#### 10.1. Tab Navigation Using Direct Clicks

**File:** `tests/navigation/direct-tab-navigation.spec.js`

**Steps:**
  1. Click on different tabs in random order
    - expect: Each tab loads correctly when clicked
    - expect: Tab state is maintained
    - expect: Active tab is visually indicated
  2. Navigate backward and forward through tabs
    - expect: Previous/Next button navigation works correctly
    - expect: Data entered in previous tabs is preserved

#### 10.2. Browser Back/Forward Button Testing

**File:** `tests/navigation/browser-navigation.spec.js`

**Steps:**
  1. Navigate through tabs and use browser back button
    - expect: Browser navigation works correctly with application tabs
    - expect: Form data is preserved during browser navigation
    - expect: No JavaScript errors occur

#### 10.3. Page Refresh and Data Persistence

**File:** `tests/navigation/data-persistence.spec.js`

**Steps:**
  1. Fill form data and refresh the page
    - expect: Application handles page refresh gracefully
    - expect: Data persistence behavior is consistent with expectations
    - expect: User is guided appropriately after refresh
