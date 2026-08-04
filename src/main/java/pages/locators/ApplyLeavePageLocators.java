package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/leave-apply.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class ApplyLeavePageLocators {

    private final Page page;

    public ApplyLeavePageLocators(Page page) {
        this.page = page;
    }

    /** Apply submit button */
    public Locator applyButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Apply"));
    }

    // UNRESOLVED: comments -- Bare <textarea> with no accessible name, placeholder or test id.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    // UNRESOLVED: fromDate -- Placeholder "yyyy-dd-mm" is shared verbatim with the To Date field on the same form, so getByPlaceholder is ambiguous. The "From Date*" caption is a <div>, not a label. Must be scoped by its label container.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** "Apply Leave" form heading */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Apply Leave"));
    }

    /** Leave balance readout, e.g. "0.00 Day(s)" */
    public Locator leaveBalanceValue() {
        return page.getByText("Day(s)");
    }

    // UNRESOLVED: leaveType -- Styled <div> showing "-- Select --", not a <select>; no role, no label association. Use the searchable dropdown component keyed on the visible "Leave Type" label.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.

    /** Validation shown when the employee has no entitlement */
    public Locator noEntitlementError() {
        return page.getByText("No Leave Types with Leave Balance");
    }

    /** Confirmation toast after a successful application */
    public Locator successToast() {
        return page.getByText("Successfully Submitted");
    }

    // UNRESOLVED: toDate -- Same "yyyy-dd-mm" placeholder collision as fromDate.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.
}
