import { AddEmployeePageGenerated } from './AddEmployeePage.generated';
import { CheckboxComponent } from '../../components/CheckboxComponent';
import { MenuItemComponent } from '../../components/MenuItemComponent';
import { expectResponse } from '../../utils/network';

export interface EmployeeLoginDetails {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export class AddEmployeePage extends AddEmployeePageGenerated {
  // Two elements the generator cannot supply from static analysis, kept here because a
  // protected file is where a locator the extractor cannot reach belongs.
  //
  // The tab is part of the server-driven menu, so it appears in no template in the app's
  // source; the toggle carries no label of its own and is named only by the copy beside it,
  // which leaves nothing to anchor a locator to. Both selectors are the ones a live walk of
  // this screen confirmed.

  /** Top-bar tab. Rendered from the menu payload, so it is not in the app's own markup. */
  get addEmployeeMenuItem(): MenuItemComponent {
    return MenuItemComponent.byLabel(this.page, 'Add Employee');
  }

  /** "Create Login Details" toggle. // UNSTABLE — the only switch on the screen, matched by class alone. */
  get createLoginDetailsSwitch(): CheckboxComponent {
    return new CheckboxComponent(this.page.locator('.oxd-switch-input'), 'Create Login Details (switch)');
  }

  async createEmployeeWithLogin(details: EmployeeLoginDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.createLoginDetailsSwitch.setChecked(true);
    await this.usernameInput.locator.waitFor({ state: 'visible' });
    await this.usernameInput.fill(details.username);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.password);
    await this.enabledRadio.select();

    const saved = expectResponse(this.page, { urlIncludes: '/pim/employees', method: 'POST', status: 200 });
    await this.saveButton.click();
    await saved;
  }
}
