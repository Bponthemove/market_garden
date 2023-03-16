import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/nav/NavBar";
import { ButtonBase, CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/standard";
import { routes } from "./constants/routes";
import Footer from "./components/Footer";
import { Box } from "@mui/system";
import { useCartContext } from "./context/CartContext";
import Typography from "@mui/material/Typography";
import { Cart } from "./pages/Cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect } from "react";
import { useAuthContext } from "./context/AuthContext";
import React from "react";
import Home from "./pages/home";

function App() {
  const { cartIsOpen, setCartIsOpen, cartTotal } = useCartContext();
  const { logOut, currentUser } = useAuthContext();
  const { pathname } = useLocation();

  useEffect(() => {
    currentUser && logOut();
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      <Box
        position="relative"
        sx={{
          overflowX: "hidden",
        }}
      >
        {!cartIsOpen ? (
          <>
            <Navbar />
            <Box
              px={35}
              py={5}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.light,
                minHeight: "calc(100vh - 9.2rem)",
                width: "100vw",
              })}
            >
              <Routes>
                {Object.values(routes).map(
                  ({ path, component, superUser, childrenRoutes }) => {
                    if (superUser && !currentUser.superUser) {
                      return <Route path="/" element={<Home />} key={path} />;
                    } else if (childrenRoutes?.length) {
                      return (
                        <Route path={path} element={component} key={path}>
                          {childrenRoutes?.map(
                            ({ childPath, childComponent }, idx) => {
                              if (idx === 0) {
                                return (
                                  <React.Fragment key={childPath}>
                                    <Route index element={childComponent} />
                                    <Route
                                      path={childPath}
                                      element={childComponent}
                                    />
                                  </React.Fragment>
                                );
                              } else {
                                return (
                                  <Route
                                    path={childPath}
                                    element={childComponent}
                                    key={childPath}
                                  />
                                );
                              }
                            }
                          )}
                        </Route>
                      );
                    } else {
                      return (
                        <Route path={path} element={component} key={path} />
                      );
                    }
                  }
                )}
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
              </Routes>
            </Box>
            {/* Shopping Cart Button */}
            {pathname !== "/admin" && (
              <ButtonBase
                onClick={() => setCartIsOpen(true)}
                sx={{
                  position: "fixed",
                  width: "5rem",
                  height: "5rem",
                  bottom: "5rem",
                  right: "5rem",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.primary.main,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    cursor: "pointer",
                    ": hover": {
                      boxShadow:
                        "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                    },
                  })}
                >
                  <ShoppingCartIcon fontSize="large" color="action" />
                  <Typography
                    variant="subtitle2"
                    color="rgba(0, 0, 0, 0.54)"
                  >{`£ ${cartTotal}`}</Typography>
                </Box>
              </ButtonBase>
            )}
            <Footer />
          </>
        ) : (
          <Cart />
        )}
      </Box>
    </ThemeProvider>
  );
}
export default App;
