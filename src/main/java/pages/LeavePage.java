package pages;

import base.ConfigReader;
import com.microsoft.playwright.Page;
import components.TableComponent;

public class LeavePage {

    private final Page page;
    private final TableComponent table;

    public LeavePage(Page page) {
        this.page = page;
        this.table = new TableComponent(page);
    }

    public void navigateToLeaveTypes() {
        page.navigate(ConfigReader.getPageUrl("leaveTypesPage"));
    }

    public void assertLeaveTypeInTable(String leaveTypeName) {
        table.assertCellVisible(leaveTypeName);
    }
}
