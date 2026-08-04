package components;

import com.microsoft.playwright.Page;

public class CheckboxComponent {

    private final Page page;

    public CheckboxComponent(Page page) {
        this.page = page;
    }

    public void check(String label) {
        page.getByLabel(label).check();
    }

    public void uncheck(String label) {
        page.getByLabel(label).uncheck();
    }
}
