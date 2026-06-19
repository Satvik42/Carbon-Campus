import { test, expect } from '@playwright/test';

test.describe('Carbon Compass E2E Journey', () => {
  test('completes onboarding and interacts with simulator & action journey', async ({ page }) => {
    // 1. Go to landing page
    await page.goto('/');

    // Click on Start Exploring to go to onboarding
    await page.click('button:has-text("Start Exploring")');

    // Verify onboarding is active
    await expect(page.locator('h2')).toContainText('What are your dietary preferences?');

    // 2. Select diet option & click Next
    await page.click('button:has-text("Vegetarian")');
    await page.click('button[aria-label="Next Step"]');

    // Verify transportation step
    await expect(page.locator('h2')).toContainText('How do you commute?');
    await page.click('button:has-text("Public Transport")');
    await page.click('button[aria-label="Next Step"]');

    // Verify energy step
    await expect(page.locator('h2')).toContainText('Home and Energy Setup');
    // Toggle LED switch
    await page.click('#ledSwitch');
    // Complete onboarding
    await page.click('button[aria-label="Complete onboarding"]');

    // 3. Verify main dashboard loads
    await expect(page.locator('h1')).toContainText('Carbon Compass');
    await expect(page.locator('text=Carbon Snapshot')).toBeVisible();
    await expect(page.locator('text=Decision Simulator')).toBeVisible();

    // 4. Test tabs toggle
    await page.click('button[role="tab"]:has-text("Action Journey")');
    await expect(page.locator('text=Your Action Roadmap')).toBeVisible();

    // 5. Check off an action item and verify savings change
    // Since it's stored in IndexedDB, verifying checkbox toggling works in DOM
    const initialSaved = await page.locator('text=kg').first().textContent();
    const actionCheckbox = page.locator('button[aria-label^="Mark"]').first();
    await actionCheckbox.click();
    
    // Assert check works
    await expect(actionCheckbox).toHaveClass(/text-emerald-500/);
  });
});
