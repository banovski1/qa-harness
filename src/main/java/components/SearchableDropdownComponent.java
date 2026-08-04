package components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.assertions.LocatorAssertions;
import com.microsoft.playwright.options.AriaRole;

import java.util.regex.Pattern;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class SearchableDropdownComponent {

    private static final double SUGGESTION_TIMEOUT_MS = 15000;

    private final Page page;

    public SearchableDropdownComponent(Page page) {
        this.page = page;
    }

    /** Types the hint, picks the first real suggestion, and returns the value it resolved to. */
    public String selectFirst(String label, String searchValue) {
        Locator hintBox = group(label).getByRole(AriaRole.TEXTBOX);
        hintBox.click();
        // fill() does not trigger this widget's keydown-driven async search.
        hintBox.pressSequentially(searchValue);

        // The async search renders a transient "Searching...." placeholder with role=option.
        Locator suggestion = page.getByRole(AriaRole.OPTION)
            .filter(new Locator.FilterOptions().setHasText(Pattern.compile("^(?!Searching).+")))
            .first();
        assertThat(suggestion).isVisible(
            new LocatorAssertions.IsVisibleOptions().setTimeout(SUGGESTION_TIMEOUT_MS));

        String resolved = suggestion.innerText().trim();
        suggestion.click();
        return resolved;
    }

    // OrangeHRM renders labels as siblings, not <label for=...>, so getByLabel cannot see them.
    private Locator group(String label) {
        return page.locator(".oxd-input-group").filter(new Locator.FilterOptions()
            .setHas(page.getByText(label, new Page.GetByTextOptions().setExact(true))));
    }
}
