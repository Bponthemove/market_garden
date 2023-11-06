import { AppBar, Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useAuthContext } from "../../context/AuthContext";
import DropdownLink from "./DropdownLink";
import Link from "./Link";

function NavBar({ shouldFix }) {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();

  return (
    <AppBar
      position={
        shouldFix || pathname.includes("/shop") || pathname === "/cart"
          ? "fixed"
          : "static"
      }
      sx={{
        top:
          shouldFix || pathname.includes("/shop") || pathname === "/cart"
            ? 0
            : "20vh",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: { xs: "2.5rem" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {Object.values(routes).map((route) => {
            if (
              (!currentUser.user && route.path === "/profile") ||
              (currentUser.user && route.label === "Sign in") ||
              (!currentUser.superUser && route.label === "Admin") ||
              (!currentUser.superUser && route.label === "Orders") ||
              route.label === "Sign up" ||
              route.path === "/checkout" ||
              route.path === "/profile/logout" ||
              route.path === "/profile/mydetails" ||
              route.path === "/afterstripe" ||
              route.path === "/afterstripe/:result"
            ) {
              return null;
            }
            if (route.path === "/shop" || route.path === "/profile") {
              return <DropdownLink key={route.path} {...route} />;
            }

            if (route.path === "/") {
              return <Link key={route.label} {...route} />;
            }
            return <Link key={route.label} {...route} />;
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
