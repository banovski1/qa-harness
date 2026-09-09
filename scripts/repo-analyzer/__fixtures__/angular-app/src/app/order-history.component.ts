import {Component} from '@angular/core';

// The `templateUrl:` branch of `parseAngular` — 1601 of the app-under-test's 1657 components use
// it, and it was untested for elements until this fixture. `templateUrl` resolves relative to
// this file's own directory (`parsers.ts:393-395`), so the sibling `.html` lives right beside it.
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
})
export class OrderHistoryComponent {}
