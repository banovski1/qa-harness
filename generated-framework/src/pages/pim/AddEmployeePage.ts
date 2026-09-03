import { AddEmployeePageGenerated } from './AddEmployeePage.generated';
import { expectResponse } from '../../utils/network';

export interface EmployeeLoginDetails {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export class AddEmployeePage extends AddEmployeePageGenerated {
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
