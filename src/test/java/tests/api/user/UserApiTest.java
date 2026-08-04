package tests.api.user;

import api.services.UserService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("Admin API")
public class UserApiTest extends BaseApiTest {

    // empNumber 1 is the built-in OrangeHRM Admin — always exists
    private static final int EXISTING_EMP_NUMBER = 1;
    private static final String TEST_PASSWORD = "Admin@1234";

    private int createdUserId = -1;

    // --- CREATE ---

    @Test
    @Story("Create User")
    public void createUser_returnsValidId() {
        String username = "apitest_" + System.currentTimeMillis();
        createdUserId = UserService.createUser(username, TEST_PASSWORD, 2, EXISTING_EMP_NUMBER);
        Assert.assertTrue(createdUserId > 0,
                "Expected userId > 0, got: " + createdUserId);
    }

    // --- READ ---

    @Test
    @Story("Read User")
    public void getUser_returnsCorrectUsername() {
        String username = "readtest_" + System.currentTimeMillis();
        createdUserId = UserService.createUser(username, TEST_PASSWORD, 2, EXISTING_EMP_NUMBER);
        String fetchedUsername = UserService.getUsername(createdUserId);
        Assert.assertEquals(fetchedUsername, username);
    }

    // --- DELETE ---

    @Test
    @Story("Delete User")
    public void deleteUser_removesUser() {
        String username = "deltest_" + System.currentTimeMillis();
        createdUserId = UserService.createUser(username, TEST_PASSWORD, 2, EXISTING_EMP_NUMBER);
        int userToDelete = createdUserId;
        UserService.deleteUser(userToDelete);

        try {
            UserService.getUsername(userToDelete);
            Assert.fail("Expected exception for deleted user " + userToDelete);
        } catch (RuntimeException e) {
            Assert.assertTrue(e.getMessage().contains("User not found")
                            || e.getMessage().contains("HTTP 4"),
                    "Unexpected error: " + e.getMessage());
        }
    }

}
