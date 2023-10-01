import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Fragment, useEffect, useState } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { routes } from "./constants/routes";
import { useAuthContext } from "./context/AuthContext";
import { Cart } from "./pages/Cart";
import Home from "./pages/home";
import { appTheme } from "./themes/standard";

function App() {
  const { currentUser } = useAuthContext();
  const [accepted, setAccepted] = useState<boolean>(false);
  const [animationRan, setAnimationRan] = useState<boolean>(false);

  useEffect(() => {
    const consentGiven = !!getCookieConsentValue("consentGiven");
    if (consentGiven && !accepted) {
      setAccepted(true);
    }
  }, [accepted]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <CookieConsent
        location="bottom"
        cookieName="consentGiven"
        expires={999}
        overlay
        onAccept={() => setAccepted(true)}
      >
        We store your data when you place your order with us. We do not share
        any of your data with others.
      </CookieConsent>
      <Layout
        accepted={accepted}
        setAnimationRan={setAnimationRan}
        animationRan={animationRan}
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
                            <Fragment key={childPath}>
                              <Route index element={childComponent} />
                              <Route
                                path={childPath}
                                element={childComponent}
                              />
                            </Fragment>
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
                return <Route path={path} element={component} key={path} />;
              }
            }
          )}
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}
export default App;
