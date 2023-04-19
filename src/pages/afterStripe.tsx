import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";
import { useFirebase } from "../hooks/useFirebase";

export const AfterStripe = () => {
  const { orderNr, setOrderNr } = useOrderContext();

  const { result } = useParams();
  const { cartItems, clearCart } = useCartContext();
  const { addOrder } = useFirebase();

  const addOrderToDB = useCallback(async() => {
    try {
      await addOrder();
    } catch (err) {
      console.log(`Error adding order to db, orderNr: ${orderNr}`);
    }
  }, [orderNr, addOrder]);
  
  useEffect(() => {
    if (orderNr && cartItems.length > 0) {
      addOrderToDB()
      clearCart();
      setOrderNr("");
    }
  }, [addOrderToDB, clearCart, setOrderNr, cartItems.length, orderNr]);

  return (
    <Box>
      {result === "failed" ? (
        <>
          <Box>The payment has failed</Box>
          <Box>Go back</Box>
        </>
      ) : (
        <>
          <Box>
            <Typography variant="h5">Your payment has succeeded</Typography>
          </Box>
          <Box>
            <Typography variant="body1">Thank you for your order.</Typography>
            <Typography variant="body1">
              You will receive a confirmation email shortly.
            </Typography>
            <Typography variant="body2">
              Any questions, please contact us on blabla@email.com
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};
