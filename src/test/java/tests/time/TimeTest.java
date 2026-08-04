package tests.time;

import org.testng.annotations.Test;
import pages.TimePage;
import tests.BaseTest;

public class TimeTest extends BaseTest {

    @Test
    public void searchAndViewEmployeeTimesheet() {
        TimePage timePage = new TimePage(page);
        timePage.navigateToTime();
        timePage.searchForEmployee("Jean Krishna User");
        timePage.clickViewButton();
        timePage.clickViewButton();
    }
}
