import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { CartItem } from "../components/CartItem";
import { useCartContext } from "../context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckOut } from "./checkOut";

export function Cart() {
  const [maxHeight, setMaxHeight] = useState<"auto" | 0>(0);
  const { cartItems, setCartIsOpen, cartTotal, clearCart, cartQuantity } =
    useCartContext();
  const navigate = useNavigate();

  const handleClickOrder = () => {
    setMaxHeight((prev) => (prev === "auto" ? 0 : "auto"));
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        postition: "relative",
        height: "100%",
      }}
    >
      <img
        src="./images/logo.png"
        alt="gg"
        style={{
          opacity: "0.06",
          position: "fixed",
          left: "0",
          top: "0",
          width: "40%",
          height: "auto",
        }}
      />
      <Grid container position="relative" justifyContent='center'>
        <Grid item xs={12}>
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
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                cursor: "pointer",
                ": hover": {
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                },
              })}
            >
              <CloseIcon fontSize="medium" color="action" />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => clearCart()}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.main,
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                cursor: "pointer",
                ": hover": {
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                },
              })}
            >
              <ClearAllIcon fontSize="medium" color="action" />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={10} md={8}>
          <Box pt={20} display="flex" flexDirection="column">
            <Table>
              <TableBody>
                {cartItems.map((item, idx) => (
                  <CartItem item={item} key={idx} />
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
                  <TableCell>
                    <Typography variant="h5">{cartTotal.toFixed(2)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mr={6} mt={6}>
              {maxHeight === 0 && (
                <Button
                  disabled={!cartQuantity}
                  variant="contained"
                  onClick={handleClickOrder}
                >
                  Proceed to checkout
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10} md={8} maxHeight={maxHeight}>
          {maxHeight === "auto" && (
            <>
              <CheckOut />
              <Box display="flex" justifyContent="flex-end" mr={6} mt={6}>
                <Button
                  disabled={!cartQuantity}
                  variant="contained"
                  onClick={handleClickOrder}
                >
                  I do not want to checkout yet.
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
