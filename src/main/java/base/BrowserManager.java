package base;

import com.microsoft.playwright.*;

import java.util.List;

public class BrowserManager {

    private static Playwright playwright;
    private static Browser browser;
    private static BrowserContext context;
    private static Page page;

    public static void init() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
            .setHeadless(false)
            .setArgs(List.of("--start-maximized")));
        context = browser.newContext(new Browser.NewContextOptions()
            .setViewportSize(null));
        page = context.newPage();
    }

    public static Page getPage() {
        return page;
    }

    /** Exposes the BrowserContext so ApiClient can share its session cookies. */
    public static BrowserContext getContext() {
        return context;
    }

    public static void close() {
        if (context != null) context.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}
