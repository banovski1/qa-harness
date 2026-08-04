package api;

import base.ConfigReader;
import com.microsoft.playwright.APIRequestContext;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.options.RequestOptions;

/**
 * Thin wrapper around Playwright's APIRequestContext.
 *
 * Auth note: OrangeHRM uses PHP session cookies (_orangehrm) set during the
 * normal browser login. Because APIRequestContext is obtained from the same
 * BrowserContext that performed the login, it automatically carries those
 * cookies — no separate token endpoint is needed.
 *
 * Usage:
 *   ApiClient.init(browserContext);          // once, after browser login
 *   ApiClient.get("/web/index.php/api/v2/pim/employees");
 */
public class ApiClient {

    private static APIRequestContext requestContext;
    private static final String BASE_URL = ConfigReader.getBaseUrl();

    public static void init(BrowserContext context) {
        requestContext = context.request();
    }

    public static APIResponse get(String path) {
        return requestContext.get(BASE_URL + path);
    }

    public static APIResponse get(String path, RequestOptions options) {
        return requestContext.get(BASE_URL + path, options);
    }

    public static APIResponse post(String path, RequestOptions options) {
        return requestContext.post(BASE_URL + path, options);
    }

    public static APIResponse put(String path, RequestOptions options) {
        return requestContext.put(BASE_URL + path, options);
    }

    public static APIResponse delete(String path, RequestOptions options) {
        return requestContext.delete(BASE_URL + path, options);
    }
}
