import { AfterStripe } from "../pages/afterStripe";
import { CheckOut } from "../pages/checkOut";
import Contact from "../pages/contact";
import Home from "../pages/home";
import LogOut from "../pages/logOut";
import { MyDetails } from "../pages/myDetails";
import { Orders } from "../pages/orders";
import SignInSide from "../pages/signIn";
import Products from "../pages/products";
import Category from "../pages/shop/category";
import Shop from "../pages/shop/shop";
import SignUp from "../pages/signUp";
import Stock from "../pages/stock";
import { categories } from "./categories";

interface IChildrenRoute {
  childPath: string;
  childLabel: string;
  childComponent: JSX.Element;
}

interface IRoute {
  path: string;
  label: string;
  component: JSX.Element;
  superUser: boolean;
  childrenRoutes?: IChildrenRoute[];
}

export const routes: { [key: string]: IRoute } = {
  HOME: {
    path: "/",
    label: "Home",
    component: <Home />,
    superUser: false,
  },
  SHOP: {
    path: "/shop",
    label: "Shop",
    component: <Shop />,
    childrenRoutes: categories.map((cat) => ({
      childPath: cat.path,
      childLabel: cat.label,
      childComponent: <Category cat={cat.cat} />,
    })),
    superUser: false,
  },
  CONTACT: {
    path: "/contact",
    label: "Contact",
    component: <Contact />,
    superUser: false,
  },
  CHECK_OUT: {
    path: "/checkout",
    label: "",
    component: <CheckOut />,
    superUser: false,
  },
  SIGN_IN: {
    path: "/signin",
    label: "Sign in",
    component: <SignInSide />,
    superUser: false,
  },
  SIGN_UP: {
    path: "/signup",
    label: "Sign up",
    component: <SignUp />,
    superUser: false,
  },
  LOG_OUT: {
    path: "/profile/logout",
    label: "Log out",
    component: <LogOut />,
    superUser: false,
  },
  MY_DETAILS: {
    path: "/profile/mydetails",
    label: "Log out",
    component: <MyDetails />,
    superUser: false,
  },
  PROIFLE: {
    path: "/profile",
    label: "",
    component: <LogOut />,
    superUser: false,
  },
  ADMIN: {
    path: "/admin",
    label: "",
    component: <Products />,
    superUser: true,
  },
  PRODUCTS: {
    path: "/admin/products",
    label: "Admin",
    component: <Products />,
    superUser: true,
  },
  STOCK: {
    path: "/admin/stock",
    label: "Stock Levels",
    component: <Stock />,
    superUser: true,
  },
  ORDERS: {
    path: "/admin/orders",
    label: "Orders",
    component: <Orders />,
    superUser: true,
  },
  AFTER_STRIPE: {
    path: "/afterstripe/:result",
    label: "",
    component: <AfterStripe />,
    superUser: false,
  },
};
