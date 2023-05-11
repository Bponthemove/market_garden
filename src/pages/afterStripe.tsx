import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";
import { useFirebase } from "../hooks/useFirebase";

export const AfterStripe = () => {
  const { orderNr, deliveryDay, setOrderNr, setDeliveryDay } =
    useOrderContext();

  const { result } = useParams();
  const { cartItems, clearCart } = useCartContext();
  const { addOrder } = useFirebase();
  const [repeated, setRepeated] = useState(0);
  const [orderNotProcessed, setOrderNotProcessed] = useState(
    cartItems.length > 0 && orderNr !== '' && deliveryDay !== ''
  );
  
  useEffect(() => {
    if (result === 'failed') {
      return
    }

    if (repeated > 3) {
      clearCart();
      setOrderNr("");
      setDeliveryDay("");
    }

    async function addOrderToDB() {
      setOrderNotProcessed(false);
      try {
        await addOrder();
        clearCart();
        setOrderNr("");
        setDeliveryDay("");
      } catch (err) {
        setOrderNotProcessed(true);
        setRepeated((prev) => prev++);
      }
    };
    if (orderNotProcessed && repeated <= 3) {
      addOrderToDB();
    }
  }, [orderNotProcessed, addOrder, repeated, result, clearCart, setOrderNr, setDeliveryDay]);

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
