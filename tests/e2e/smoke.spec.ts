import { test, expect } from '@playwright/test';

test('homepage smoke', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/CPI-7/i);
  await expect(page.locator('text=CPI-7')).toBeVisible();
});

