package api.services;

import api.ApiClient;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.options.RequestOptions;

/**
 * Service methods for the Leave/Leave Comment endpoints:
 *   GET  /web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments
 *   POST /web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments
 */
public class LeaveCommentService {

    private static final String LEAVE_COMMENTS_PATH_TEMPLATE =
            "/web/index.php/api/v2/leave/leaves/%d/leave-comments";

    /**
     * Posts a comment on an individual leave record.
     *
     * @param leaveId the individual leave record id (not the leaveRequestId)
     * @param comment the comment text to post
     * @return the created comment's id
     */
    public static int postComment(int leaveId, String comment) {
        JsonObject body = new JsonObject();
        body.addProperty("comment", comment);

        String path = String.format(LEAVE_COMMENTS_PATH_TEMPLATE, leaveId);
        APIResponse response = ApiClient.post(path,
                RequestOptions.create()
                        .setHeader("Content-Type", "application/json")
                        .setData(body.toString()));

        if (response.status() != 200) {
            throw new RuntimeException("Failed to post comment on leaveId=" + leaveId
                    + ": HTTP " + response.status() + " — " + response.text());
        }

        JsonObject data = JsonParser.parseString(response.text())
                .getAsJsonObject().getAsJsonObject("data");
        return data.get("id").getAsInt();
    }

    /**
     * Lists all comments for an individual leave record.
     *
     * @param leaveId the individual leave record id
     * @return the raw APIResponse (caller asserts status before accessing body)
     */
    public static APIResponse listComments(int leaveId) {
        String path = String.format(LEAVE_COMMENTS_PATH_TEMPLATE, leaveId);
        return ApiClient.get(path);
    }

    /**
     * Lists comments for a leave record, returning the raw APIResponse.
     * Intended for negative-path tests (e.g. non-existent leaveId → 404).
     *
     * @param leaveId any integer id, including non-existent ones
     * @return the raw APIResponse
     */
    public static APIResponse listCommentsRaw(int leaveId) {
        String path = String.format(LEAVE_COMMENTS_PATH_TEMPLATE, leaveId);
        return ApiClient.get(path);
    }
}
