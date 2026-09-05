import {RouterModule} from '@angular/router';
import {UserCardComponent} from './user-card.component';

export const routes = [
  {path: '', component: UserCardComponent},
  {path: 'users/:userId', component: UserCardComponent, name: 'user-detail'},
];

export const AppRoutingModule = RouterModule.forRoot(routes);
