import {createRouter} from 'vue-router';
import Login from '../components/LoginForm.vue';
export default createRouter({routes: [
  {path: '/login', name: 'login', component: Login},
  {path: '/orders/:orderId', name: 'order', component: () => import('../components/Order.vue')},
]});
