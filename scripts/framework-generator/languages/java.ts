// Java scaffold: Maven + playwright-java + JUnit 5.

import { makeScaffold } from './scaffold.js';

const PKG = 'com/example/framework';

export const java = makeScaffold({
  id: 'java',
  displayName: 'Java',
  extension: '.java',
  emptyDirs: [
    `src/main/java/${PKG}/components`,
    `src/main/java/${PKG}/pages`,
    `src/main/java/${PKG}/fixtures`,
    `src/main/java/${PKG}/data`,
    `src/main/java/${PKG}/api`,
    `src/main/java/${PKG}/utils`,
    'src/test/java/tests/e2e',
    'src/test/resources',
  ],
  layoutNotes: [
    '- `src/main/java/com/example/framework/components/` — reusable component library',
    '- `src/main/java/com/example/framework/pages/` — page objects, composed of components',
    '- `src/test/java/tests/` — specs',
  ].join('\n'),
  gettingStarted: 'mvn -q compile\nmvn test',
  files: (context) => [
    { path: 'pom.xml', contents: pom(context.config.projectName), kind: 'protected' },
    { path: `src/main/java/${PKG}/components/BaseComponent.java`, contents: BASE_COMPONENT, kind: 'generated' },
    { path: `src/main/java/${PKG}/pages/BasePage.java`, contents: BASE_PAGE, kind: 'generated' },
  ],
});

function pom(projectName: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>${projectName}</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.microsoft.playwright</groupId>
      <artifactId>playwright</artifactId>
      <version>1.49.0</version>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.11.3</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.2</version>
      </plugin>
    </plugins>
  </build>
</project>
`;
}

const BASE_COMPONENT = `package com.example.framework.components;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.WaitForSelectorState;

/**
 * Everything a UI component shares: a Locator and a human-readable description.
 * A component never receives the Page, only its own Locator, so it can be
 * re-scoped inside another component without changing its code.
 */
public abstract class BaseComponent {

    protected final Locator locator;
    protected final String description;

    protected BaseComponent(Locator locator, String description) {
        this.locator = locator;
        this.description = description;
    }

    public Locator locator() {
        return locator;
    }

    public String description() {
        return description;
    }

    public void waitForVisible() {
        locator.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
    }

    public boolean isVisible() {
        return locator.isVisible();
    }

    public boolean isEnabled() {
        return locator.isEnabled();
    }

    public String text() {
        return locator.innerText().trim();
    }

    public void scrollIntoView() {
        locator.scrollIntoViewIfNeeded();
    }
}
`;

const BASE_PAGE = `package com.example.framework.pages;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.LoadState;

/**
 * Common page-object behaviour: navigation and readiness. Element access belongs
 * in the subclass, so this stays small and stable.
 */
public abstract class BasePage {

    protected final Page page;
    protected final String path;

    protected BasePage(Page page, String path) {
        this.page = page;
        this.path = path;
    }

    /** Navigate to this page's own path, relative to the configured base URL. */
    public void goTo() {
        page.navigate(path);
        waitUntilReady();
    }

    /**
     * Wait for the page to settle. LOAD rather than NETWORKIDLE on purpose: apps
     * with polling or open sockets never reach network idle and the wait would
     * hang until the test times out.
     */
    public void waitUntilReady() {
        page.waitForLoadState(LoadState.LOAD);
    }

    public String url() {
        return page.url();
    }
}
`;
