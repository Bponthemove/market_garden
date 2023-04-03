import { ButtonBase, Box, Typography } from "@mui/material";
import { useCartContext } from "../context/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function CartButton() {
  const { cartIsOpen, setCartIsOpen, cartTotal } = useCartContext();

  return (
    <ButtonBase
      onClick={() => setCartIsOpen(true)}
      sx={{
        position: "fixed",
        width: "5rem",
        height: "5rem",
        bottom: "4rem",
        right: "4rem",
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
        >{`£ ${cartTotal.toFixed(2)}`}</Typography>
      </Box>
    </ButtonBase>
  );
}
