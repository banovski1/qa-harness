package components;

import com.microsoft.playwright.Page;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TextComponent {

    private final Page page;

    public TextComponent(Page page) {
        this.page = page;
    }

    public void assertVisible(String text) {
        assertThat(page.getByText(text)).isVisible();
    }
}
