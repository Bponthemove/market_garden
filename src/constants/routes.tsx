import About from "../pages/about";
import Admin from "../pages/admin";
import { CheckOut } from "../pages/checkOut";
import Contact from "../pages/contact";
import Home from "../pages/home";
import LogOut from "../pages/logOut";
import { Orders } from "../pages/orders";
import Herbs from "../pages/shop/herbs";
import Shop from "../pages/shop/shop";
import Vegetables from "../pages/shop/vegetables";
import SignInSide from "../pages/signIn";
import SignUp from "../pages/signUp";

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
  CHECK_OUT: {
    path: "/checkout",
    label: "",
    component: <CheckOut />,
    superUser: false
  },
  SIGN_IN: {
    path: "/signin",
    label: 'Sign in',
    component: <SignInSide />,
    superUser: false
  },
  SIGN_UP: {
    path: "/signup",
    label: 'Sign up',
    component: <SignUp />,
    superUser: false
  },
  LOG_OUT: {
    path: "/logout",
    label: 'Log out',
    component: <LogOut />,
    superUser: false
  },
  ADMIN: {
    path: "/admin",
    label: 'Admin',
    component: <Admin />,
    superUser: true
  },
  ORDERS: {
    path: "/orders`",
    label: 'Orders',
    component: <Orders />,
    superUser: true
  } 
};
