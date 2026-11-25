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

  for (const route of ['/3d-lettering/', '/3d-signs/', '/acrylic-signs/', '/services/metal-signs/']) {
    await page.goto(route);
    await expect(page.locator('main a[href="/configurator/cut-letters/"]')).toHaveCount(0);
    await expect(page.locator('main a[href="/services/3d-printed-signs/"]')).toHaveCount(0);
  }
});

test('cut-letter calculator is mobile-safe and retains a configured quote handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/configurator/cut-letters/');

  await expect(page).toHaveTitle('Cut-Out Letters Price Calculator | 3D Illuminated Signs');
  await expect(page.getByRole('heading', { level: 1, name: 'Cut-Out Letters — Instant Price Calculator' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://3dilluminatedsigns.com.au/configurator/cut-letters/',
  );
  await expect(page.locator('a[href="https://3dilluminatedsigns.com.au/"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByLabel('Your Text').fill('LOBBY');
  await page.getByRole('button', { name: 'Solid Aluminium', exact: true }).click();
  await page.getByRole('button', { name: '3mm', exact: true }).click();
  await page.getByRole('slider', { name: /Letter Height/ }).press('End');
  await page.getByRole('button', { name: 'Stud Mounting Pins', exact: false }).click();
  await page.getByRole('button', { name: '+', exact: true }).click();
  await page.getByRole('button', { name: 'Request Quote', exact: true }).click();

  await expect(page).toHaveURL(/\/contact-us\/\?service=Cut-Out\+Letters&message=/);
  await expect(page.getByLabel('Signage type')).toHaveValue('Cut-Out Letters');
  const projectDetails = page.getByLabel('Project details *');
  await expect(projectDetails).toHaveValue(/Text: "LOBBY"/);
  await expect(projectDetails).toHaveValue(/Material: Solid Aluminium 3mm/);
  await expect(projectDetails).toHaveValue(/Height: 600mm/);
  await expect(projectDetails).toHaveValue(/Mounting: Stud Mounting Pins/);
  await expect(projectDetails).toHaveValue(/Qty: 2/);

  await projectDetails.fill('Keep this buyer-edited project detail.');
  await page.getByLabel('Company').fill('Buyer edit check');
  await expect(projectDetails).toHaveValue('Keep this buyer-edited project detail.');
});

test('contact prefill rejects ambiguous services and bounds untrusted message values', async ({ page }) => {
  const oversizedMessage = 'x'.repeat(5_100);
  await page.goto(`/contact-us/?service=Cut-Out+Letters&service=Other+%2F+Not+sure&message=${oversizedMessage}`);

  await expect(page.getByLabel('Signage type')).toHaveValue('');
  expect((await page.getByLabel('Project details *').inputValue()).length).toBe(5_000);
});

test('Sydney signage buyers can reach the lightbox options and quote form from the homepage', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page).toHaveTitle(/3D & Illuminated Signs Sydney/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('3D & illuminated signs in Sydney');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://3dilluminatedsigns.com.au/');
    const hero = page.locator('section').filter({ has: page.getByRole('heading', { level: 1 }) }).first();
    await expect(hero.getByRole('link', { name: /Request a sign quote/ })).toHaveAttribute('href', '/contact-us/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await hero.getByRole('link', { name: 'LED lightboxes', exact: true }).click();
    await expect(page).toHaveURL(/\/lightbox-signs\/$/);
    await expect(page.getByText(/Choose a double-sided projecting lightbox/)).toBeVisible();
    await page.locator('main').getByRole('link', { name: 'Request a quote', exact: false }).first().click();
    await expect(page.getByLabel('Full name *')).toBeVisible();
  }
});
