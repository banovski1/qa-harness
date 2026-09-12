// Conduit: a second app, a different stack, the same framework shape.
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home/HomePage.ts';
import { LoginPage } from '../../src/pages/login/LoginPage.ts';

test('the home feed loads and the navigation is shared', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.expectHeading();
  await home.navigation.expectVisible();
});

test('the sign-in form is addressed by its placeholders, which is all this app gives', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.email.fill('nobody@example.com');
  await login.password.fill('not-a-real-password');
  await login.email.expectValue('nobody@example.com');
  expect(await login.signIn.isEnabled()).toBe(true);
});

test('a crawl-proved transition becomes a typed navigation method', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.goToNeedAnAccount();
  await expect(page).toHaveURL(/\/register$/);
});
