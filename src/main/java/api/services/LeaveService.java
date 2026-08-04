package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class LeaveService {

    private static final String LEAVE_REQUESTS_PATH = "/web/index.php/api/v2/leave/leave-requests";

    /**
     * Creates a leave request for the authenticated session user and returns its leaveRequestId.
     *
     * @param leaveTypeId leave type id (e.g. 2 for Annual)
     * @param fromDate   ISO date string, e.g. "2026-06-01"
     * @param toDate     ISO date string, e.g. "2026-06-03"
     */
    public static int createLeaveRequest(int leaveTypeId, String fromDate, String toDate) {
        JsonObject body = new JsonObject();
        body.addProperty("leaveTypeId", leaveTypeId);
        body.addProperty("fromDate", fromDate);
        body.addProperty("toDate", toDate);
        body.addProperty("comment", "API test leave request");

        APIResponse response = ApiClient.post(LEAVE_REQUESTS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create leave request: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    /**
     * Creates a leave request on behalf of a specific employee (admin-submitted).
     * Uses the leave-requests endpoint with an explicit empNumber in the body.
     *
     * @param empNumber   the employee to submit the leave for
     * @param leaveTypeId leave type id
     * @param fromDate    ISO date string, e.g. "2026-06-01"
     * @param toDate      ISO date string, e.g. "2026-06-01"
     * @return the leaveRequestId
     */
    public static int createLeaveRequestForEmployee(int empNumber, int leaveTypeId,
                                                    String fromDate, String toDate) {
        JsonObject body = new JsonObject();
        body.addProperty("empNumber", empNumber);
        body.addProperty("leaveTypeId", leaveTypeId);
        body.addProperty("fromDate", fromDate);
        body.addProperty("toDate", toDate);
        body.addProperty("comment", "API test leave request");

        APIResponse response = ApiClient.post(LEAVE_REQUESTS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create leave request for empNumber=" + empNumber
                    + ": HTTP " + response.status() + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    /**
     * Returns the first individual leaveId belonging to a leave request.
     * OrangeHRM stores each day of a multi-day request as a separate "leave" record.
     * The leave-comment endpoints operate on these individual leave IDs, not on
     * the leaveRequestId.
     *
     * @param leaveRequestId the id returned by createLeaveRequest
     * @return the id of the first individual leave record
     */
    public static int getFirstLeaveIdForRequest(int leaveRequestId) {
        String path = LEAVE_REQUESTS_PATH + "/" + leaveRequestId + "/leaves";
        APIResponse response = ApiClient.get(path);

        if (response.status() != 200) {
            throw new RuntimeException("Failed to list leaves for request " + leaveRequestId
                    + ": HTTP " + response.status() + " — " + response.text());
        }

        JsonArray data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonArray("data");

        if (data == null || data.size() == 0) {
            throw new RuntimeException("No individual leave records found for leaveRequestId="
                    + leaveRequestId + ". Raw: " + response.text());
        }

        return data.get(0).getAsJsonObject().get("id").getAsInt();
    }

    /**
     * Cancels (deletes) a leave request by id.
     */
    public static void deleteLeaveRequest(int leaveRequestId) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(leaveRequestId);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(LEAVE_REQUESTS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete leave request " + leaveRequestId
                    + ": HTTP " + response.status());
        }
    }
}
