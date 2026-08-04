package pages;

import com.microsoft.playwright.Page;
import pages.locators.DashboardPageLocators;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

/**
 * Landing page after login. Also owns the Sidepanel, which is present on every
 * authenticated page -- modelled here so exactly one page object owns module
 * navigation.
 */
public class DashboardPage {

    private final DashboardPageLocators at;

    public DashboardPage(Page page) {
        this.at = new DashboardPageLocators(page);
    }

    /**
     * A logged-in session is proven by the Sidepanel's module links, not by the
     * Sidepanel landmark itself -- the landmark renders on the login page too,
     * so asserting on it would pass vacuously.
     */
    public void assertLoggedIn() {
        assertThat(at.adminModuleLink()).isVisible();
    }

    public void openPIM() {
        at.pimModuleLink().click();
    }

    public void openLeave() {
        at.leaveModuleLink().click();
    }

    public void openAdmin() {
        at.adminModuleLink().click();
    }

    public void assertDashboardHeadingVisible() {
        assertThat(at.heading()).isVisible();
    }
}
