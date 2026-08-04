package components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

import java.util.List;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TableComponent {

    private final Page page;

    public TableComponent(Page page) {
        this.page = page;
    }

    public void assertFirstDataRow(List<String> expectedCellTexts) {
        Locator firstRow = page.getByRole(AriaRole.ROW).nth(1);
        for (String expectedText : expectedCellTexts) {
            // containsText, not a nested getByText: the same value can legitimately appear
            // in more than one cell of the row (e.g. username "Admin" and role "Admin").
            assertThat(firstRow).containsText(expectedText);
        }
    }

    public void assertCellVisible(String text) {
        assertThat(page.getByRole(AriaRole.CELL, new Page.GetByRoleOptions().setName(text))).isVisible();
    }
}
