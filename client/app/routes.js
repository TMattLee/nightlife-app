import Base from './components/Base/Base.jsx';
import Logout from './components/Logout/Logout.jsx'
import HomePage from './containers/HomePage/HomePage.jsx';
import Dashboard from './containers/Dashboard/Dashboard.jsx';

const routes = [
  {
    component: Base,
    routes:[
      {
        path: '/nightlife-app/',
        exact: true,
        component: HomePage
      },
      {
        path: '/nightlife-app/dashboard',
        component: Dashboard
      },
      {
        path: '/nightlife-app/logout',
        component: Logout
      },
    ]
  }
]

export default routes;