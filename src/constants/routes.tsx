import About from "../pages/about";
import Admin from "../pages/admin";
import Contact from "../pages/contact";
import Home from "../pages/home";
import Herbs from "../pages/shop/herbs";
import Shop from "../pages/shop/shop";
import Vegetables from "../pages/shop/vegetables";
import SignInSide from "../pages/signIn";

interface IChildrenRoute {
  childPath: string
  childLabel: string
  childComponent: JSX.Element
}

interface IRoute {
  path: string
  label: string
  component: JSX.Element
  superUser: boolean
  childrenRoutes?: IChildrenRoute[]
}

export const routes: {[key: string]: IRoute} = {
  HOME: {
    path: "/",
    label: "Home",
    component: <Home />,
    superUser: false
  },
  SHOP: {
    path: "/shop",
    label: "Shop",
    component: <Shop />,
    childrenRoutes: [
      {
        childPath: '/shop/vegetables',
        childLabel: 'Vegetables',
        childComponent: <Vegetables />
      },
      {
        childPath: '/shop/herbs',
        childLabel: 'Herbs',
        childComponent: <Herbs />
      }
    ],
    superUser: false
  },
  ABOUT: {
    path: "/about",
    label: "About",
    component: <About />,
    superUser: false
  },
  CONTACT: {
    path: "/contact",
    label: "Contact",
    component: <Contact />,
    superUser: false
  },
  SIGN_IN: {
    path: "/signin",
    label: 'Sign in',
    component: <SignInSide />,
    superUser: false
  },
  LOG_OUT: {
    path: "/logout",
    label: 'Log out',
    component: <SignInSide />,
    superUser: false
  },
  ADMIN: {
    path: "/admin",
    label: 'Admin',
    component: <Admin />,
    superUser: true
  }  
};
