package tests.api.attendance;

import api.services.AttendanceService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("Attendance API")
public class AttendanceApiTest extends BaseApiTest {

    @Test
    @Story("Get Current Datetime")
    public void getCurrentDatetime_returns200() {
        String dateTime = AttendanceService.getCurrentDatetime();
        Assert.assertNotNull(dateTime, "Expected non-null datetime from API");
        Assert.assertFalse(dateTime.isEmpty(), "Expected non-empty datetime from API");
        // Format check: "yyyy-MM-dd HH:mm"
        Assert.assertTrue(dateTime.contains(" ") && dateTime.contains("-"),
                "Expected datetime in 'yyyy-MM-dd HH:mm' format, got: " + dateTime);
    }

    @Test
    @Story("Punch In")
    public void punchIn_createsAttendanceRecord() {
        String dateTime = AttendanceService.getCurrentDatetime();
        int recordId = AttendanceService.punchIn(dateTime, "ApiTest punch-in");
        Assert.assertTrue(recordId > 0,
                "Expected recordId > 0, got: " + recordId);
    }

    @Test
    @Story("Punch Out")
    public void punchOut_completesAttendanceRecord() {
        String punchInTime = AttendanceService.getCurrentDatetime();
        AttendanceService.punchIn(punchInTime, "ApiTest punch-in for out");

        String punchOutTime = AttendanceService.getCurrentDatetime();
        AttendanceService.punchOut(punchOutTime, "ApiTest punch-out");
    }
}
