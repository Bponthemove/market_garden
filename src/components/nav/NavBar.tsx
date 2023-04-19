import {
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DrawerComponent from "./Drawer";
import { Box } from "@mui/system";
import Link from "./Link";
import { routes } from "../../constants/routes";
import { useAuthContext } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

function NavBar() {
  const theme = useTheme();
  const { currentUser, logOut } = useAuthContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { pathname } = useLocation();

  const homeLogo =
    pathname === "/shop" ||
    pathname === "/shop/vegetables" ||
    pathname === "/shop/herbs" ||
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact";

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          maxHeight: "2rem",
        }}
      >
        {isMobile ? (
          <DrawerComponent />
        ) : (
          <>
            {homeLogo && (
              <Box
                position='absolute'
                sx={{
                  borderRadius: "50%",
                  zIndex: "9",
                  top: "5rem",
                  left: "1.25rem"
                }}
              >
                <Link path={routes["HOME"].path} label={routes["HOME"].label}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Flogo.png?alt=media&token=be046d76-e8dd-4303-bf27-11c86b1aac5d"
                    alt="logo round the field market garden"
                    style={{ width: "10rem", height: "10rem" }}
                  />
                </Link>
              </Box>
            )}
            <Box
              sx={(theme) => ({
                marginLeft: theme.spacing(5),
                display: "flex",
              })}
            >
              {Object.values(routes).map((route) => {
                if (
                  (homeLogo && route.label === 'Home') ||
                  (!currentUser.user && route.label === "Log out") ||
                  (currentUser.user && route.label === "Sign in") ||
                  (!currentUser.superUser && route.label === "Admin") ||
                  (!currentUser.superUser && route.label === "Orders") ||
                  route.label === "Sign up" ||
                  route.path === "/checkout" ||
                  route.path === "/afterstripe"
                ) {
                  return;
                }
                return <Link key={route.label} {...route} />;
              })}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
