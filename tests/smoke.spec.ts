import { test, expect } from '@playwright/test';

test.describe('Phase 1: Smoke Tests & Routing', () => {
  test('Homepage loads correctly and 3D canvas is present', async ({ page }) => {
    await page.goto('/');
    
    // Verify title or main heading exists
    await expect(page.locator('text=Position your')).toBeVisible();

    // Verify the WebGL canvas for the Robot/Earth is in the DOM
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeAttached();
  });

  test('Navigation to Kids Courses works (Desktop & Mobile)', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // Test the new Mobile Dial Nav
      const dialNav = page.locator('.md\\:hidden.fixed.bottom-2');
      await expect(dialNav).toBeVisible();
      
      // Find the KIDS COURSES label and click it
      await page.locator('text=KIDS COURSES').click();
    } else {
      // Test the Desktop Nav
      await page.click('text=Courses for Kids');
    }

    // Verify we arrived at the right URL
    await expect(page).toHaveURL(/.*\/courses-for-kids.*/);
  });
});

test.describe('Phase 2: OS & Interactive Features', () => {
  test('OS launches external fallback for secure apps', async ({ page }) => {
    // Navigate to a page with the OS (Homepage has it)
    await page.goto('/');
    
    // Click the OS terminal tab to enter OS view
    await page.click('text=OS Terminal');
    
    // Wait for the app grid or dock to render and click Tinkercad
    await page.click('text=Tinkercad');
    
    // Ensure the external secure launch screen appears instead of standard iframe
    await expect(page.locator('text=Requires Secure Launch')).toBeVisible();
    await expect(page.locator('text=Launch Application')).toBeVisible();
  });
});
