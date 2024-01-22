import ClearAllIcon from "@mui/icons-material/ClearAll";
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
import { ReactNode, useState } from "react";
import { CartItem } from "../components/CartItem";
import { useCartContext } from "../context/CartContext";
import { CheckOut } from "./checkOut";

export const TableCellStyled = ({
  children,
}: {
  children: string | number | ReactNode;
}) => (
  <TableCell
    align="right"
    sx={{
      "&.MuiTableCell-root": {
        padding: "0",
      },
    }}
  >
    <Typography variant="subtitle1">{children}</Typography>
  </TableCell>
);

export function Cart() {
  const [maxHeight, setMaxHeight] = useState<"auto" | 0>(0);
  const { cartItems, cartTotal, clearCart, cartQuantity } = useCartContext();

  const handleClickOrder = () => {
    setMaxHeight((prev) => (prev === "auto" ? 0 : "auto"));
  };

  return (
    <Box pt={6}>
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
      <Grid container alignContent="center" flexDirection="column">
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
            p: "1rem",
            cursor: "pointer",
            ": hover": {
              boxShadow:
                "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
            },
          })}
        >
          <ClearAllIcon fontSize="medium" color="action" />
        </Box>
        <Grid
          item
          width="100%"
          sx={{ paddingX: { xs: "0", sm: "3.5rem", md: "6.5rem" } }}
        >
          <Box pt={2} display="flex" flexDirection="column" alignItems='center'>
            {cartItems.length === 0 ? (
              <Box>Please add some items to your crate.</Box>
            ) : (
              <Table
                sx={{
                  "&.MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: "0 1rem",
                    maxWidth: '800px'
                  },
                }}
              >
                <TableBody>
                  {cartItems.map((item, idx) => (
                    <CartItem item={item} key={idx} />
                  ))}
                  <TableRow>
                    <TableCellStyled>{""}</TableCellStyled>
                    <TableCellStyled>delivery : </TableCellStyled>

                    <TableCellStyled>
                      {cartTotal <= 25 ? "£ 3.99" : "Free Delivery"}
                    </TableCellStyled>
                  </TableRow>
                  <TableRow>
                    <TableCellStyled>{""}</TableCellStyled>
                    <TableCellStyled>Total : </TableCellStyled>

                    <TableCellStyled>
                      {`£ ${
                        cartTotal <= 25
                          ? (
                              Math.round((cartTotal * 100) / 100) + 3.99
                            ).toFixed(2)
                          : cartTotal.toFixed(2)
                      }`}
                    </TableCellStyled>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              alignSelf="center"
              maxWidth="200px"
              mt={4}
            >
              {maxHeight === 0 && (
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="subtitle2">
                    Free delivery on orders over £25
                  </Typography>
                  <Button
                    disabled={!cartQuantity}
                    variant="contained"
                    onClick={handleClickOrder}
                  >
                    Proceed to checkout
                  </Button>
                </Box>
              )}
              <Box
                sx={{
                  minHeight: "100px",
                  width: "100%",
                  backgroundImage:
                    "url('https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FFree%20delivery%20RESIZED.jpg?alt=media&token=e238a890-3492-436a-a8ac-b38cf2e7613a')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </Box>
          </Box>
        </Grid>
        {maxHeight === "auto" && (
          <Grid
            item
            maxHeight={maxHeight}
            marginBottom={4}
            sx={{ paddingX: { xs: "2.5rem", sm: "8.5rem", md: "16.5rem" } }}
          >
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
