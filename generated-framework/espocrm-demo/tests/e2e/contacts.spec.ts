// A smoke test written the way the framework intends: no locators, no nth, and the
// created record found by a value only this run could have produced.
import { test, expect } from '@playwright/test';
import { ContactPage } from '../../src/pages/contact/ContactPage.ts';
import { ContactCreatePage } from '../../src/pages/contact/ContactCreatePage.ts';
import { uniqueName } from '../../src/utils/unique-name.ts';

test('the contact list loads and names its columns', async ({ page }) => {
  const contacts = new ContactPage(page);
  await contacts.goto();
  await contacts.contacts.settled();
  expect(await contacts.contacts.count()).toBeGreaterThan(0);
  expect(contacts.contacts.keyColumn).toBe('Name');
});

test('the create form opens from the list and accepts a name', async ({ page }) => {
  const contacts = new ContactPage(page);
  await contacts.goto();
  await contacts.goToCreateContact();

  const form = new ContactCreatePage(page);
  const surname = uniqueName('Smoke');
  await form.firstName.fill('Test');
  await form.lastName.fill(surname);
  await expect(async () => {
    expect(await form.lastName.value()).toBe(surname);
  }).toPass();
});

test('a created contact is found by its own value, not by its position', async ({ page }) => {
  const surname = uniqueName('Smoke');

  const form = new ContactCreatePage(page);
  await form.goto();
  await form.firstName.fill('Pipeline');
  await form.lastName.fill(surname);
  await form.save.click();
  // The save completes asynchronously and then redirects to the new record. Navigating
  // before that lands the test back on the detail screen — wait for the evidence.
  await page.waitForURL(/#Contact\/view\//, { timeout: 30_000 });

  const contacts = new ContactPage(page);
  await contacts.goto();
  await contacts.contacts.settled();
  await contacts.contacts.expectRow(surname);
  expect(await contacts.contacts.cell(surname, 'Name').innerText()).toContain(surname);
});
