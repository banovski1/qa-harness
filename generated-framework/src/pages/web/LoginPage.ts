// Yours. The generator writes this once and never touches it again — put actions,
// assertions and anything the analysis could not know here.
import { LoginPageGenerated } from './LoginPage.generated.ts';

export class LoginPage extends LoginPageGenerated {
  /** Fills the credentials and submits — the only proven interaction on this screen. */
  async loginAs(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.login.click();
  }
}
