import { test, expect } from '@playwright/test';

test('Escape closes dialogs and export menu without collapsing the editor', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('#controls-panel');
  const exportButton = page.locator('#export-menu-button');
  await expect(panel).toHaveClass(/is-open/);

  await exportButton.click();
  await expect(page.locator('#licence-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#licence-dialog')).not.toBeVisible();
  await expect(panel).toHaveClass(/is-open/);
  await expect(exportButton).toBeFocused();

  await exportButton.click();
  await page.locator('#licence-remember').check();
  await page.locator('#licence-continue').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#export-menu-list')).toBeHidden();
  await expect(panel).toHaveClass(/is-open/);

  // A mouse-opened menu leaves focus on its trigger rather than a menu item.
  await exportButton.click();
  await expect(exportButton).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#export-menu-list')).toBeHidden();
  await expect(panel).toHaveClass(/is-open/);

  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#reset-dialog')).not.toBeVisible();
  await expect(panel).toHaveClass(/is-open/);
});

test('licence repeats until checked and can be forgotten again', async ({ page }) => {
  await page.goto('/');
  const menu = page.locator('#export-menu-button');
  const dialog = page.locator('#licence-dialog');
  const remember = page.locator('#licence-remember');
  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(remember).not.toBeChecked();
  await page.locator('#licence-continue').click();
  await expect(page.locator('#export-menu-list')).toBeVisible();
  await menu.click();
  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(remember).not.toBeChecked();
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await menu.click();
  await expect(dialog).toBeVisible();
  await remember.check();
  await page.locator('#licence-continue').click();
  await page.reload();
  await menu.click();
  await expect(dialog).not.toBeVisible();
  await page.locator('#licence-menu-button').click();
  await expect(remember).toBeChecked();
  await remember.uncheck();
  await page.keyboard.press('Escape');
  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(remember).not.toBeChecked();
  await page.locator('#licence-continue').click();
  await page.locator('#licence-menu-button').click();
  await expect(remember).not.toBeChecked();
  await page.reload();
  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(remember).not.toBeChecked();
});
