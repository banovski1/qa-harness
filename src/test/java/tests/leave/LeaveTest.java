package tests.leave;

import api.services.LeaveTypeService;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.LeavePage;
import tests.BaseTest;

@Epic("Leave Management")
@Feature("Leave UI")
public class LeaveTest extends BaseTest {

    private int leaveTypeId = -1;
    private String leaveTypeName;

    @BeforeMethod(onlyForGroups = "leave-precondition")
    public void createLeaveTypeViaApi() {
        leaveTypeName = "AutoLT-" + System.currentTimeMillis();
        leaveTypeId = LeaveTypeService.createLeaveType(leaveTypeName);
    }

    @AfterMethod(onlyForGroups = "leave-precondition")
    public void deleteLeaveTypeViaApi() {
        if (leaveTypeId > 0) LeaveTypeService.deleteLeaveType(leaveTypeId);
    }

    @Test(groups = "leave-precondition")
    @Story("Leave Type Created via API Appears in Leave Types UI")
    @Severity(SeverityLevel.CRITICAL)
    public void apiCreatedLeaveType_appearsInLeaveTypesUI() {
        LeavePage leavePage = new LeavePage(page);
        leavePage.navigateToLeaveTypes();
        leavePage.assertLeaveTypeInTable(leaveTypeName);
    }
}
