import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/nav/NavBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/standard";
import { routes } from "./constants/routes";
import Footer from "./components/Footer";
import { Box } from "@mui/system";
import { useCartContext } from "./context/CartContext";
import { Cart } from "./pages/Cart";
import {
  useAuthContext,
} from "./context/AuthContext";
import React from "react";
import Home from "./pages/home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CartButton from "./components/CartButton";

function App() {
  const { cartIsOpen } = useCartContext();
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();

  console.log({ cartIsOpen, currentUser });

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
              px={25}
              py={5}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.light,
                minHeight: "calc(100vh - 8rem)",
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
            {pathname !== "/admin" && <CartButton />}
            <Footer />
          </>
        ) : (
          <Cart />
        )}
      </Box>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}
export default App;
