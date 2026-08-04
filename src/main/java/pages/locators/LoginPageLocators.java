package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/login.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class LoginPageLocators {

    private final Page page;

    public LoginPageLocators(Page page) {
        this.page = page;
    }

    /** OrangeHRM company branding image */
    public Locator brandLogo() {
        return page.getByAltText("company-branding");
    }

    /** "Forgot your password?" control */
    public Locator forgotPasswordLink() {
        return page.getByText("Forgot your password?");
    }

    /** "Login" panel heading -- proves the login page rendered */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Login"));
    }

    /** Error banner shown after a failed login */
    public Locator invalidCredentialsAlert() {
        return page.getByText("Invalid credentials");
    }

    /** Login submit button */
    public Locator loginButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Login"));
    }

    /** Password field */
    public Locator password() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password"));
    }

    /** Username field */
    public Locator username() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Username"));
    }
}
