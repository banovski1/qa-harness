package tests.pim;

import api.services.EmployeeService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.PIMPage;
import tests.BaseTest;

@Feature("PIM")
public class PIMTest extends BaseTest {

    private int apiCreatedEmpNumber = -1;

    // -----------------------------------------------------------------------
    // Existing UI-only test
    // -----------------------------------------------------------------------

    @Test
    @Story("Search Employee")
    public void searchEmployeeByEmploymentStatus() {
        PIMPage pimPage = new PIMPage(page);
        pimPage.navigateToPIM();
        pimPage.searchByEmploymentStatus("Full-Time Contract");
        pimPage.clickSearchButton();
        pimPage.assertEmployeeDetails("0042", "Rebecca", "Harmony", "QA Engineer", "Full-Time Contract", "Quality Assurance");
    }

    @Test
    @Story("Search Employee")
    public void searchEmployeeWithNoMatchesShowsNoRecordsFound() {
        PIMPage pimPage = new PIMPage(page);
        pimPage.navigateToPIM();
        pimPage.clickSearchButton();
        pimPage.assertNoRecordsFound();
    }

    // -----------------------------------------------------------------------
    // API precondition + UI verification + API cleanup
    // -----------------------------------------------------------------------

    @BeforeMethod(onlyForGroups = "api-precondition")
    public void createEmployeeViaApi() {
        apiCreatedEmpNumber = EmployeeService.createEmployee("ApiSetup", "TestEmployee");
    }

    @Test(groups = "api-precondition")
    @Story("API Precondition")
    public void verifyApiCreatedEmployeeAppearsInPim() {
        PIMPage pimPage = new PIMPage(page);
        pimPage.navigateToPIM();
        pimPage.searchByName("ApiSetup");
        pimPage.clickSearchButton();
        pimPage.assertEmployeeNameInTable("ApiSetup", "TestEmployee");
    }

}
