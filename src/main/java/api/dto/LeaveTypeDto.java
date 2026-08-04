package api.dto;

public class LeaveTypeDto {
    public String name;
    public boolean situational;

    public LeaveTypeDto(String name) {
        this.name = name;
        this.situational = false;
    }
}
