package tests.api.employee;

import api.services.EmployeeService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("PIM API")
public class EmployeeApiTest extends BaseApiTest {

    private int createdEmpNumber = -1;

    // --- CREATE ---

    @Test
    @Story("Create Employee")
    public void createEmployee_returnsValidEmpNumber() {
        createdEmpNumber = EmployeeService.createEmployee("ApiTest", "Employee");
        Assert.assertTrue(createdEmpNumber > 0,
                "Expected empNumber > 0, got: " + createdEmpNumber);
    }

    // --- READ ---

    @Test
    @Story("Read Employee")
    public void getEmployee_returnsCorrectFullName() {
        createdEmpNumber = EmployeeService.createEmployee("ReadTest", "User");
        String fullName = EmployeeService.getEmployeeFullName(createdEmpNumber);
        Assert.assertEquals(fullName, "ReadTest User");
    }

    // --- UPDATE ---

    @Test
    @Story("Update Employee")
    public void updateEmployee_changesLastName() {
        createdEmpNumber = EmployeeService.createEmployee("UpdateTest", "OriginalName");
        EmployeeService.updateEmployeeLastName(createdEmpNumber, "ModifiedName");
        String fullName = EmployeeService.getEmployeeFullName(createdEmpNumber);
        Assert.assertTrue(fullName.contains("ModifiedName"),
                "Expected last name to be ModifiedName, got: " + fullName);
    }

    // --- DELETE ---

    @Test
    @Story("Delete Employee")
    public void deleteEmployee_removesEmployee() {
        createdEmpNumber = EmployeeService.createEmployee("DeleteTest", "User");
        int empToDelete = createdEmpNumber;
        EmployeeService.deleteEmployee(empToDelete);

        // Verify: reading back should no longer return this employee
        // (OrangeHRM returns 404 or error for deleted employees)
        try {
            EmployeeService.getEmployeeFullName(empToDelete);
            Assert.fail("Expected exception for deleted employee " + empToDelete);
        } catch (RuntimeException e) {
            Assert.assertTrue(e.getMessage().contains("Employee not found")
                            || e.getMessage().contains("HTTP 4"),
                    "Unexpected error: " + e.getMessage());
        }
    }

}
