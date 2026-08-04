package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import components.ButtonComponent;
import components.DropdownComponent;
import components.SearchableDropdownComponent;
import components.TableComponent;
import components.TextComponent;

import java.util.Arrays;
import java.util.List;

public class PIMPage {

    private final Page page;
    private final DropdownComponent dropdown;
    private final ButtonComponent button;
    private final TableComponent table;
    private final SearchableDropdownComponent searchableDropdown;
    private final TextComponent text;

    public PIMPage(Page page) {
        this.page = page;
        this.dropdown = new DropdownComponent(page);
        this.button = new ButtonComponent(page);
        this.table = new TableComponent(page);
        this.searchableDropdown = new SearchableDropdownComponent(page);
        this.text = new TextComponent(page);
    }

    public void navigateToPIM() {
        page.navigate(ConfigReader.getPageUrl("pimPage"));
    }

    public void searchByEmploymentStatus(String status) {
        dropdown.select("Employment Status", status);
    }

    public void clickSearchButton() {
        button.click("Search");
    }

    public void assertEmployeeDetails(String id, String firstName, String lastName,
                                       String jobTitle, String employmentStatus, String subUnit) {
        List<String> expected = Arrays.asList(id, firstName, lastName, jobTitle, employmentStatus, subUnit);
        table.assertFirstDataRow(expected);
    }

    public void searchByName(String firstName) {
        searchableDropdown.selectFirst("Employee Name", firstName);
    }

    public void assertEmployeeNameInTable(String firstName, String lastName) {
        table.assertCellVisible(firstName);
        table.assertCellVisible(lastName);
    }

    public void assertNoRecordsFound() {
        text.assertVisible("No Records Found");
    }
}
