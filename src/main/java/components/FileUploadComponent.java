package components;

import com.microsoft.playwright.Page;

import java.nio.file.Paths;

public class FileUploadComponent {

    private final Page page;

    public FileUploadComponent(Page page) {
        this.page = page;
    }

    public void upload(String label, String filePath) {
        page.locator("input[type='file']").setInputFiles(Paths.get(filePath));
    }
}
