import { Box } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useCartContext } from "../context/CartContext"
import { Cart } from "../pages/Cart"
import CartButton from "./CartButton"
import Footer from "./Footer"
import NavBar from "./nav/NavBar"

export const Layout = ({children}: {children: React.ReactElement | null}) => {
  const { cartIsOpen } = useCartContext();
  const { pathname } = useLocation();

  const homeLogo =
    pathname === "/shop" ||
    pathname === "/shop/herbs" ||
    pathname === "/shop/vegetables" ||
    pathname === "/" ||
    pathname === "/about" ||
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
            <NavBar />
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.light,
                minHeight: "calc(100vh - 8rem)",
                width: "100vw",
                paddingY: homeLogo ? {xs: "0", md: "10rem"} : {xs: "0", md: "2rem"},
                paddingX: {xs: "0", md: "10rem"}
              })}
            >
              {children}
            </Box>
            {/* Shopping Cart Button */}
            {homeLogo && <CartButton />}
            <Footer />
          </>
        ) : (
          <Cart />
        )}
      </Box>
  )
}