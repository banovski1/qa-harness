package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class AttendanceService {

    private static final String RECORDS_PATH = "/web/index.php/api/v2/attendance/records";
    private static final String DATETIME_PATH = "/web/index.php/api/v2/attendance/current-datetime";

    /**
     * Returns current server datetime as "yyyy-MM-dd HH:mm" string.
     * OrangeHRM returns utcDate and utcTime as separate fields.
     */
    public static String getCurrentDatetime() {
        APIResponse response = ApiClient.get(DATETIME_PATH);
        if (response.status() != 200) {
            throw new RuntimeException("Failed to get current datetime: HTTP " + response.status());
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("utcDate").getAsString() + " " + data.get("utcTime").getAsString();
    }

    /**
     * Punches in using a "yyyy-MM-dd HH:mm" datetime string.
     * Splits into date/time parts as required by the API.
     */
    public static int punchIn(String dateTime, String note) {
        String[] parts = dateTime.split(" ");
        JsonObject body = new JsonObject();
        body.addProperty("date", parts[0]);
        body.addProperty("time", parts[1]);
        body.addProperty("note", note);
        body.addProperty("timezoneName", "UTC");
        body.addProperty("timezoneOffset", 0);

        APIResponse response = ApiClient.post(RECORDS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to punch in: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    /**
     * Punches out using a "yyyy-MM-dd HH:mm" datetime string.
     */
    public static void punchOut(String dateTime, String note) {
        String[] parts = dateTime.split(" ");
        JsonObject body = new JsonObject();
        body.addProperty("date", parts[0]);
        body.addProperty("time", parts[1]);
        body.addProperty("note", note);
        body.addProperty("timezoneName", "UTC");
        body.addProperty("timezoneOffset", 0);

        APIResponse response = ApiClient.put(RECORDS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to punch out: HTTP " + response.status()
                    + " — " + response.text());
        }
    }

    public static void deleteAttendanceRecord(int id) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(id);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(RECORDS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete attendance record " + id
                    + ": HTTP " + response.status());
        }
    }
}
