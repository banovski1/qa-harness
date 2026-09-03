# Generation report

Generated from `ui-map-results/application-map` for `typescript`.

| | |
|---|---|
| Map files read | 93 |
| Page objects | 92 |
| Elements read | 2658 |
| Skipped (no locator) | 0 |
| Shared navigation elements | 16 |
| Tables | 56 |
| Unstable locators | 0 |
| Accessors via component factory | 761 of 1179 |

## API layer

Generated from `ui-map-results/api-map`.

| | |
|---|---|
| Resources | 143 |
| Operations | 491 |
| Dropped fields | 575 |
| Source(s) | openapi |

## Locator ownership

A factory accessor names only its label; the selector lives in the component,
from `locatorTemplates:` in the generator config. The rest keep the locator the
mapper verified, which is what a genuine one-off needs.

| Resolved by | Accessors |
|---|---|
| `TextComponent.byHeading` | 207 |
| `MenuItemComponent.byLabel` | 187 |
| `InputComponent.byLabel` | 131 |
| `ButtonComponent.byLabel` | 118 |
| `DropdownComponent.byLabel` | 88 |
| `LinkComponent.byLabel` | 13 |
| `InputComponent.textareaByLabel` | 13 |
| `RadioComponent.byLabel` | 4 |
| its own locator | 418 |

## Unstable locators

None.
