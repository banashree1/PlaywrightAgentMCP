const { test, expect } = require('@playwright/test');

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('https://sampleapp.tricentis.com/101/app.php');
  });
});
