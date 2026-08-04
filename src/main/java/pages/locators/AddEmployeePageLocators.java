package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/pim-add-employee.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class AddEmployeePageLocators {

    private final Page page;

    public AddEmployeePageLocators(Page page) {
        this.page = page;
    }

    /** Cancel button */
    public Locator cancelButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Cancel"));
    }

    // UNRESOLVED: createLoginDetailsToggle -- The checkbox has no accessible name -- the caption "Create Login Details" is a sibling <p>, not a label. Needs a label-scoped component.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: employeeId -- Bare <input> with no accessible name, no placeholder and no test id. Its only handle is the sibling "Employee Id" <div>.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** First Name field */
    public Locator firstName() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("First Name"));
    }

    /** "Add Employee" form heading */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Add Employee"));
    }

    /** Last Name field */
    public Locator lastName() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Last Name"));
    }

    /** Middle Name field */
    public Locator middleName() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Middle Name"));
    }

    // UNRESOLVED: profilePictureUpload -- The visible "Choose File" button proxies a hidden <input type=file> with no accessible name; the button itself carries no ref. Drive it with Playwright's setInputFiles against the file input, not a click.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** Save button */
    public Locator saveButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save"));
    }

    /** Confirmation toast shown after a successful save */
    public Locator successToast() {
        return page.getByText("Successfully Saved");
    }
}
