package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import pages.locators.LoginPageLocators;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class LoginPage {

    private final Page page;
    private final LoginPageLocators at;

    public LoginPage(Page page) {
        this.page = page;
        this.at = new LoginPageLocators(page);
    }

    public void login(String username, String password) {
        page.navigate(ConfigReader.getPageUrl("loginPage"));
        at.username().fill(username);
        at.password().fill(password);
        at.loginButton().click();
    }

    public void login() {
        login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));
    }

    public void assertInvalidCredentials() {
        assertThat(at.invalidCredentialsAlert()).isVisible();
    }
}
