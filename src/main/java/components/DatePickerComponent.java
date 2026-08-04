package components;

import com.microsoft.playwright.Page;

public class DatePickerComponent {

    private final Page page;

    public DatePickerComponent(Page page) {
        this.page = page;
    }

    public void fill(String label, String value) {
        page.getByLabel(label).fill(value);
    }
}
