package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import components.ButtonComponent;
import components.SearchableDropdownComponent;

public class TimePage {

    private final Page page;
    private final SearchableDropdownComponent searchableDropdown;
    private final ButtonComponent button;

    public TimePage(Page page) {
        this.page = page;
        this.searchableDropdown = new SearchableDropdownComponent(page);
        this.button = new ButtonComponent(page);
    }

    public void navigateToTime() {
        page.navigate(ConfigReader.getPageUrl("timePage"));
    }

    public void searchForEmployee(String employeeName) {
        searchableDropdown.selectFirst("Employee Name", employeeName);
    }

    public void clickViewButton() {
        button.clickInForm("View");
    }
}
