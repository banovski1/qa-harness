package components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class ButtonComponent {

    private final Page page;

    public ButtonComponent(Page page) {
        this.page = page;
    }

    public void click(String name) {
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName(name)).click();
    }

    /** For labels a results grid repeats per row (e.g. "View") — targets the form's button. */
    public void clickInForm(String name) {
        page.locator("form")
            .getByRole(AriaRole.BUTTON, new Locator.GetByRoleOptions().setName(name))
            .click();
    }
}
