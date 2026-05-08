// @jira: DEV-69 - Happy Path End-to-End - Complete Automobile Insurance Flow
// @epic: End-to-End Automation

const { test, expect } = require('@playwright/test');
const testData = require('../../test-data/dev-69-test-data.json');

test.describe('DEV-69 Happy Path End-to-End', () => {
  test.setTimeout(90000);

  test('complete full automobile flow through send quote', async ({ page }) => {
    await page.goto(testData.applicationUrl);

    // Tab 1: Vehicle Data
    //await page.getByRole('link', { name: 'Automobile' }).click();
    await page.locator('#make').selectOption(testData.vehicleData.make);
    await page.locator('#engineperformance').fill(testData.vehicleData.enginePerformance);
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill(testData.vehicleData.dateOfManufacture);
    await page.locator('#numberofseats').selectOption(testData.vehicleData.numberOfSeats);
    await page.locator('#fuel').selectOption(testData.vehicleData.fuel);
    await page.locator('#listprice').fill(testData.vehicleData.listPrice);
    await page.locator('#licenseplatenumber').fill(testData.vehicleData.licensePlateNumber);
    await page.locator('#annualmileage').fill(testData.vehicleData.annualMileage);
    await page.locator('#nextenterinsurantdata').click();

    // Tab 2: Insurant Data
    await expect(page.getByText('Enter Insurant Data')).toBeVisible({ timeout: 10000 });
    await page.locator('#firstname').fill(testData.insurantData.firstName);
    await page.locator('#lastname').fill(testData.insurantData.lastName);
    await page.locator('#birthdate').fill(testData.insurantData.dateOfBirth);

    // Use force-check on custom-styled radios/checkboxes so validation updates.
    const genderCheckbox = `#gender${testData.insurantData.gender}`;
    await page.locator(genderCheckbox).check({ force: true });
    
    // Check hobbies from test data
    for (const hobby of testData.insurantData.hobbies) {
      const hobbyId = hobby.toLowerCase();
      await page.locator(`#${hobbyId}`).check({ force: true });
    }

    await page.locator('#streetaddress').fill(testData.insurantData.streetAddress);
    await page.locator('#country').selectOption({ label: testData.insurantData.country });
    await page.locator('#zipcode').fill(testData.insurantData.zipCode);
    await page.locator('#city').fill(testData.insurantData.city);
    await page.locator('#occupation').selectOption(testData.insurantData.occupation);
    await page.locator('#nextenterproductdata').click();

    // Tab 3: Product Data
    await expect(page.getByText('Enter Product Data')).toBeVisible({ timeout: 10000 });
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + testData.productData.startDateMonthsFromNow);
    const mm = String(startDate.getMonth() + 1).padStart(2, '0');
    const dd = String(startDate.getDate()).padStart(2, '0');
    const yyyy = startDate.getFullYear();
    await page.locator('#startdate').fill(`${mm}/${dd}/${yyyy}`);

    // Option text is localized (leading space + comma), so choose by index.
    await page.locator('#insurancesum').selectOption({ index: testData.productData.insuranceSumIndex });
    await page.locator('#meritrating').selectOption({ label: testData.productData.meritRating });
    await page.locator('#damageinsurance').selectOption({ index: testData.productData.damageInsuranceIndex });
    
    if (testData.productData.euroProtection) {
      await page.locator('#EuroProtection').check({ force: true });
    }
    
    await page.locator('#courtesycar').selectOption({ index: testData.productData.courtesyCarIndex });
    await page.locator('#nextselectpriceoption').click();

    // Tab 4: Select Price Option
    await expect(page.locator('#priceTable')).toBeVisible({ timeout: 10000 });
    if (testData.priceOptionData.selectFirstRadio) {
      await page.locator('#priceTable input[type="radio"]').first().check({ force: true });
    }
    await page.locator('#nextsendquote').click();

    // Tab 5: Send Quote
    await expect(page.getByText('Send Quote')).toBeVisible({ timeout: 10000 });
    await page.locator('#email').fill(testData.sendQuoteData.email);
    await page.locator('#phone').fill(testData.sendQuoteData.phone);
    await page.locator('#username').fill(testData.sendQuoteData.username);
    await page.locator('#password').fill(testData.sendQuoteData.password);
    await page.locator('#confirmpassword').fill(testData.sendQuoteData.confirmPassword);
    await page.locator('#sendemail').click();

    await expect(page.locator('.sweet-alert')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.sweet-alert')).toContainText(/success/i);
  });
});
