package api.services;

import api.ApiClient;
import api.dto.EmployeeDto;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class EmployeeService {

    private static final String EMPLOYEES_PATH = "/web/index.php/api/v2/pim/employees";

    /**
     * Creates an employee via API and returns their empNumber.
     */
    public static int createEmployee(String firstName, String lastName) {
        EmployeeDto dto = new EmployeeDto(firstName, lastName);
        JsonObject body = new JsonObject();
        body.addProperty("firstName", dto.firstName);
        body.addProperty("middleName", dto.middleName);
        body.addProperty("lastName", dto.lastName);

        APIResponse response = ApiClient.post(EMPLOYEES_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create employee: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("empNumber").getAsInt();
    }

    /**
     * Returns the full name of an employee, e.g. "John Doe".
     */
    public static String getEmployeeFullName(int empNumber) {
        APIResponse response = ApiClient.get(EMPLOYEES_PATH + "/" + empNumber);
        if (response.status() != 200) {
            throw new RuntimeException("Employee not found: " + empNumber);
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("firstName").getAsString() + " " + data.get("lastName").getAsString();
    }

    /**
     * Updates the last name of an employee via personal-details endpoint.
     * Fetches the current firstName first, as the API requires it to be non-empty.
     */
    public static void updateEmployeeLastName(int empNumber, String newLastName) {
        // GET current personal details to preserve existing firstName
        APIResponse getResp = ApiClient.get(EMPLOYEES_PATH + "/" + empNumber + "/personal-details");
        if (getResp.status() != 200) {
            throw new RuntimeException("Could not fetch personal details for employee " + empNumber
                    + ": HTTP " + getResp.status());
        }
        JsonObject existing = JsonParser.parseString(getResp.text())
                .getAsJsonObject().getAsJsonObject("data");
        String firstName = existing.get("firstName").getAsString();
        String middleName = existing.has("middleName") && !existing.get("middleName").isJsonNull()
                ? existing.get("middleName").getAsString() : "";

        JsonObject body = new JsonObject();
        body.addProperty("lastName", newLastName);
        body.addProperty("firstName", firstName);
        body.addProperty("middleName", middleName);

        APIResponse response = ApiClient.put(
                EMPLOYEES_PATH + "/" + empNumber + "/personal-details",
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to update employee " + empNumber
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    /**
     * Deletes an employee by empNumber.
     */
    public static void deleteEmployee(int empNumber) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(empNumber);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(EMPLOYEES_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete employee " + empNumber
                    + ": HTTP " + response.status());
        }
    }
}
