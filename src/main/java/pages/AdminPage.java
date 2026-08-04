package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import components.ButtonComponent;
import components.DropdownComponent;
import components.InputComponent;

public class AdminPage {

    private final Page page;
    private final InputComponent input;
    private final DropdownComponent dropdown;
    private final ButtonComponent button;

    public AdminPage(Page page) {
        this.page = page;
        this.input = new InputComponent(page);
        this.dropdown = new DropdownComponent(page);
        this.button = new ButtonComponent(page);
    }

    public void searchForAdmin() {
        page.navigate(ConfigReader.getPageUrl("adminPage"));
        input.fill("Username", "Admin");
        dropdown.select("User Role", "Admin");
        dropdown.select("Status", "Enabled");
        button.click("Search");
    }

    public void searchForAdminESS() {
        page.navigate(ConfigReader.getPageUrl("adminPage"));
        input.fill("Username", "Admin");
        dropdown.select("User Role", "ESS");
    }

    public void clickResetButton() {
        button.click("Reset");
    }

    public void searchByUsername(String username) {
        page.navigate(ConfigReader.getPageUrl("adminPage"));
        input.fill("Username", username);
        button.click("Search");
    }
}
