import {
  Box,
  ButtonBase,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { CartItem } from "../components/CartItem";
import { useCartContext } from "../context/CartContext";
import logo from "../images/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export function Cart() {
  const { cartItems, setCartIsOpen, cartTotal, clearCart } = useCartContext();

  return (
    <Box
      sx={{
        overflow: "hidden",
        postition: "relative",
        height: "100%",
      }}
    >
      <img
        src={logo}
        alt="gg"
        style={{
          opacity: "0.06",
          position: "absolute",
          left: "0",
          top: "0",
          width: "40%",
          height: "auto",
        }}
      />
      <Grid container position="relative">
        <Grid item xs={2}>
          <Grid
            position="fixed"
            display="flex"
            gap={4}
            sx={(theme) => ({
              top: "2rem",
              left: "2rem",
            })}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => setCartIsOpen(false)}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.main,
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                cursor: "pointer",
                ": hover": {
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                },
              })}
            >
              <CloseIcon fontSize="large" color="action" />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => clearCart()}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.main,
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                cursor: "pointer",
                ": hover": {
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                },
              })}
            >
              <ClearAllIcon fontSize="large" color="action" />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Box pt={20} display="flex" flexDirection="column">
            <Table>
              {cartItems.map((item, idx) => (
                <CartItem {...item} />
              ))}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                  <Typography variant="h5">total</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">=</Typography>
                </TableCell>
                <TableCell>{cartTotal}</TableCell>
              </TableRow>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
