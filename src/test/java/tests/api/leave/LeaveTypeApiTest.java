package tests.api.leave;

import api.ApiClient;
import api.services.LeaveTypeService;
import com.google.gson.JsonObject;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Epic("Leave Management")
@Feature("Leave API")
public class LeaveTypeApiTest extends BaseApiTest {

    private int createdLeaveTypeId = -1;

    /**
     * OrangeHRM enforces globally unique leave type names across all records including
     * soft-deleted ones. Each test must use a unique name per run to avoid 422 errors.
     */
    private static String uniqueName(String base) {
        return base + "-" + System.currentTimeMillis();
    }

    @Test(description = "GET /leave-types/eligible returns response with 'data' array and 'meta' object")
    @Story("Get My Eligible Leave Types")
    @Severity(SeverityLevel.NORMAL)
    public void getEligibleLeaveTypes_returnsValidResponse() {
        JsonObject body = LeaveTypeService.getEligibleLeaveTypes();
        Assert.assertTrue(body.has("data") && body.get("data").isJsonArray(),
                "Expected 'data' array in response");
        Assert.assertTrue(body.has("meta") && body.get("meta").isJsonObject(),
                "Expected 'meta' object in response");
    }

    @Test
    @Story("List Leave Types")
    public void listLeaveTypes_returns200() {
        com.microsoft.playwright.APIResponse response = ApiClient.get("/web/index.php/api/v2/leave/leave-types");
        Assert.assertEquals(response.status(), 200, "Expected HTTP 200 for leave types list");
    }

    @Test
    @Story("Create Leave Type")
    public void createLeaveType_returnsValidId() {
        createdLeaveTypeId = LeaveTypeService.createLeaveType(uniqueName("ApiLT"));
        Assert.assertTrue(createdLeaveTypeId > 0,
                "Expected id > 0, got: " + createdLeaveTypeId);
    }

    @Test
    @Story("Read Leave Type")
    public void getLeaveType_returnsCorrectName() {
        String name = uniqueName("ReadLT");
        createdLeaveTypeId = LeaveTypeService.createLeaveType(name);
        String returned = LeaveTypeService.getLeaveType(createdLeaveTypeId);
        Assert.assertEquals(returned, name);
    }

    @Test
    @Story("Update Leave Type")
    public void updateLeaveType_changesName() {
        createdLeaveTypeId = LeaveTypeService.createLeaveType(uniqueName("UpdLT"));
        String newName = uniqueName("UpdLT-mod");
        LeaveTypeService.updateLeaveType(createdLeaveTypeId, newName);
        String returned = LeaveTypeService.getLeaveType(createdLeaveTypeId);
        Assert.assertEquals(returned, newName);
    }

    @Test
    @Story("Delete Leave Type")
    public void deleteLeaveType_removesRecord() {
        createdLeaveTypeId = LeaveTypeService.createLeaveType(uniqueName("DelLT"));
        int idToDelete = createdLeaveTypeId;
        LeaveTypeService.deleteLeaveType(idToDelete);

        try {
            LeaveTypeService.getLeaveType(idToDelete);
            Assert.fail("Expected exception for deleted leave type " + idToDelete);
        } catch (RuntimeException e) {
            Assert.assertTrue(e.getMessage().contains("deleted") || e.getMessage().contains("HTTP 4"),
                    "Unexpected error: " + e.getMessage());
        }
    }

}
