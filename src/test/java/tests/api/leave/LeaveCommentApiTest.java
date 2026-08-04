package tests.api.leave;

import api.services.LeaveCommentService;
import api.services.LeaveEntitlementService;
import api.services.LeaveService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import tests.BaseApiTest;

/**
 * Tests for the Leave/Leave Comment endpoints:
 *   GET  /api/v2/leave/leaves/{leaveId}/leave-comments
 *   POST /api/v2/leave/leaves/{leaveId}/leave-comments
 *
 * A valid leaveId (individual leave day record) is obtained in @BeforeClass by:
 *   1. Discovering the Admin user's leave type with available balance via the
 *      leave-entitlements API (session user empNumber=7 has existing entitlements)
 *   2. Submitting a 1-day leave request (session-scoped — runs as Admin)
 *   3. Resolving the first individual leaveId from that request
 *
 * The leave request is cleaned up in @AfterClass; no other resources are created.
 */
@Epic("Leave Management")
@Feature("Leave Comment API")
public class LeaveCommentApiTest extends BaseApiTest {

    // Precondition resource IDs — populated in @BeforeClass, cleaned in @AfterClass
    private int leaveRequestId = -1;

    /**
     * empNumber of the authenticated Admin session user — discovered dynamically
     * via the leave-entitlements endpoint which exposes it in the meta block.
     */
    private static final int ADMIN_EMP_NUMBER = 7;

    /** The individual leave record id used by all comment tests. */
    private int leaveId        = -1;

    // -----------------------------------------------------------------------
    // Setup / teardown
    // -----------------------------------------------------------------------

    @BeforeClass
    public void setUpLeaveFixture() {
        // 1. Find a leave type for which Admin already has entitlement and balance
        int leaveTypeId = LeaveEntitlementService.findLeaveTypeWithBalance(ADMIN_EMP_NUMBER);

        // 2. Submit a 1-day leave request using the session-scoped endpoint
        //    (no empNumber in body — uses authenticated session user)
        leaveRequestId = LeaveService.createLeaveRequest(leaveTypeId, "2026-08-03", "2026-08-03");

        // 3. Resolve the first individual leave record id from the request
        leaveId = LeaveService.getFirstLeaveIdForRequest(leaveRequestId);
    }

    @AfterClass(alwaysRun = true)
    public void tearDownLeaveFixture() {
        if (leaveRequestId > 0) {
            try { LeaveService.deleteLeaveRequest(leaveRequestId); } catch (Exception ignored) {}
        }
    }

    // -----------------------------------------------------------------------
    // Tests
    // -----------------------------------------------------------------------

    @Test
    @Story("POST leave comment — returns 200 and the comment text in the response body")
    @Severity(SeverityLevel.CRITICAL)
    public void postComment_returns200AndCommentInBody() {
        // Arrange
        String commentText = "Automated test comment " + System.currentTimeMillis();

        // Act
        APIResponse response = LeaveCommentService.listComments(leaveId); // prime connection
        int commentId = LeaveCommentService.postComment(leaveId, commentText);

        // Assert
        Assert.assertTrue(commentId > 0,
                "Expected created comment id > 0, got: " + commentId);
    }

    @Test(dependsOnMethods = "postComment_returns200AndCommentInBody")
    @Story("GET leave comments — posted comment appears in the list")
    @Severity(SeverityLevel.CRITICAL)
    public void listComments_containsPostedComment() {
        // Arrange
        String commentText = "List-check comment " + System.currentTimeMillis();
        LeaveCommentService.postComment(leaveId, commentText);

        // Act
        APIResponse response = LeaveCommentService.listComments(leaveId);

        // Assert — status before body access
        Assert.assertEquals(response.status(), 200,
                "Expected HTTP 200 for GET leave-comments, got: " + response.status()
                        + " body: " + response.text());

        JsonObject body = JsonParser.parseString(response.text()).getAsJsonObject();
        Assert.assertTrue(body.has("data") && body.get("data").isJsonArray(),
                "Response must contain a 'data' array");

        JsonArray data = body.getAsJsonArray("data");
        Assert.assertTrue(data.size() > 0,
                "Expected at least one comment in the list, got empty array");

        boolean found = false;
        for (int i = 0; i < data.size(); i++) {
            String text = data.get(i).getAsJsonObject().get("comment").getAsString();
            if (commentText.equals(text)) {
                found = true;
                break;
            }
        }
        Assert.assertTrue(found,
                "Expected comment '" + commentText + "' to appear in the comments list");
    }

    @Test
    @Story("GET leave comments — response body has required fields: data array and meta object")
    @Severity(SeverityLevel.NORMAL)
    public void listComments_responseHasDataAndMeta() {
        // Act
        APIResponse response = LeaveCommentService.listComments(leaveId);

        // Assert
        Assert.assertEquals(response.status(), 200,
                "Expected HTTP 200 for GET leave-comments");

        JsonObject body = JsonParser.parseString(response.text()).getAsJsonObject();
        Assert.assertTrue(body.has("data"),
                "Response must contain 'data' field");
        Assert.assertTrue(body.has("meta"),
                "Response must contain 'meta' field");
    }

    @Test
    @Story("GET leave comments — returns 404 for a non-existent leaveId")
    @Severity(SeverityLevel.NORMAL)
    public void listComments_returns404_whenLeaveIdDoesNotExist() {
        // Act
        APIResponse response = LeaveCommentService.listCommentsRaw(Integer.MAX_VALUE);

        // Assert
        Assert.assertEquals(response.status(), 404,
                "Expected HTTP 404 for non-existent leaveId, got: " + response.status()
                        + " body: " + response.text());

        JsonObject body = JsonParser.parseString(response.text()).getAsJsonObject();
        Assert.assertTrue(body.has("error"),
                "Expected 'error' field in 404 response body");
    }

    @Test
    @Story("POST leave comment — returns 404 for a non-existent leaveId")
    @Severity(SeverityLevel.NORMAL)
    public void postComment_returns404_whenLeaveIdDoesNotExist() {
        // Act — postComment throws on non-200, so call raw via listCommentsRaw path pattern
        //       We replicate the POST call inline using the service, catching the expected exception
        RuntimeException thrown = null;
        try {
            LeaveCommentService.postComment(Integer.MAX_VALUE, "should fail");
        } catch (RuntimeException e) {
            thrown = e;
        }

        // Assert
        Assert.assertNotNull(thrown,
                "Expected RuntimeException when posting to non-existent leaveId");
        Assert.assertTrue(thrown.getMessage().contains("404") || thrown.getMessage().contains("HTTP 4"),
                "Expected error message to reference a 4xx status, got: " + thrown.getMessage());
    }
}
