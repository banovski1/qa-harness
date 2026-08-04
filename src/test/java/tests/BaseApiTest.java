package tests;

import api.ApiClient;
import com.microsoft.playwright.*;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import pages.LoginPage;

/**
 * Base class for pure API tests.
 *
 * Launches a headless browser only to perform login (required to obtain the
 * PHP session cookie). The browser page is closed after authentication; the
 * BrowserContext stays alive so its cookies are available to ApiClient for
 * the duration of the test class.
 */
public class BaseApiTest {

    private Playwright playwright;
    private Browser browser;
    private BrowserContext context;

    @BeforeClass
    public void setUpApi() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
        context = browser.newContext();
        Page authPage = context.newPage();
        new LoginPage(authPage).login();
        // Wait for redirect to dashboard to confirm authentication succeeded
        authPage.waitForURL("**/dashboard/**", new Page.WaitForURLOptions().setTimeout(20000));
        authPage.close();
        ApiClient.init(context);
    }

    @AfterClass
    public void tearDownApi() {
        if (context != null) context.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}
