package api.dto;

public class UserDto {

    public final String username;
    public final String password;
    public final int userRoleId;
    public final int empNumber;
    public final boolean status;

    public UserDto(String username, String password, int userRoleId, int empNumber) {
        this.username = username;
        this.password = password;
        this.userRoleId = userRoleId;
        this.empNumber = empNumber;
        this.status = true;
    }
}
