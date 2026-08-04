package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class LeaveEntitlementService {

    private static final String ENTITLEMENTS_PATH = "/web/index.php/api/v2/leave/leave-entitlements";

    public static int createLeaveEntitlement(int empNumber, int leaveTypeId, int days,
                                              String fromDate, String toDate) {
        JsonObject body = new JsonObject();
        body.addProperty("empNumber", empNumber);
        body.addProperty("leaveTypeId", leaveTypeId);
        body.addProperty("entitlement", days);
        body.addProperty("fromDate", fromDate);
        body.addProperty("toDate", toDate);

        APIResponse response = ApiClient.post(ENTITLEMENTS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create leave entitlement: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    public static void deleteLeaveEntitlement(int id) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(id);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(ENTITLEMENTS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete leave entitlement " + id
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    /**
     * Returns the leave type id of the first entitlement for empNumber.
     * Throws if none found.
     */
    public static int findLeaveTypeWithBalance(int empNumber) {
        APIResponse response = ApiClient.get(
                ENTITLEMENTS_PATH + "?empNumber=" + empNumber + "&limit=50");

        if (response.status() != 200) {
            throw new RuntimeException("Failed to get leave entitlements: HTTP " + response.status()
                    + " — " + response.text());
        }

        String raw = response.text();
        System.out.println("DEBUG entitlements response: " + raw);
        JsonArray data = JsonParser.parseString(raw).getAsJsonObject().getAsJsonArray("data");

        if (data.size() == 0) {
            throw new RuntimeException("No leave entitlements found for empNumber=" + empNumber
                    + ". Raw response: " + raw);
        }

        // Return the first entry's leave type id regardless of balance field name
        JsonObject first = data.get(0).getAsJsonObject();
        return first.getAsJsonObject("leaveType").get("id").getAsInt();
    }
}
