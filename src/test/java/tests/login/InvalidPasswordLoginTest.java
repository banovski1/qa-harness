package tests.login;

import com.microsoft.playwright.*;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import pages.LoginPage;

public class InvalidPasswordLoginTest {

    private Playwright playwright;
    private Browser browser;
    private Page page;

    @BeforeClass
    public void setUp() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
        page = browser.newContext(new Browser.NewContextOptions().setViewportSize(null)).newPage();
    }

    @AfterClass
    public void tearDown() {
        browser.close();
        playwright.close();
    }

    @Test
    public void testInvalidPasswordLogin() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.login("Admin", "invalidpassword");
        loginPage.assertInvalidCredentials();
    }
}
