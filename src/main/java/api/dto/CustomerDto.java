package api.dto;

public class CustomerDto {
    public String name;
    public String description;

    public CustomerDto(String name) {
        this.name = name;
        this.description = "";
    }
}
