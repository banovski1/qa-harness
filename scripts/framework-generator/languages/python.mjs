// Python scaffold: pytest + pytest-playwright.

import { makeScaffold } from './scaffold.mjs';

export const python = makeScaffold({
  id: 'python',
  displayName: 'Python',
  extension: '.py',
  emptyDirs: ['src/data/factories', 'src/data/test_data', 'src/api/clients', 'tests/e2e'],
  layoutNotes: [
    '- `src/components/` — reusable component library',
    '- `src/pages/` — page objects, composed of components',
    '- `tests/e2e/` — specs; `conftest.py` holds fixtures',
  ].join('\n'),
  gettingStarted: 'python -m venv .venv && .venv/Scripts/activate\npip install -r requirements.txt\nplaywright install chromium\npytest',
  files: (context) => [
    { path: 'requirements.txt', contents: REQUIREMENTS, kind: 'protected' },
    { path: 'pytest.ini', contents: PYTEST_INI, kind: 'protected' },
    { path: 'conftest.py', contents: CONFTEST, kind: 'protected' },
    { path: 'src/__init__.py', contents: '', kind: 'generated' },
    { path: 'src/components/__init__.py', contents: '', kind: 'generated' },
    { path: 'src/components/base_component.py', contents: BASE_COMPONENT, kind: 'generated' },
    { path: 'src/pages/__init__.py', contents: '', kind: 'generated' },
    { path: 'src/pages/base_page.py', contents: BASE_PAGE, kind: 'generated' },
  ],
});

const REQUIREMENTS = `pytest==8.3.4
pytest-playwright==0.6.2
python-dotenv==1.0.1
`;

const PYTEST_INI = `[pytest]
testpaths = tests
addopts = --browser chromium
`;

const CONFTEST = `"""Shared fixtures. Page objects get their own fixtures here once generated."""

import os

import pytest
from dotenv import load_dotenv

load_dotenv()


@pytest.fixture(scope="session")
def base_url() -> str:
    url = os.getenv("BASE_URL")
    if not url:
        raise RuntimeError("Missing BASE_URL. Copy .env.example to .env and fill it in.")
    return url
`;

const BASE_COMPONENT = `"""Base class for every UI component."""

from playwright.sync_api import Locator


class BaseComponent:
    """Everything a UI component shares: a locator and a readable description.

    A component never receives the Page, only its own Locator, so it can be
    re-scoped inside another component without changing its code.
    """

    def __init__(self, locator: Locator, description: str) -> None:
        self.locator = locator
        self.description = description

    def wait_for_visible(self, timeout: float | None = None) -> None:
        self.locator.wait_for(state="visible", timeout=timeout)

    def is_visible(self) -> bool:
        return self.locator.is_visible()

    def is_enabled(self) -> bool:
        return self.locator.is_enabled()

    def text(self) -> str:
        return self.locator.inner_text().strip()

    def scroll_into_view(self) -> None:
        self.locator.scroll_into_view_if_needed()
`;

const BASE_PAGE = `"""Base class for every page object."""

from playwright.sync_api import Page


class BasePage:
    """Common page-object behaviour: navigation and readiness.

    Element access belongs in the subclass, so this stays small and stable.
    """

    def __init__(self, page: Page, path: str) -> None:
        self.page = page
        self.path = path

    def goto(self) -> None:
        """Navigate to this page's own path, relative to the configured base URL."""
        self.page.goto(self.path)
        self.wait_until_ready()

    def wait_until_ready(self) -> None:
        """Wait for the page to settle.

        "load" rather than "networkidle" on purpose: apps with polling or open
        sockets never reach network idle and the wait would hang until timeout.
        """
        self.page.wait_for_load_state("load")

    @property
    def url(self) -> str:
        return self.page.url
`;
