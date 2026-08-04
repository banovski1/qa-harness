package tests.login;

import base.BrowserManager;
import base.ConfigReader;
import com.microsoft.playwright.*;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import pages.DashboardPage;
import pages.LoginPage;

public class LoginTest {

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
    public void testValidLogin() {
        new LoginPage(page).login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));
        new DashboardPage(page).assertLoggedIn();
    }
}
