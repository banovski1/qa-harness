package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class CustomerService {

    private static final String PATH = "/web/index.php/api/v2/time/customers";

    public static int createCustomer(String name) {
        JsonObject body = new JsonObject();
        body.addProperty("name", name);
        body.addProperty("description", "");

        APIResponse response = ApiClient.post(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create customer: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    public static String getCustomer(int id) {
        APIResponse response = ApiClient.get(PATH + "/" + id);
        if (response.status() != 200) {
            throw new RuntimeException("Customer not found: HTTP " + response.status());
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("name").getAsString();
    }

    public static void updateCustomer(int id, String newName) {
        JsonObject body = new JsonObject();
        body.addProperty("name", newName);
        body.addProperty("description", "");

        APIResponse response = ApiClient.put(PATH + "/" + id,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to update customer " + id
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    public static void deleteCustomer(int id) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(id);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete customer " + id
                    + ": HTTP " + response.status());
        }
    }
}
