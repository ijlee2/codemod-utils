import { expect, test } from '@playwright/test';

test('index > we can visit the page', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'codemod-utils' }),
  ).toBeVisible();

  await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute(
    'href',
    '/docs',
  );

  await expect(page.getByRole('link', { name: 'Quickstart' })).toHaveAttribute(
    'href',
    '/docs/quickstart',
  );
});

test('index > we can navigate to Quickstart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Quickstart' }).click();

  await expect(page).toHaveURL('/docs/quickstart');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Quickstart' }),
  ).toBeVisible();
});

test('index > we can open a changelog', async ({ page }) => {
  await page.goto('/');

  const navigation = page.locator('.VPNavBar');

  const linkToChangelog = navigation.getByRole('link', {
    name: '@codemod-utils/files',
  });

  await expect(linkToChangelog).not.toBeVisible();

  await navigation.getByRole('button', { name: 'Changelogs' }).hover();

  await expect(linkToChangelog).toBeVisible();

  await expect(linkToChangelog).toHaveAttribute(
    'href',
    'https://github.com/ijlee2/codemod-utils/blob/main/packages/files/CHANGELOG.md',
  );

  await expect(linkToChangelog).toHaveAttribute('target', '_blank');
});

test('index > we can toggle light and dark mode', async ({ page }) => {
  await page.goto('/');

  const html = page.locator('html');
  const navigation = page.locator('.VPNavBar');

  const appearanceSwitch = navigation.getByRole('switch', {
    name: 'Appearance',
  });

  await expect(html).not.toHaveClass(/\bdark\b/);
  await expect(appearanceSwitch).toHaveAttribute('aria-checked', 'false');

  await appearanceSwitch.click();

  await expect(html).toHaveClass(/\bdark\b/);
  await expect(appearanceSwitch).toHaveAttribute('aria-checked', 'true');

  await appearanceSwitch.click();

  await expect(html).not.toHaveClass(/\bdark\b/);
  await expect(appearanceSwitch).toHaveAttribute('aria-checked', 'false');
});
