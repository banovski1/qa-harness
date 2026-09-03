import {createBrowserRouter} from 'react-router-dom';
import Home from '../components/Home';
import UserDetail from '../components/UserDetail';
export const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/users/:userId', element: <UserDetail />},
]);
