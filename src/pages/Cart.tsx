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
import { useState } from "react";
import { CheckOut } from "./checkOut";

export const TableCellStyled = ({
  children,
}: {
  children: string | number;
}) => (
  <TableCell
    sx={{
      "&.MuiTableCellStyled-root": {
        padding: 0,
      },
    }}
  >
    <Typography variant="subtitle1">{children}</Typography>
  </TableCell>
);

export function Cart() {
  const [maxHeight, setMaxHeight] = useState<"auto" | 0>(0);
  const { cartItems, setCartIsOpen, cartTotal, clearCart, cartQuantity } =
    useCartContext();

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
        src="https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Flogo.png?alt=media&token=be046d76-e8dd-4303-bf27-11c86b1aac5d"
        alt="gg"
        style={{
          opacity: "0.06",
          position: "fixed",
          left: "30%", //50 - width/2
          top: "10%",
          width: "40%",
          height: "auto",
        }}
      />
      <Grid
        container
        alignContent="center"
        flexDirection="column"
      >
        <Grid
          item
          position="fixed"
          p={2}
          sx={{
            backgroundColor: "#FFF",
            boxShadow: "0 8px 6px -6px #D3D3D3",
            minWidth: "100%",
          }}
        >
          <Box display="flex" gap={4}>
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
          </Box>
        </Grid>
        <Grid item width='100%' xs={6}>
          <Box pt={20} display="flex" flexDirection="column">
            <Table>
              <TableBody>
                {cartItems.map((item, idx) => (
                  <CartItem item={item} key={idx} />
                ))}
                <TableRow>
                  <TableCellStyled>{""}</TableCellStyled>
                  <TableCellStyled>{""}</TableCellStyled>
                  <TableCellStyled>total</TableCellStyled>
                  <TableCellStyled>=</TableCellStyled>

                  <TableCellStyled>{cartTotal.toFixed(2)}</TableCellStyled>
                </TableRow>
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mr={6} mt={6}>
              {maxHeight === 0 && (
                <Box display="flex" flexDirection="column">
                  <Button
                    disabled={!cartQuantity || cartTotal <= 25}
                    variant="contained"
                    onClick={handleClickOrder}
                  >
                    Proceed to checkout
                  </Button>
                  {cartTotal <= 25 && (
                    <Typography variant="subtitle1">
                      Minimum order of £25
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        {maxHeight === "auto" && (
          <Grid item maxHeight={maxHeight} xs={6} marginBottom={4}>
            <CheckOut />
            <Box display="flex" justifyContent="flex-end" mr={6} mt={6}>
              <Button
                disabled={!cartQuantity}
                variant="contained"
                onClick={handleClickOrder}
              >
                cancel
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
