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
  // A refused path with something under it, so the refusal is *visible*: `/computed` survives and
  // nothing below it does. Degrade the resolver to '' and `/computed/leaf` appears; loosen it to
  // evaluate the join() and `/computed/runtime/path/leaf` appears; stop claiming the subtree and
  // `/leaf` appears. All three are asserted absent in cases.ts.
  {path: 'computed', children: [
    {path: AppRoutes.RUNTIME_PATH, children: [
      {path: 'leaf', component: OrderHistoryComponent},
    ]},
  ]},
];

export const AppRoutingModule = RouterModule.forRoot(routes);
