import { test, expect } from '@playwright/test';

test('homepage smoke', async ({ page }) => {
  const base = process.env.BASE_URL ?? 'http://localhost:3000';
  await page.goto(base);
  await expect(page).toHaveTitle(/CPI-7/i);
  await expect(page.locator('text=CPI-7')).toBeVisible();
});

