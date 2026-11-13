import { test, expect } from '@playwright/test';

for (const width of [2226, 1440, 720, 390]) {
  test(`fit and zoom keep artwork centered at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    // Reproduce an oversized toolbar wrapper without changing the controls.
    await page.locator('.canvas-toolbar').evaluate(el => el.style.height = '85%');
    await page.locator('#fit-view').click();
    const frame = page.locator('.export-frame');
    const before = await frame.boundingBox();
    const shell = await page.locator('.canvas-shell').boundingBox();
    const dock = await page.locator('.canvas-zoom-dock').boundingBox();
    expect(before.height).toBeGreaterThan(Math.min(shell.height * 0.4, shell.width * 0.4));
    expect(before.y).toBeGreaterThan(shell.y);
    expect(before.y + before.height).toBeLessThanOrEqual(dock.y);
    await page.locator('#zoom-in').click();
    const after = await frame.boundingBox();
    expect(after.width).toBeGreaterThan(before.width);
    expect(Math.abs((before.x + before.width / 2) - (after.x + after.width / 2))).toBeLessThan(1);
    expect(Math.abs((before.y + before.height / 2) - (after.y + after.height / 2))).toBeLessThan(1);
  });
}
