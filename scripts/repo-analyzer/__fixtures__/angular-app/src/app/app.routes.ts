import {RouterModule} from '@angular/router';
import {AppRoutes} from './constant/url/AppRoutes';
import {OrderHistoryComponent} from './order-history.component';
import {UserCardComponent} from './user-card.component';

export const routes = [
  {path: '', component: UserCardComponent},
  {path: 'users/:userId', component: UserCardComponent, name: 'user-detail'},
  {path: AppRoutes.ORDERS, loadChildren: () => import('./order.routes').then(m => m.orderRoutes)},
  {path: AppRoutes.ORDER_HISTORY, component: OrderHistoryComponent},
  {path: AppRoutes.RUNTIME_PATH, component: UserCardComponent},
  {path: 'legacy', loadChildren: () => import('./legacy.module').then(m => m.LegacyModule)},
];

export const AppRoutingModule = RouterModule.forRoot(routes);
