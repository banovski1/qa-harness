package tests.api.performance;

import api.services.EmployeeService;
import api.services.PerformanceTrackerService;
import api.utils.SchemaValidator;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.assertions.PlaywrightAssertions;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("Performance API")
public class EmployeeTrackerApiTest extends BaseApiTest {

    // Instance-based service (Rule 3 — constructor injection)
    private PerformanceTrackerService trackerService;

    @BeforeClass(alwaysRun = true, dependsOnMethods = "setUpApi")
    public void setUpService() {
        trackerService = new PerformanceTrackerService();
    }

    // -------------------------------------------------------------------------
    // Happy-path: list all trackers — validates status, structure, and schema
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — returns 200, valid structure, and passes schema validation")
    public void listTrackers_returns200_andValidStructure() {
        // Arrange — no parameters needed for default list

        // Act
        APIResponse response = trackerService.listTrackers();

        // Assert
        String body = response.text();
        PlaywrightAssertions.assertThat(response).isOK();
        SchemaValidator.validate(body, "employee-tracker-list.schema.json");

        JsonObject parsed = JsonParser.parseString(body).getAsJsonObject();
        Assert.assertTrue(parsed.has("data"), "Response body must contain 'data' field");
        Assert.assertTrue(parsed.has("meta"), "Response body must contain 'meta' field");

        JsonObject meta = parsed.getAsJsonObject("meta");
        Assert.assertTrue(meta.has("total"), "'meta' must contain 'total' field");
    }

    // -------------------------------------------------------------------------
    // Happy-path: each tracker item has expected fields (seeded via guaranteed total)
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — each item contains id, title, and employee fields")
    public void listTrackers_eachItemHasRequiredFields() {
        // Arrange — assert at least one tracker exists so item-shape validation is meaningful
        int total = trackerService.getTrackerTotal();
        Assert.assertTrue(total > 0,
                "Pre-condition failed: expected at least 1 tracker in the system, got 0. "
                + "Seed a tracker via the admin UI or /api/v2/performance/config/trackers before running this test.");

        // Act
        APIResponse response = trackerService.listTrackers();

        // Assert
        String body = response.text();
        PlaywrightAssertions.assertThat(response).isOK();

        JsonArray data = JsonParser.parseString(body).getAsJsonObject().getAsJsonArray("data");
        JsonObject first = data.get(0).getAsJsonObject();
        Assert.assertTrue(first.has("id"),       "Tracker item must have 'id' field");
        Assert.assertTrue(first.has("title"),    "Tracker item must have 'title' field");
        Assert.assertTrue(first.has("employee"), "Tracker item must have 'employee' field");
    }

    // -------------------------------------------------------------------------
    // Happy-path: meta.total matches the number of items returned (default page)
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — meta.total equals the data array size on an unpaged request")
    public void listTrackers_metaTotalEqualsDataArraySize() {
        // Arrange — no parameters needed for default list

        // Act
        APIResponse response = trackerService.listTrackers();

        // Assert
        String body = response.text();
        PlaywrightAssertions.assertThat(response).isOK();

        JsonObject parsed  = JsonParser.parseString(body).getAsJsonObject();
        JsonArray  data    = parsed.getAsJsonArray("data");
        int        total   = parsed.getAsJsonObject("meta").get("total").getAsInt();

        Assert.assertEquals(total, data.size(),
                "meta.total must equal the number of items in the data array for an unpaged request. "
                + "total=" + total + ", data.size()=" + data.size());
    }

    // -------------------------------------------------------------------------
    // Pagination: limit=1 returns exactly 1 item when total > 0, else 0 items
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — pagination limit=1 returns exactly 1 item")
    public void listTrackers_withLimit1_returnsExactlyOneItem() {
        // Arrange
        int total = trackerService.getTrackerTotal();
        int expectedSize = total > 0 ? 1 : 0;

        // Act
        APIResponse response = trackerService.listTrackersWithPagination(1, 0);

        // Assert
        String body = response.text();
        PlaywrightAssertions.assertThat(response).isOK();

        JsonArray data = JsonParser.parseString(body).getAsJsonObject().getAsJsonArray("data");
        Assert.assertEquals(data.size(), expectedSize,
                "With limit=1 the data array must contain exactly " + expectedSize
                + " item(s), got: " + data.size());
    }

    // -------------------------------------------------------------------------
    // Sorting: sortField + sortOrder returns 200
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — sorting by trackerName ascending returns 200")
    public void listTrackers_sortedByTrackerName_returns200() {
        // Arrange — no extra state needed

        // Act
        APIResponse response = trackerService.listTrackersSorted("tracker.trackerName", "ASC");

        // Assert
        String body = response.text();
        PlaywrightAssertions.assertThat(response).isOK();

        JsonObject parsed = JsonParser.parseString(body).getAsJsonObject();
        Assert.assertTrue(parsed.has("data"),
                "Response must contain 'data' when sorting by trackerName ASC");
    }

    // -------------------------------------------------------------------------
    // Create tracker: POST /api/v2/performance/config/trackers returns a valid id
    // -------------------------------------------------------------------------

    @Test
    @Story("Create Performance Tracker — returns a valid id greater than zero")
    public void createTracker_returnsValidId() {
        // Arrange
        long suffix = System.currentTimeMillis();
        String trackerName = "AutoTracker-" + suffix;
        int empNumber = -1;
        int trackerId = -1;

        try {
            empNumber = EmployeeService.createEmployee("Tracker", "Employee-" + suffix);

            // Act — employee acts as their own reviewer (Admin empNumber=1 cannot be used
            // as reviewer for a newly created employee; self-review is accepted by the API)
            trackerId = PerformanceTrackerService.createTracker(trackerName, empNumber, empNumber);

            // Assert
            Assert.assertTrue(trackerId > 0,
                    "Expected tracker id > 0 after creation, got: " + trackerId);
        } finally {
            if (trackerId > 0) {
                try { PerformanceTrackerService.deleteTracker(trackerId); } catch (Exception ignored) {}
            }
            if (empNumber > 0) {
                try { EmployeeService.deleteEmployee(empNumber); } catch (Exception ignored) {}
            }
        }
    }

    // -------------------------------------------------------------------------
    // Delete tracker: DELETE /api/v2/performance/config/trackers returns 200
    // -------------------------------------------------------------------------

    @Test
    @Story("Delete Performance Tracker — deleting an existing tracker returns 200")
    public void deleteTracker_removesIt() {
        // Arrange
        long suffix = System.currentTimeMillis();
        int empNumber = EmployeeService.createEmployee("DelTracker", "Employee-" + suffix);
        int trackerId = -1;

        try {
            // Employee acts as their own reviewer — consistent with createTracker_returnsValidId
            trackerId = PerformanceTrackerService.createTracker(
                    "DeleteMe-" + suffix, empNumber, empNumber);

            // Act
            APIResponse deleteResponse = PerformanceTrackerService.deleteTrackerRaw(trackerId);

            // Assert
            Assert.assertEquals(deleteResponse.status(), 200,
                    "Expected HTTP 200 when deleting an existing tracker. Body: "
                            + deleteResponse.text());

            // Mark deleted so the finally block skips redundant cleanup
            trackerId = -1;
        } finally {
            if (trackerId > 0) {
                try { PerformanceTrackerService.deleteTracker(trackerId); } catch (Exception ignored) {}
            }
            try { EmployeeService.deleteEmployee(empNumber); } catch (Exception ignored) {}
        }
    }

    // -------------------------------------------------------------------------
    // Negative: out-of-range empNumber returns 422 with error body
    // -------------------------------------------------------------------------

    @Test
    @Story("List Employee Trackers — out-of-range empNumber returns 422 with error body")
    public void listTrackers_withOutOfRangeEmpNumber_returns422() {
        // Arrange — Integer.MAX_VALUE exceeds the valid empNumber range accepted by the API
        int outOfRangeEmpNumber = Integer.MAX_VALUE;

        // Act
        APIResponse response = trackerService.listTrackersByEmployee(outOfRangeEmpNumber);

        // Assert
        String body = response.text();
        Assert.assertEquals(response.status(), 422,
                "Expected HTTP 422 for out-of-range empNumber. Body: " + body);

        JsonObject parsed = JsonParser.parseString(body).getAsJsonObject();
        Assert.assertTrue(parsed.has("error"),
                "Error response must contain top-level 'error' field. Body: " + body);

        JsonObject error = parsed.getAsJsonObject("error");
        Assert.assertTrue(error.has("status"),
                "'error' object must contain 'status' field. Body: " + body);
        Assert.assertTrue(error.has("message"),
                "'error' object must contain 'message' field. Body: " + body);
    }
}
