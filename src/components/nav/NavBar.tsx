import { AppBar, Toolbar, Box } from "@mui/material";
import Link from "./Link";
import { routes } from "../../constants/routes";
import { useAuthContext } from "../../context/AuthContext";

function NavBar({ shouldFix }) {
  const { currentUser } = useAuthContext();

  return (
    <AppBar position={shouldFix ? "fixed" : "static"}>
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
              (!currentUser.user && route.label === "Log out") ||
              (currentUser.user && route.label === "Sign in") ||
              (!currentUser.superUser && route.label === "Admin") ||
              (!currentUser.superUser && route.label === "Orders") ||
              route.label === "Sign up" ||
              route.path === "/checkout" ||
              route.path === "/afterstripe" ||
              route.path === "/afterstripe/:result"
            ) {
              return null;
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
