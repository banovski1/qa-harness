package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/pim-employee-list.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class PIMPageLocators {

    private final Page page;

    public PIMPageLocators(Page page) {
        this.page = page;
    }

    /** Add button above the results table (opens Add Employee) */
    public Locator addButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Add"));
    }

    /** Add Employee tab in the PIM topbar */
    public Locator addEmployeeTab() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Add Employee"));
    }

    // UNRESOLVED: employeeIdFilter -- Bare <input> with no accessible name, no placeholder and no test id. Its only handle is the sibling "Employee Id" <div>.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** "Employee Information" panel heading */
    public Locator employeeInformationHeading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Employee Information"));
    }

    /** Employee List tab in the PIM topbar */
    public Locator employeeListTab() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Employee List"));
    }

    // UNRESOLVED: employeeNameFilter -- Placeholder is "Type for hints..." -- shared verbatim with the Supervisor Name field on the same panel, so getByPlaceholder is ambiguous. The label "Employee Name" is a <div>, not a <label for>. Use the label-scoped autocomplete component.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: employmentStatusFilter -- Not a <select>. A styled <div> showing "-- Select --", identical in markup to the Include / Job Title / Sub Unit dropdowns. Use the searchable dropdown component keyed on the visible label.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** "PIM" topbar heading */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("PIM"));
    }

    // UNRESOLVED: includeFilter -- Same styled-div dropdown pattern as employmentStatusFilter.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: jobTitleFilter -- Same styled-div dropdown pattern as employmentStatusFilter.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** Empty-state message when a search matches nothing */
    public Locator noRecordsFound() {
        return page.getByText("No Records Found");
    }

    /** "(N) Records Found" summary above the table */
    public Locator recordsFoundText() {
        return page.getByText("Records Found");
    }

    /** Reports tab in the PIM topbar */
    public Locator reportsTab() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Reports"));
    }

    /** Reset button on the Employee Information panel */
    public Locator resetButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Reset"));
    }

    /** Employee results table */
    public Locator resultsTable() {
        return page.getByRole(AriaRole.TABLE);
    }

    /** Search button on the Employee Information panel */
    public Locator searchButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Search"));
    }

    // UNRESOLVED: subUnitFilter -- Same styled-div dropdown pattern as employmentStatusFilter.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: supervisorNameFilter -- Same ambiguity as employeeNameFilter -- placeholder "Type for hints..." appears twice on this page.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.
}
