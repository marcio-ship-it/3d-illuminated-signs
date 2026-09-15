import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const response = await page.context().request.post('/api/qa/session/', {
    headers: {
      Authorization: `Bearer ${process.env.QA_CANARY_AUTH_TOKEN || 'local-playwright-qa-auth-token-3d-signs-only'}`,
      'X-QA-Run-Id': `organic-${randomUUID()}`,
    },
  });
  expect(response.status()).toBe(200);
});

for (const [route, heading, style, related] of [
  ['/acrylic-signs/', 'What to send for an acrylic sign quote', 'Printed Acrylic Panels', '/industries/retail/'],
  ['/lightbox-signs/', 'What affects a lightbox sign quote?', 'Projecting Lightboxes', '/industries/exhibitions/'],
]) {
  test(`${route} exposes buyer choices, retained content and a usable quote journey`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-qa-mode', 'true');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://3dilluminatedsigns.com.au${route}`);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: style, exact: true })).toBeVisible();
    const relatedLink=page.locator(`main a[href="${related}"]`).first();
    await relatedLink.click();
    await expect(page).toHaveURL(new RegExp(related+'$'));
    await page.getByRole('link', { name: /Discuss a project/ }).click();
    await expect(page).toHaveURL(/\/contact-us\/$/);
    await expect(page.getByLabel('Full name *')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  });
}

test('signage guide has a navigable entry and unsupported pages are not newly promoted',async({page})=>{
  await page.goto('/');
  await page.getByRole('link',{name:'Signage guides',exact:true}).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.locator('a[href="/signwriters-dont-actually-write-signs-they-create-them/"]').first()).toBeVisible();
  await expect(page.locator('footer a[href="/configurator/cut-letters/"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="/services/3d-printed-signs/"]')).toHaveCount(0);
});
