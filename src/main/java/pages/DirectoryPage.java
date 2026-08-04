package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import components.ButtonComponent;
import components.DropdownComponent;
import components.SearchableDropdownComponent;

public class DirectoryPage {

    private final Page page;
    private final SearchableDropdownComponent searchableDropdown;
    private final DropdownComponent dropdown;
    private final ButtonComponent button;

    public DirectoryPage(Page page) {
        this.page = page;
        this.searchableDropdown = new SearchableDropdownComponent(page);
        this.dropdown = new DropdownComponent(page);
        this.button = new ButtonComponent(page);
    }

    public void searchDirectory(String employeeName, String jobTitle) {
        page.navigate(ConfigReader.getPageUrl("directoryPage"));
        searchableDropdown.selectFirst("Employee Name", employeeName);
        dropdown.select("Job Title", jobTitle);
        button.click("Search");
    }

    public void verifySearchResults(String employeeName, String jobTitle) {
        // TODO: Implement verification logic
    }
}
