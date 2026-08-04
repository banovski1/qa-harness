package components;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class RadioGroupComponent {

    private final Page page;

    public RadioGroupComponent(Page page) {
        this.page = page;
    }

    public void select(String label, String value) {
        page.getByRole(AriaRole.RADIO, new Page.GetByRoleOptions().setName(value)).click();
    }
}
