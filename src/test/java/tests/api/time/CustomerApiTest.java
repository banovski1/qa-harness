package tests.api.time;

import api.services.CustomerService;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseApiTest;

@Feature("Time API")
public class CustomerApiTest extends BaseApiTest {

    private int createdCustomerId = -1;

    @Test
    @Story("List Customers")
    public void listCustomers_returns200() {
        com.microsoft.playwright.APIResponse response = api.ApiClient.get("/web/index.php/api/v2/time/customers");
        Assert.assertEquals(response.status(), 200, "Expected HTTP 200 for customers list");
    }

    @Test
    @Story("Create Customer")
    public void createCustomer_returnsValidId() {
        createdCustomerId = CustomerService.createCustomer("ApiTest Customer");
        Assert.assertTrue(createdCustomerId > 0,
                "Expected id > 0, got: " + createdCustomerId);
    }

    @Test
    @Story("Read Customer")
    public void getCustomer_returnsCorrectName() {
        createdCustomerId = CustomerService.createCustomer("ReadTest Customer");
        String name = CustomerService.getCustomer(createdCustomerId);
        Assert.assertEquals(name, "ReadTest Customer");
    }

    @Test
    @Story("Update Customer")
    public void updateCustomer_changesName() {
        createdCustomerId = CustomerService.createCustomer("Update Customer Original");
        CustomerService.updateCustomer(createdCustomerId, "Update Customer Modified");
        String name = CustomerService.getCustomer(createdCustomerId);
        Assert.assertEquals(name, "Update Customer Modified");
    }

    @Test
    @Story("Delete Customer")
    public void deleteCustomer_removesRecord() {
        createdCustomerId = CustomerService.createCustomer("Delete Customer");
        int idToDelete = createdCustomerId;
        CustomerService.deleteCustomer(idToDelete);

        try {
            CustomerService.getCustomer(idToDelete);
            Assert.fail("Expected exception for deleted customer " + idToDelete);
        } catch (RuntimeException e) {
            Assert.assertTrue(e.getMessage().contains("HTTP 4") || e.getMessage().contains("not found"),
                    "Unexpected error: " + e.getMessage());
        }
    }

}
