package tests.admin;

import api.services.UserService;
import components.TableComponent;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.AdminPage;
import tests.BaseTest;

import java.util.Arrays;

@Feature("Admin")
public class AdminTest extends BaseTest {

    private int apiCreatedUserId = -1;

    // -----------------------------------------------------------------------
    // Existing UI-only tests
    // -----------------------------------------------------------------------

    @Test
    @Story("Search User")
    public void searchForAdmin() {
        new AdminPage(page).searchForAdmin();
        new TableComponent(page).assertFirstDataRow(
            Arrays.asList("Admin", "Admin", "Abhi yadav", "Enabled")
        );
    }

    @Test
    @Story("Search User")
    public void searchForAdminAndReset() {
        AdminPage adminPage = new AdminPage(page);
        adminPage.searchForAdminESS();
        adminPage.clickResetButton();
    }

    // -----------------------------------------------------------------------
    // API precondition + UI verification + API cleanup
    // -----------------------------------------------------------------------

    @BeforeMethod(onlyForGroups = "api-precondition")
    public void createUserViaApi() {
        String username = "apiadmin_" + System.currentTimeMillis();
        // empNumber 1 is the built-in OrangeHRM Admin employee — always exists
        apiCreatedUserId = UserService.createUser(username, "Admin@1234", 2, 1);
    }

    @Test(groups = "api-precondition")
    @Story("API Precondition")
    public void verifyApiCreatedUserAppearsInAdmin() {
        String username = UserService.getUsername(apiCreatedUserId);
        AdminPage adminPage = new AdminPage(page);
        adminPage.searchByUsername(username);
        new TableComponent(page).assertFirstDataRow(Arrays.asList(username));
    }

}
