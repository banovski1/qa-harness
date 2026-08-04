package components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class InputComponent {

    private final Page page;

    public InputComponent(Page page) {
        this.page = page;
    }

    public void fill(String label, String value) {
        group(label).getByRole(AriaRole.TEXTBOX).fill(value);
    }

    // OrangeHRM renders labels as siblings, not <label for=...>, so getByLabel cannot see them.
    private Locator group(String label) {
        return page.locator(".oxd-input-group").filter(new Locator.FilterOptions()
            .setHas(page.getByText(label, new Page.GetByTextOptions().setExact(true))));
    }
}
