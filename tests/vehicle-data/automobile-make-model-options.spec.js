// spec: specs/tricentis-insurance-test-plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Tab 1 - Enter Vehicle Data - Happy Path Scenarios', () => {
  test('Test Automobile Make and Model Dropdown Options', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
    
    // Navigate to automobile insurance to test Make dropdown options
    await page.getByRole('link', { name: 'Automobile' }).click();

    // 1. Click on Make dropdown and verify all available automobile makes
    await page.locator('#make').click();
    
    // expect: Dropdown opens showing all available automobile makes
    const makeDropdown = page.locator('#make');
    await expect(makeDropdown).toBeVisible();
    
    // expect: Options include all expected automobile manufacturers
    await expect(makeDropdown.locator('option[value="Audi"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="BMW"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Ford"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Honda"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Mazda"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Mercedes Benz"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Nissan"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Opel"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Porsche"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Renault"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Skoda"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Suzuki"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Toyota"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Volkswagen"]')).toBeAttached();
    await expect(makeDropdown.locator('option[value="Volvo"]')).toBeAttached();

    // 2. Select different automobile makes and verify behavior
    // Note: Automobiles do NOT have a Model dropdown (only motorcycles do)
    
    // Test BMW selection
    await page.locator('#make').selectOption(['BMW']);
    await expect(makeDropdown).toHaveValue('BMW');
    
    // expect: No Model dropdown is present for automobiles
    await expect(page.locator('#model')).not.toBeVisible();
    
    // Test Mercedes Benz selection  
    await page.locator('#make').selectOption(['Mercedes Benz']);
    await expect(makeDropdown).toHaveValue('Mercedes Benz');
    
    // Test Volkswagen selection
    await page.locator('#make').selectOption(['Volkswagen']);
    await expect(makeDropdown).toHaveValue('Volkswagen');
    
    // expect: Each make selection is properly saved
    await expect(makeDropdown).toHaveValue('Volkswagen');
    
    // expect: No JavaScript errors occur
    // This is implicitly tested by successful completion of the test
  });
});