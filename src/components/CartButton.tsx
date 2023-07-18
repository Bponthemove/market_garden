import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, ButtonBase, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

export default function CartButton() {
  const { setCartIsOpen, cartTotal } = useCartContext();
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={({ palette }) => ({
        backgroundColor: palette.primary.main,
        position: "fixed",
        width: "5rem",
        height: "5rem",
        borderRadius: "1rem",
        bottom: { xs: "10rem", md: "5rem" },
        right: { xs: "0.75rem", md: "3.5rem" },
      })}
    >
      <ButtonBase onClick={() => setCartIsOpen(true)}>
        <Box
          p={0.6}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={({ palette }) => ({
            backgroundColor: palette.primary.main,
            borderRadius: "1rem 1rem 0 0",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            ": hover": {
              backgroundColor: palette.primary.light,
            },
          })}
        >
          <ShoppingCartIcon
            fontSize="medium"
            sx={({ palette }) => ({ color: palette.dark.main })}
          />
          <Typography
            variant="subtitle2"
            sx={({ palette }) => ({ color: palette.dark.main })}
          >{`£ ${cartTotal.toFixed(2)}`}</Typography>
        </Box>
      </ButtonBase>
      <Divider
        sx={({ palette }) => ({
          backgroundColor: palette.dark.main,
        })}
      />
      <ButtonBase onClick={() => navigate("/shop")}>
        <Box
          p={0.6}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={({ palette }) => ({
            backgroundColor: palette.primary.main,
            borderRadius: "0 0 1rem 1rem",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            ": hover": {
              backgroundColor: palette.primary.light,
            },
          })}
        >
          <Typography
            variant="subtitle2"
            sx={({ palette }) => ({ color: palette.dark.main })}
          >
            Shop now
          </Typography>
          <AddShoppingCartIcon
            fontSize="medium"
            sx={({ palette }) => ({ color: palette.dark.main })}
          />
        </Box>
      </ButtonBase>
    </Box>
  );
}
