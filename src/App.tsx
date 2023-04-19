import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/standard";
import { routes } from "./constants/routes";
import { useAuthContext } from "./context/AuthContext";
import React from "react";
import Home from "./pages/home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "./components/Layout";

function App() {
  const { currentUser } = useAuthContext();

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Layout>
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
                return <Route path={path} element={component} key={path} />;
              }
            }
          )}
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}
export default App;
