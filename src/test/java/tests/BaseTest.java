package tests;

import api.ApiClient;
import base.BrowserManager;
import com.microsoft.playwright.Page;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import pages.LoginPage;

public class BaseTest {

    protected Page page;

    @BeforeClass
    public void setUp() {
        BrowserManager.init();
        page = BrowserManager.getPage();
        new LoginPage(page).login();
        // Initialise ApiClient after login so it shares the authenticated session cookies
        ApiClient.init(BrowserManager.getContext());
    }

    @AfterClass
    public void tearDown() {
        BrowserManager.close();
    }
}
