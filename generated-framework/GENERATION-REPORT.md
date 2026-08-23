# Generation report

Generated from `ui-map-results/application-map` for `typescript`.

| | |
|---|---|
| Map files read | 13 |
| Page objects | 13 |
| Elements read | 427 |
| Skipped (no locator) | 0 |
| Shared navigation elements | 17 |
| Tables | 8 |
| Unstable locators | 0 |
| Accessors via component factory | 161 of 223 |

## Locator ownership

A factory accessor names only its label; the selector lives in the component,
from `locatorTemplates:` in the generator config. The rest keep the locator the
mapper verified, which is what a genuine one-off needs.

| Resolved by | Accessors |
|---|---|
| `MenuItemComponent.byLabel` | 47 |
| `InputComponent.byLabel` | 36 |
| `ButtonComponent.byLabel` | 25 |
| `DropdownComponent.byLabel` | 19 |
| `LinkComponent.byLabel` | 13 |
| `TextComponent.byHeading` | 13 |
| `InputComponent.textareaByLabel` | 4 |
| `RadioComponent.byLabel` | 4 |
| its own locator | 62 |

## Unstable locators

None.
