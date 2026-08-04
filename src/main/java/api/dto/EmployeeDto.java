package api.dto;

public class EmployeeDto {

    public final String firstName;
    public final String middleName;
    public final String lastName;

    public EmployeeDto(String firstName, String lastName) {
        this.firstName = firstName;
        this.middleName = "";
        this.lastName = lastName;
    }
}
