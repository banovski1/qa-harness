package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/leave-assign.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class AssignLeavePageLocators {

    private final Page page;

    public AssignLeavePageLocators(Page page) {
        this.page = page;
    }

    /** Assign submit button */
    public Locator assignButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Assign"));
    }

    // UNRESOLVED: comments -- Bare <textarea> with no accessible name, placeholder or test id.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** "Ok" button on the balance-exceeded confirmation dialog */
    public Locator confirmDialogOk() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Ok"));
    }

    // UNRESOLVED: employeeName -- Placeholder is the generic "Type for hints..."; the "Employee Name*" caption is a <div>, not a label. Unique on this page today, but the same placeholder recurs across OrangeHRM search panels -- use the label-scoped autocomplete component rather than betting on page-local uniqueness.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: fromDate -- Placeholder "yyyy-dd-mm" is shared verbatim with the To Date field on the same form.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** "Assign Leave" form heading */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Assign Leave"));
    }

    /** Leave balance readout, e.g. "0.00 Day(s)" */
    public Locator leaveBalanceValue() {
        return page.getByText("Day(s)");
    }

    // UNRESOLVED: leaveType -- Styled <div> "-- Select --" dropdown; no role or label association.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** Confirmation toast after a successful assignment */
    public Locator successToast() {
        return page.getByText("Successfully Assigned");
    }

    // UNRESOLVED: toDate -- Same "yyyy-dd-mm" placeholder collision as fromDate.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.
}
