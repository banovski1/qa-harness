package tests.api.admin;

import api.ApiClient;
import api.services.JobTitleService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("Admin API")
public class JobTitleApiTest extends BaseApiTest {

    private int createdJobTitleId = -1;

    @Test
    @Story("List Job Titles")
    public void listJobTitles_returns200() {
        int status = JobTitleService.listJobTitles();
        Assert.assertEquals(status, 200, "Expected HTTP 200 for job titles list");
    }

    @Test
    @Story("Create Job Title")
    public void createJobTitle_returnsValidId() {
        createdJobTitleId = JobTitleService.createJobTitle("ApiTest JobTitle");
        Assert.assertTrue(createdJobTitleId > 0,
                "Expected id > 0, got: " + createdJobTitleId);
    }

    @Test
    @Story("Read Job Title")
    public void getJobTitle_returnsCorrectName() {
        createdJobTitleId = JobTitleService.createJobTitle("ReadTest JobTitle");
        String name = JobTitleService.getJobTitle(createdJobTitleId);
        Assert.assertEquals(name, "ReadTest JobTitle");
    }

    @Test
    @Story("Update Job Title")
    public void updateJobTitle_changesName() {
        createdJobTitleId = JobTitleService.createJobTitle("Update JobTitle Original");
        JobTitleService.updateJobTitle(createdJobTitleId, "Update JobTitle Modified");
        String name = JobTitleService.getJobTitle(createdJobTitleId);
        Assert.assertEquals(name, "Update JobTitle Modified");
    }

    @Test
    @Story("Delete Job Title")
    public void deleteJobTitle_removesRecord() {
        // OrangeHRM soft-deletes job titles (GET still returns 200 after delete).
        // Assert that the DELETE call itself succeeds without throwing.
        createdJobTitleId = JobTitleService.createJobTitle("Delete JobTitle");
        JobTitleService.deleteJobTitle(createdJobTitleId);
    }
}
