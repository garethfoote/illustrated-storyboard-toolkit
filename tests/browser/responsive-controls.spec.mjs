import { test, expect } from '@playwright/test';

test('panel visibility stays stable through selection changes and responsive layout', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#open-controls');
  const panel = page.locator('#controls-panel');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const initialCanvas = await page.locator('.stage-panel').boundingBox();
  const handle = await toggle.boundingBox();
  expect(handle.x).toBeGreaterThan(initialCanvas.x + initialCanvas.width);
  await page.screenshot({ path: '/tmp/storyboard-rail-open.png' });
  await toggle.click();
  await expect(panel).toBeHidden();
  const expandedCanvas = await page.locator('.stage-panel').boundingBox();
  expect(expandedCanvas.width).toBeGreaterThan(initialCanvas.width);
  await page.screenshot({ path: '/tmp/storyboard-rail-collapsed.png' });
  await page.locator('#add-menu-button').click();
  await page.getByRole('menuitem', { name: 'Speech bubble', exact: true }).click();
  await expect(panel).toBeHidden();
  await toggle.click();
  await expect(panel).toBeVisible();
  await toggle.click();
  await expect(panel).toBeHidden();
  await toggle.click();
  await page.setViewportSize({ width: 800, height: 900 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(panel).toBeVisible();
  await page.locator('#open-controls').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('canvas history stays available without a selection', async ({ page }) => {
  await page.goto('/');
  await page.locator('#add-menu-button').click();
  await page.getByRole('menuitem', { name: 'Speech bubble', exact: true }).click();
  const history = page.getByRole('group', { name: 'Edit history', exact: true });
  const selectedHistory = await history.boundingBox();
  const selectionActions = await page.locator('#selected-object-actions').boundingBox();
  expect(selectionActions.x + selectionActions.width).toBeLessThan(selectedHistory.x);
  await page.locator('#character-canvas').click({ position: { x: 10, y: 10 } });
  const deselectedHistory = await history.boundingBox();
  expect(deselectedHistory.x).toBeCloseTo(selectedHistory.x, 1);
  expect(deselectedHistory.y).toBeCloseTo(selectedHistory.y, 1);
  await expect(page.locator('#selected-object-actions')).toBeHidden();
  await expect(page.locator('#undo-action')).toBeVisible();
  await expect(page.locator('#undo-action')).toBeEnabled();
  await page.locator('#undo-action').click();
  await expect(page.locator('#character-canvas > .scene-object')).toHaveCount(1);
  await expect(page.locator('#redo-action')).toBeVisible();
  await page.locator('#redo-action').click();
  await expect(page.locator('#character-canvas > .scene-object')).toHaveCount(2);
});

test('compact tab stays still, shares every editor header and docks at the browser edge', async ({ page }) => {
  await page.goto('/');
  const tab = page.locator('#open-controls');
  const header = page.locator('.object-editor-heading');
  const initial = await tab.boundingBox();
  expect(initial.width).toBeLessThanOrEqual(34);
  expect(initial.height).toBeLessThanOrEqual(32);
  await tab.hover();
  await page.waitForTimeout(200);
  expect(await tab.boundingBox()).toEqual(initial);
  await page.locator('#add-menu-button').click();
  await page.getByRole('menuitem', { name: 'Speech bubble', exact: true }).click();
  await expect(header).toBeVisible();
  await expect(header).toContainText('Speech bubble');
  await page.locator('#character-canvas').click({ position: { x: 10, y: 10 } });
  await expect(header).toContainText('Object options');
  await expect(page.locator('#empty-object-editor')).toBeVisible();
  await tab.click();
  const docked = await tab.boundingBox();
  expect(docked.x + docked.width).toBe(page.viewportSize().width);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await tab.boundingBox();
  expect(mobile.x + mobile.width).toBe(390);
});

test('thumbnail overflow stays inside the toolbar at desktop and mobile widths', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 9; i++) {
    await page.locator('#add-menu-button').click();
    await page.getByRole('menuitem', { name: 'Object', exact: true }).click();
  }
  for (const width of [1440, 1100, 800, 640, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => {
      const strip = document.querySelector('#object-tabs');
      const dock = document.querySelector('#canvas-add-menu').getBoundingClientRect();
      const actions = document.querySelector('.selected-object-actions').getBoundingClientRect();
      const tile = strip.querySelector('[aria-pressed="true"]').getBoundingClientRect();
      const bounds = strip.getBoundingClientRect();
      return {
        overlap: dock.left < actions.right && dock.right > actions.left && dock.top < actions.bottom && dock.bottom > actions.top,
        selectedVisible: tile.left >= bounds.left - 1 && tile.right <= bounds.right + 1,
        pageFits: document.documentElement.scrollWidth <= innerWidth,
        controlsFit: actions.right <= innerWidth,
      };
    })).toEqual({ overlap: false, selectedVisible: true, pageFits: true, controlsFit: true });
  }
  await page.screenshot({ path: '/tmp/storyboard-toolbar-mobile.png' });
});

test('canvas zoom changes artwork without resizing controls or consuming browser zoom gestures', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('#add-menu-button');
  const before = await button.boundingBox();
  const zoom = await page.locator('#zoom-value').textContent();
  const transform = await page.locator('#character-canvas').evaluate(el => el.style.transform);
  await page.locator('#zoom-in').click();
  await expect(page.locator('#zoom-value')).not.toHaveText(zoom);
  expect(await button.boundingBox()).toEqual(before);
  expect(await page.locator('#character-canvas').evaluate(el => el.style.transform)).not.toBe(transform);
  expect(await page.locator('.canvas-shell').evaluate(el => el.dispatchEvent(new WheelEvent('wheel', { ctrlKey: true, deltaY: -100, bubbles: true, cancelable: true })))).toBe(true);
  await page.setViewportSize({ width: 720, height: 500 });
  await expect(page.locator('#open-controls')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('#fit-view').click();
  const frame = await page.locator('.export-frame').boundingBox();
  const toolbar = await page.locator('.canvas-toolbar').boundingBox();
  expect(frame.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height);
});
