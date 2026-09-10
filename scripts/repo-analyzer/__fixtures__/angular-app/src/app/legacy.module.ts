import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {legacyRoutes} from './legacy-routes';

// The older lazy shape, which more than a hundred of the app-under-test's routes still use: the
// loadChildren target declares no routes itself and only hands a sibling file's array to forChild.
@NgModule({imports: [RouterModule.forChild(legacyRoutes)]})
export class LegacyModule {}
