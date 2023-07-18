import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { Cart } from "../pages/Cart";
import CartButton from "./CartButton";
import Footer from "./Footer";
import NavBar from "./nav/NavBar";
import { useRef } from "react";
import { useIsVisible } from "../hooks/useIsVisible";

export const Layout = ({
  children,
}: {
  children: React.ReactElement | null;
}) => {
  const homeRef = useRef();
  const isHomeVisible = useIsVisible(homeRef);
  const { cartIsOpen } = useCartContext();
  const { pathname } = useLocation();

  const showCartBtn =
    pathname.includes("/shop") ||
    pathname === "/contact";

  return (
    <Box
      position="relative"
      sx={{
        overflowX: "hidden",
      }}
    >
      {!cartIsOpen ? (
        <>
          {pathname === "/" && (
            <Box
              position="relative"
              sx={{
                width: "100vw",
                paddingTop: "100vh",
                background: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,1)), 
              url(${
                pathname === "/"
                  ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_0042.jpg?alt=media&token=e0f7f83c-bbb2-4ad0-b6ed-5f1aae99a20e"
                  : ""
              })`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
              }}
            >
              <Box
                position='absolute'
                sx={{
                  bottom: {xs: '5rem', sm: '1rem'},
                  left: '3rem'
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
              minHeight: "calc(100vh - 8rem)",
              width: "100vw",
              paddingY: pathname.includes('/shop') ? { xs: "5rem", sm: "6rem" } : { xs: "2rem", sm: "4rem" },
              paddingLeft: pathname.includes('/shop') ? { xs: "2rem", sm: "1rem" } : { xs: "2rem", sm: "5rem" },
              paddingRight: pathname.includes('/shop') ? { xs: "2rem", sm: "2rem" } : { xs: "2rem", sm: "5rem" },
            })}
          >
            {children}
          </Box>
          {/* Shopping Cart Button */}
          {((pathname === '/' && isHomeVisible) || showCartBtn) && <CartButton />}
          <Footer />
        </>
      ) : (
        <Cart />
      )}
    </Box>
  );
};
