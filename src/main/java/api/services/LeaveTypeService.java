package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class LeaveTypeService {

    private static final String PATH = "/web/index.php/api/v2/leave/leave-types";

    public static int createLeaveType(String name) {
        JsonObject body = new JsonObject();
        body.addProperty("name", name);
        body.addProperty("situational", false);

        APIResponse response = ApiClient.post(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create leave type: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    public static com.google.gson.JsonObject getEligibleLeaveTypes() {
        APIResponse response = ApiClient.get(PATH + "/eligible");
        if (response.status() != 200) {
            throw new RuntimeException("Failed to get eligible leave types: HTTP " + response.status()
                    + " — " + response.text());
        }
        return JsonParser.parseString(response.text()).getAsJsonObject();
    }

    public static String getLeaveType(int id) {
        APIResponse response = ApiClient.get(PATH + "/" + id);
        if (response.status() != 200) {
            throw new RuntimeException("Leave type not found: HTTP " + response.status());
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        if (data.has("deleted") && !data.get("deleted").isJsonNull()
                && data.get("deleted").getAsBoolean()) {
            throw new RuntimeException("Leave type not found: record is deleted");
        }
        return data.get("name").getAsString();
    }

    public static void updateLeaveType(int id, String newName) {
        JsonObject body = new JsonObject();
        body.addProperty("name", newName);
        body.addProperty("situational", false);

        APIResponse response = ApiClient.put(PATH + "/" + id,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to update leave type " + id
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    public static void deleteLeaveType(int id) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(id);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete leave type " + id
                    + ": HTTP " + response.status());
        }
    }
}
