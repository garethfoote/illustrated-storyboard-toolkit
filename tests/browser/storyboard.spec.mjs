import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const storageKey = 'illustrated-storyboard-toolkit-scene-v2';
const state = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
const objects = page => page.locator('#character-canvas > .scene-object');

async function add(page, label) {
  await page.getByRole('button', { name: 'Add object', exact: true }).click();
  await page.getByRole('menuitem', { name: label, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.addInitScript(() => { Math.random = () => 0.42; });
  await page.goto('/');
  await expect(objects(page)).toHaveCount(1);
  await expect(page.locator('#option-filmstrip [role="option"]').first()).toBeVisible();
  expect(errors).toEqual([]);
  // Check errors throughout the test, including export and reload.
  page.__storyboardErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(page.__storyboardErrors).toEqual([]);
});

test('character edits stay independent and survive reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Porcelain', exact: true }).click();
  await page.getByRole('button', { name: 'Next option', exact: true }).click();
  const first = (await state(page)).objects[0];
  await add(page, 'Character');
  await page.getByRole('button', { name: 'Deep', exact: true }).click();
  await page.getByRole('button', { name: `Select ${first.name}`, exact: true }).click();
  await expect(page.getByRole('button', { name: 'Porcelain', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect((await state(page)).objects[0]).toEqual(first);
  await page.locator('#edit-character-name').click();
  await page.getByRole('textbox', { name: 'Character name' }).fill('Alex');
  await page.getByRole('textbox', { name: 'Character name' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Select Alex', exact: true })).toBeVisible();
  const saved = await state(page);
  await page.reload();
  await expect(objects(page)).toHaveCount(2);
  expect((await state(page)).objects).toEqual(saved.objects);
});

test('all scene types can be added, reordered, flipped, deleted and undone', async ({ page }) => {
  for (const label of ['Speech bubble', 'Object', 'Close-up', 'Table', 'Chair']) await add(page, label);
  await expect(objects(page)).toHaveCount(6);
  const original = (await state(page)).objects;
  await page.getByRole('button', { name: 'Flip selected object', exact: true }).click();
  expect((await state(page)).objects.at(-1).flipped).toBe(!original.at(-1).flipped);
  await page.locator('#layer-down').click();
  expect((await state(page)).objects.at(-2).id).toBe(original.at(-1).id);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#delete-selected').click();
  await expect(objects(page)).toHaveCount(5);
  await page.getByRole('button', { name: 'Undo last edit', exact: true }).click();
  await expect(objects(page)).toHaveCount(6);
  expect((await state(page)).objects.at(-2).id).toBe(original.at(-1).id);
});

test('keyboard movement and pointer resizing persist scene geometry', async ({ page }) => {
  const before = (await state(page)).objects[0];
  await page.getByRole('button', { name: `Select ${before.name}`, exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  expect((await state(page)).objects[0].x).toBe(before.x + 5);
  const hitArea = page.locator('.character-hit-area');
  const hitBox = await hitArea.boundingBox();
  await page.mouse.move(hitBox.x + hitBox.width / 2, hitBox.y + hitBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(hitBox.x + hitBox.width / 2 + 20, hitBox.y + hitBox.height / 2 + 15, { steps: 8 });
  await page.mouse.up();
  expect((await state(page)).objects[0].x).toBeGreaterThan(before.x + 5);
  expect((await state(page)).objects[0].y).toBeGreaterThan(before.y);
  await page.locator('#resize-selected').click();
  const handle = page.locator('.resize-handle-se');
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 40, { steps: 8 });
  await page.mouse.up();
  expect((await state(page)).objects[0].scale).toBeGreaterThan(before.scale);
});

test('resize markers follow characters and objects before a drag is released', async ({ page }) => {
  for (const kind of ['Character', 'Object']) {
    if (kind === 'Object') await add(page, kind);
    await page.locator('#resize-selected').click();
    const selected = (await state(page)).selectedObjectId;
    const object = page.locator(`#character-canvas > .scene-object[data-object-id="${selected}"]`);
    const target = kind === 'Character' ? object.locator('.character-hit-area') : object;
    const markers = page.locator('.resize-box');
    const before = await markers.boundingBox();
    const bounds = await target.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width / 2 + 35, bounds.y + bounds.height / 2 + 25, { steps: 5 });
    const during = await markers.boundingBox();
    expect(during.x - before.x).toBeCloseTo(35, 0);
    expect(during.y - before.y).toBeCloseTo(25, 0);
    expect(during.width).toBeCloseTo(before.width, 0);
    expect(during.height).toBeCloseTo(before.height, 0);
    await page.mouse.up();
    const after = await markers.boundingBox();
    expect(after.x).toBeCloseTo(during.x, 0);
    expect(after.y).toBeCloseTo(during.y, 0);
    await page.locator('#resize-selected').click();
  }
});

test('exports contain SVG artwork and a 2048 by 1536 PNG', async ({ page }) => {
  for (const format of ['SVG', 'PNG']) {
    await page.getByRole('button', { name: 'Export', exact: true }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: format, exact: true }).click();
    const download = await downloadPromise;
    expect(await download.failure()).toBeNull();
    const bytes = await readFile(await download.path());
    if (format === 'SVG') {
      expect(bytes.toString()).toContain('viewBox="0 0 2048 1536"');
      expect(bytes.toString()).toContain('<path');
    } else {
      expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(bytes.readUInt32BE(16)).toBe(2048);
      expect(bytes.readUInt32BE(20)).toBe(1536);
    }
  }
});

test('narrow screen opens and closes the character editor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open character options', exact: true }).click();
  await expect(page.locator('#controls-panel')).toHaveClass(/is-open/);
  await page.locator('#close-controls').click();
  await expect(page.locator('#controls-panel')).not.toHaveClass(/is-open/);
});

test('reset can be undone and the scene has a ten-object limit', async ({ page }) => {
  for (let index = 0; index < 9; index++) await add(page, 'Object');
  await expect(objects(page)).toHaveCount(10);
  await expect(page.locator('#add-menu-button')).toBeDisabled();
  const before = (await state(page)).objects;
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Reset storyboard', exact: true }).click();
  await expect(objects(page)).toHaveCount(1);
  await page.getByRole('button', { name: 'Undo last edit', exact: true }).click();
  await expect(objects(page)).toHaveCount(10);
  expect((await state(page)).objects).toEqual(before);
});

test('reset dialog cancels safely and keeps keyboard focus inside', async ({ page }) => {
  await add(page, 'Object');
  const before = (await state(page)).objects;
  const reset = page.locator('#reset-project');
  const dialog = page.getByRole('dialog', { name: 'Reset this storyboard?' });
  await reset.click();
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Reset storyboard', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(reset).toBeFocused();
  expect((await state(page)).objects).toEqual(before);
  await reset.click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect((await state(page)).objects).toEqual(before);
  await page.setViewportSize({ width: 390, height: 844 });
  await reset.click();
  await expect(dialog).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Reset storyboard', exact: true })).toBeInViewport();
});

test('undo and redo restore edits and a new edit clears redo', async ({ page }) => {
  const initial = (await state(page)).objects;
  await add(page, 'Object');
  const edited = (await state(page)).objects;
  await page.locator('#undo-action').click();
  expect((await state(page)).objects).toEqual(initial);
  await page.locator('#redo-action').click();
  expect((await state(page)).objects).toEqual(edited);
  await page.keyboard.press('Control+z');
  expect((await state(page)).objects).toEqual(initial);
  await page.keyboard.press('Control+Shift+z');
  expect((await state(page)).objects).toEqual(edited);
  await page.locator('#undo-action').click();
  await page.locator('#flip-selected').click();
  await expect(page.locator('#redo-action')).toBeDisabled();
});

test('shuffle changes only the selected character, preserves its palette and supports undo and redo', async ({ page }) => {
  await add(page, 'Character');
  const before = (await state(page)).objects;
  await page.evaluate(() => { Math.random = () => 0.73; });
  await page.getByRole('button', { name: 'Shuffle selected character', exact: true }).click();
  const shuffled = (await state(page)).objects;
  expect(shuffled[0]).toEqual(before[0]);
  expect(shuffled[1].selections).not.toEqual(before[1].selections);
  for (const key of ['id', 'name', 'x', 'y', 'scale', 'flipped', 'activeClothingPaletteId']) {
    expect(shuffled[1][key]).toEqual(before[1][key]);
  }
  await page.locator('#undo-action').click();
  expect((await state(page)).objects).toEqual(before);
  await page.locator('#redo-action').click();
  expect((await state(page)).objects).toEqual(shuffled);
  await add(page, 'Object');
  await expect(page.locator('#shuffle-character')).toBeHidden();
});

test('initial desktop appearance matches the baseline', async ({ page }) => {
  await expect(page).toHaveScreenshot('initial-desktop.png', { animations: 'disabled' });
});
