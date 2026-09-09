import {Routes} from '@angular/router';
import {AppRoutes} from './constant/url/AppRoutes';
import {OrderFormComponent} from './order-form.component';
import {OrderHistoryComponent} from './order-history.component';

export const orderRoutes: Routes = [
	{path: '', component: OrderHistoryComponent},
	{path: AppRoutes.ADD, component: OrderFormComponent},
	{path: `view/:orderId`, component: OrderFormComponent},
	// A ring straight back to this file: the branch guard has to stop here rather than recurse.
	{path: 'nested', loadChildren: () => import('./order.routes').then(m => m.orderRoutes)},
];
