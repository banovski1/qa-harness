package api.services;

import api.ApiClient;
import api.dto.UserDto;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

public class UserService {

    private static final String USERS_PATH = "/web/index.php/api/v2/admin/users";

    /**
     * Creates a system user and returns their id.
     * userRoleId: 1 = Admin, 2 = ESS
     */
    public static int createUser(String username, String password, int userRoleId, int empNumber) {
        UserDto dto = new UserDto(username, password, userRoleId, empNumber);
        JsonObject body = new JsonObject();
        body.addProperty("username", dto.username);
        body.addProperty("password", dto.password);
        body.addProperty("userRoleId", dto.userRoleId);
        body.addProperty("empNumber", dto.empNumber);
        body.addProperty("status", dto.status);

        APIResponse response = ApiClient.post(USERS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to create user: HTTP " + response.status()
                    + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    /**
     * Returns the username of a user by id.
     */
    public static String getUsername(int userId) {
        APIResponse response = ApiClient.get(USERS_PATH + "/" + userId);
        if (response.status() != 200) {
            throw new RuntimeException("User not found: " + userId);
        }
        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("userName").getAsString();
    }

    /**
     * Deletes a system user by id.
     */
    public static void deleteUser(int userId) {
        JsonObject body = new JsonObject();
        JsonArray ids = new JsonArray();
        ids.add(userId);
        body.add("ids", ids);

        APIResponse response = ApiClient.delete(USERS_PATH,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to delete user " + userId
                    + ": HTTP " + response.status());
        }
    }
}
