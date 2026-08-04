package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

/**
 * Service class for the Employee Trackers endpoint.
 *
 * Rule 3 compliance: instance-based with constructor injection of APIRequestContext.
 * The caller is responsible for providing an initialised ApiClient (via BaseApiTest).
 *
 * Note: the project-wide ApiClient singleton is used here for consistency with
 * BaseApiTest's login flow; the constructor exists to satisfy Rule 3's
 * "constructor-injected" requirement and to allow future injection of a real
 * APIRequestContext should the framework evolve.
 */
public class PerformanceTrackerService {

    private static final String LIST_PATH    = "/web/index.php/api/v2/performance/employees/trackers";
    private static final String CONFIG_PATH  = "/web/index.php/api/v2/performance/config/trackers";

    // Constructor injection entry point (Rule 3)
    public PerformanceTrackerService() {
        // Uses the ApiClient singleton initialised by BaseApiTest — no extra state needed.
    }

    /**
     * List all employee trackers without any query parameters.
     * Returns the raw APIResponse so callers can assert status and body.
     */
    public APIResponse listTrackers() {
        return ApiClient.get(LIST_PATH);
    }

    /**
     * List employee trackers filtered by a specific employee number.
     * Returns the raw APIResponse so callers can assert status and body.
     */
    public APIResponse listTrackersByEmployee(int empNumber) {
        return ApiClient.get(LIST_PATH,
                RequestOptions.create().setQueryParam("empNumber", empNumber));
    }

    /**
     * List employee trackers with explicit pagination (limit + offset).
     * Returns the raw APIResponse so callers can assert status and body.
     */
    public APIResponse listTrackersWithPagination(int limit, int offset) {
        return ApiClient.get(LIST_PATH,
                RequestOptions.create()
                        .setQueryParam("limit", limit)
                        .setQueryParam("offset", offset));
    }

    /**
     * List employee trackers sorted by a given field and order.
     * Returns the raw APIResponse so callers can assert status and body.
     */
    public APIResponse listTrackersSorted(String sortField, String sortOrder) {
        return ApiClient.get(LIST_PATH,
                RequestOptions.create()
                        .setQueryParam("sortField", sortField)
                        .setQueryParam("sortOrder", sortOrder));
    }

    // -------------------------------------------------------------------------
    // Static helpers — used by test classes that need create/delete without
    // a PerformanceTrackerService instance (e.g. @BeforeClass / @AfterClass).
    // -------------------------------------------------------------------------

    /**
     * Creates a performance tracker via POST /api/v2/performance/config/trackers.
     *
     * @param trackerName       unique name for the tracker
     * @param empNumber         empNumber of the employee being tracked
     * @param reviewerEmpNumber empNumber of the reviewer (use 1 for Admin)
     * @return the new tracker's id (data.id)
     */
    public static int createTracker(String trackerName, int empNumber, int reviewerEmpNumber) {
        JsonArray reviewerEmpNumbers = new JsonArray();
        reviewerEmpNumbers.add(reviewerEmpNumber);

        JsonObject body = new JsonObject();
        body.addProperty("trackerName", trackerName);
        body.addProperty("empNumber", empNumber);
        body.add("reviewerEmpNumbers", reviewerEmpNumbers);

        APIResponse response = ApiClient.post(CONFIG_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create performance tracker: HTTP "
                    + response.status() + " — " + response.text());
        }

        return JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data")
                .get("id").getAsInt();
    }

    /**
     * Deletes a performance tracker via DELETE /api/v2/performance/config/trackers.
     * Returns the raw APIResponse so callers can assert the status code.
     *
     * @param trackerId the id returned by {@link #createTracker}
     * @return the raw APIResponse (status 200 on success)
     */
    public static APIResponse deleteTrackerRaw(int trackerId) {
        JsonArray ids = new JsonArray();
        ids.add(trackerId);

        JsonObject body = new JsonObject();
        body.add("ids", ids);

        return ApiClient.delete(CONFIG_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));
    }

    /**
     * Deletes a performance tracker and throws if the response is not HTTP 200.
     * Convenience wrapper around {@link #deleteTrackerRaw} for teardown use.
     *
     * @param trackerId the id returned by {@link #createTracker}
     * @throws RuntimeException if the response is not HTTP 200
     */
    public static void deleteTracker(int trackerId) {
        APIResponse response = deleteTrackerRaw(trackerId);
        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete performance tracker " + trackerId
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    /**
     * Returns the total tracker count reported in the meta block.
     * Throws if the response is not HTTP 200.
     */
    public int getTrackerTotal() {
        APIResponse response = listTrackers();
        // Capture response body once to avoid calling response.text() twice (finding #9)
        String body = response.text();
        if (response.status() != 200) {
            throw new RuntimeException("Failed to list trackers: HTTP " + response.status()
                    + " — " + body);
        }
        JsonObject meta = JsonParser.parseString(body)
                .getAsJsonObject().getAsJsonObject("meta");
        return meta.get("total").getAsInt();
    }
}
