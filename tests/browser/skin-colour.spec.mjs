import { test, expect } from '@playwright/test';

for (const label of ['Doctor Nurse 2 1', 'Doctor Nurse 2', 'Doctor Nurse 3']) {
  test(`${label} keeps headwear and mask white when skin changes`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#skin-palette-options button').first()).toBeVisible();
    await page.locator('#part-select').selectOption('hair', { force: true });
    await page.locator('#option-select').selectOption({ label }, { force: true });
    const face = page.locator('#character-canvas [data-part="face"]');
    await expect(face.locator('mask path')).toHaveAttribute('fill', 'black');
    await expect(face.locator('g[mask]')).toHaveCount(1);
    const geometry = await page.evaluate(() => {
      const head = document.querySelector('#character-canvas [id^="head/doctor-nurse"]');
      const cutout = document.querySelector('#character-canvas [data-part="face"] mask path');
      return [head.querySelector('[id$="Face Mask"]').getAttribute('d'), cutout.getAttribute('d')];
    });
    expect(geometry[0]).toBe(geometry[1]);
    for (const colour of ['Porcelain', 'Deep']) {
      await page.getByRole('button', { name: colour, exact: true }).click();
      const result = await page.evaluate(() => {
        const head = document.querySelector('#character-canvas [id^="head/doctor-nurse"]');
        const saved = JSON.parse(localStorage.getItem('illustrated-storyboard-toolkit-scene-v2'));
        return {
          skin: head.querySelector('[id$="Skin"]').getAttribute('fill'),
          expected: saved.objects[0].skinColour,
          hat: head.querySelector('[id="Headwear"]').getAttribute('fill'),
          mask: head.querySelector('[id$="Face Mask"]').getAttribute('fill'),
          ink: head.querySelector('[id$="Ink"]').getAttribute('fill'),
        };
      });
      expect(result.skin.toLowerCase()).toBe(result.expected.toLowerCase());
      expect(result.hat).toBe('white');
      expect(result.mask).toBe('white');
      expect(result.ink).toBe('black');
    }
  });
}

test('Cornrows 2 face follows selected skin colours and preserves ink', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#skin-palette-options button').first()).toBeVisible();
  await page.locator('#part-select').selectOption('hair', { force: true });
  await page.locator('#option-select').selectOption({ label: 'Cornrows 2' }, { force: true });
  for (const colour of ['Porcelain', 'Deep']) {
    await page.getByRole('button', { name: colour, exact: true }).click();
    const result = await page.evaluate(() => {
      const doc = document.querySelector('#character-canvas [id="head/Cornrows 2"]');
      const saved = JSON.parse(localStorage.getItem('illustrated-storyboard-toolkit-scene-v2'));
      return {
        fill: doc.querySelector('[id="Skin"]').getAttribute('fill'),
        expected: saved.objects[0].skinColour,
        ink: doc.querySelector('[id$="Ink"]').getAttribute('fill'),
      };
    });
    expect(result.fill.toLowerCase()).toBe(result.expected.toLowerCase());
    expect(result.ink).toBe('black');
  }
});
