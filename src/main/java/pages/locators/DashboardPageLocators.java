package pages.locators;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * GENERATED FROM ui_model/orangehrm/dashboard.yaml -- DO NOT EDIT BY HAND.
 *
 * Regenerate with:  python -m ui_model.emit_java orangehrm
 *
 * Model verified against the live application on 2026-08-02.
 * Every locator here came from a validated model entry; none was hand-written,
 * and the closed locator vocabulary makes CSS and XPath unrepresentable.
 */
public final class DashboardPageLocators {

    private final Page page;

    public DashboardPageLocators(Page page) {
        this.page = page;
    }

    /** Admin module link in the Sidepanel */
    public Locator adminModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Admin").setExact(true));
    }

    /** Buzz module link in the Sidepanel */
    public Locator buzzModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Buzz").setExact(true));
    }

    /** Claim module link in the Sidepanel */
    public Locator claimModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Claim").setExact(true));
    }

    /** Directory module link in the Sidepanel */
    public Locator directoryModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Directory").setExact(true));
    }

    /** "Dashboard" topbar heading */
    public Locator heading() {
        return page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Dashboard"));
    }

    /** Leave module link in the Sidepanel */
    public Locator leaveModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Leave").setExact(true));
    }

    /** Maintenance module link in the Sidepanel */
    public Locator maintenanceModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Maintenance").setExact(true));
    }

    /** My Info module link in the Sidepanel */
    public Locator myInfoModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("My Info").setExact(true));
    }

    /** Performance module link in the Sidepanel */
    public Locator performanceModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Performance").setExact(true));
    }

    /** PIM module link in the Sidepanel */
    public Locator pimModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("PIM").setExact(true));
    }

    /** Quick Launch "Apply Leave" tile */
    public Locator quickLaunchApplyLeave() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Apply Leave"));
    }

    /** Quick Launch "Assign Leave" tile */
    public Locator quickLaunchAssignLeave() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Assign Leave"));
    }

    /** Quick Launch "Leave List" tile */
    public Locator quickLaunchLeaveList() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Leave List"));
    }

    /** Quick Launch "My Leave" tile */
    public Locator quickLaunchMyLeave() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("My Leave"));
    }

    /** Quick Launch "My Timesheet" tile */
    public Locator quickLaunchMyTimesheet() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("My Timesheet"));
    }

    /** Quick Launch "Timesheets" tile */
    public Locator quickLaunchTimesheets() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Timesheets"));
    }

    /** Recruitment module link in the Sidepanel */
    public Locator recruitmentModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Recruitment").setExact(true));
    }

    /** Left module navigation region */
    public Locator sidepanel() {
        return page.getByRole(AriaRole.NAVIGATION, new Page.GetByRoleOptions().setName("Sidepanel"));
    }

    /** Sidepanel module search box */
    public Locator sidepanelSearch() {
        return page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Search"));
    }

    /** Time module link in the Sidepanel */
    public Locator timeModuleLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Time").setExact(true));
    }

    // UNRESOLVED: userDropdown -- The trigger is an unnamed <button> inside the "Topbar Menu" nav; its only distinguishing content is an icon glyph. No role+name, no label, no test id. Drive it through a component that scopes to the Topbar Menu nav.
    //   Not emitted: no accessible locator exists. Drive it with a
    //   label-scoped component instead of adding a selector here.
}
