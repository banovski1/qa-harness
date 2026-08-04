package components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class DropdownComponent {

    private final Page page;

    public DropdownComponent(Page page) {
        this.page = page;
    }

    public void select(String label, String value) {
        group(label).locator(".oxd-select-text").click();
        page.getByRole(AriaRole.OPTION, new Page.GetByRoleOptions().setName(value)).click();
    }

    // OrangeHRM renders labels as siblings, not <label for=...>, so getByLabel cannot see them.
    private Locator group(String label) {
        return page.locator(".oxd-input-group").filter(new Locator.FilterOptions()
            .setHas(page.getByText(label, new Page.GetByTextOptions().setExact(true))));
    }
}
