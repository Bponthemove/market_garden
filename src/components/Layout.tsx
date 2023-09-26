import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useIsVisible } from "../hooks/useIsVisible";
import { Cart } from "../pages/Cart";
import CartButton from "./CartButton";
import Footer from "./Footer";
import NavBar from "./nav/NavBar";

export const Layout = ({
  animation,
  children,
}: {
  animation: boolean;
  children: React.ReactElement | null;
}) => {
  const homeRef = useRef();
  const rootMargin = "0px 0px -92.5% 0px";
  const isHomeVisible = useIsVisible(homeRef, rootMargin);
  const { cartIsOpen } = useCartContext();
  const { pathname } = useLocation();

  const showCartBtn = pathname.includes("/shop") || pathname === "/contact";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {!cartIsOpen ? (
        <>
          {(pathname === "/" || pathname === "/contact") && (
            <Box
              sx={{
                "@keyframes transformHome": {
                  "0%": {
                    height: pathname === "/" ? "100vh" : "40vh",
                  },
                  "100%": {
                    height: pathname === "/" ? "20vh" : "20vh",
                  },
                },
                "@keyframes transformHomeBeforeAccept": {
                  "0%": {
                    height: pathname === "/" ? "100vh" : "40vh",
                  },
                  "100%": {
                    height: pathname === "/" ? "100vh" : "20vh",
                  },
                },
                width: "100vw",
                position: "relative",
                animation: animation
                  ? "1s ease-out 1s 1 transformHome"
                  : "1s ease-out 1s 1 transformHomeBeforeAccept",
                MozAnimation: animation
                  ? "1s ease-out 1s 1 transformHome"
                  : "1s ease-out 1s 1 transformHomeBeforeAccept",
                WebkitAnimation: animation
                  ? "1s ease-out 1s 1 transformHome"
                  : "1s ease-out 1s 1 transformHomeBeforeAccept",
                animationFillMode: "both",
                "&:after": {
                  background: `linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,1)), url(${
                    pathname === "/"
                      ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_0042.jpg?alt=media&token=e0f7f83c-bbb2-4ad0-b6ed-5f1aae99a20e"
                      : "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_0112.jpg?alt=media&token=3ae5ec9b-cf40-4a5b-8c39-51c247b66412"
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  right: "0px",
                  bottom: "0px",
                  zIndex: "-1",
                  content: '""',
                },
              }}
            >
              <Box
                position="absolute"
                width="100%"
                sx={{
                  top: pathname === "/" ? { xs: "2rem", sm: "1rem" } : "1rem",
                  left: "1rem",
                }}
              >
                <Typography
                  component="h1"
                  variant="h3"
                  sx={({ palette }) => ({ color: palette.light.main })}
                >
                  Round The Field
                </Typography>
                <Typography
                  component="h3"
                  variant="h5"
                  sx={({ palette }) => ({ color: palette.light.main })}
                >
                  Market Garden
                </Typography>
              </Box>
            </Box>
          )}

          <NavBar shouldFix={isHomeVisible} />

          <Box
            ref={pathname === "/" ? homeRef : null}
            sx={(theme) => ({
              backgroundColor: theme.palette.light.main,
              display: "inline-block",
              minHeight:
                pathname !== "/contact"
                  ? "calc(100vh - 5.75rem)"
                  : { xs: "calc(80vh - 10.75rem)", sm: "calc(80vh - 8rem)" },
              width: "100vw",
              paddingY: pathname.includes("/shop")
                ? { xs: "5rem", sm: "6rem" }
                : { xs: "2rem", sm: "4rem" },
              paddingLeft: pathname.includes("/shop")
                ? { xs: "2rem", sm: "1rem" }
                : { xs: "2rem", sm: "8rem" },
              paddingRight: pathname.includes("/shop")
                ? { xs: "2rem", sm: "2rem" }
                : { xs: "2rem", sm: "8rem" },
            })}
          >
            {children}
          </Box>
          {/* Shopping Cart Button */}
          {((pathname === "/" && isHomeVisible) || showCartBtn) && (
            <CartButton />
          )}
          <Footer />
        </>
      ) : (
        <Cart />
      )}
    </Box>
  );
};
