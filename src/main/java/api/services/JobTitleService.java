package api.services;

import api.ApiClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class JobTitleService {

    private static final String PATH = "/web/index.php/api/v2/admin/job-titles";

    public static int createJobTitle(String name) {
        JsonObject body = new JsonObject();
        body.addProperty("title", name);
        body.addProperty("description", "");
        body.addProperty("note", "");

        APIResponse response = ApiClient.post(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create job title: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    public static String getJobTitle(int id) {
        APIResponse response = ApiClient.get(PATH + "/" + id);
        if (response.status() != 200) {
            throw new RuntimeException("Job title not found: HTTP " + response.status());
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("title").getAsString();
    }

    public static void updateJobTitle(int id, String newName) {
        JsonObject body = new JsonObject();
        body.addProperty("title", newName);
        body.addProperty("description", "");
        body.addProperty("note", "");

        APIResponse response = ApiClient.put(PATH + "/" + id,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to update job title " + id
                    + ": HTTP " + response.status() + " — " + response.text());
        }
    }

    public static void deleteJobTitle(int id) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(id);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete job title " + id
                    + ": HTTP " + response.status());
        }
    }

    public static int listJobTitles() {
        APIResponse response = ApiClient.get(PATH);
        if (response.status() != 200) {
            throw new RuntimeException("Failed to list job titles: HTTP " + response.status());
        }
        return response.status();
    }
}
