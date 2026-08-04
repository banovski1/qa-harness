package api.dto;

public class JobTitleDto {
    public String name;
    public String description;
    public Integer jobGradeId;

    public JobTitleDto(String name) {
        this.name = name;
        this.description = "";
        this.jobGradeId = null;
    }
}
