import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useDeliveryContext } from "../context/DeliveryContext";
import { useOrderContext } from "../context/OrderContext";
import { useFirebase } from "../hooks/useFirebase";

export const AfterStripe = () => {
  const { orderNr, setOrderNr } = useOrderContext();
  const navigate = useNavigate();

  const { result } = useParams();
  const { cartItems, clearCart } = useCartContext();
  const { clearDetails } = useDeliveryContext();
  const { addOrder } = useFirebase();
  const [repeated, setRepeated] = useState(0);
  const [orderNotProcessed, setOrderNotProcessed] = useState(
    cartItems.length > 0 && orderNr ? true : false
  );

  useEffect(() => {
    if (result === "failed") {
      return;
    }

    if (repeated > 3) {
      clearCart();
      setOrderNr("");
    }

    async function addOrderToDB() {
      setOrderNotProcessed(false);
      try {
        await addOrder();
        clearDetails();
        clearCart();
        setOrderNr("");
      } catch (err) {
        setOrderNotProcessed(true);
        setRepeated((prev) => prev++);
      }
    }

    if (orderNotProcessed && repeated <= 3) {
      addOrderToDB();
    }
  }, [orderNotProcessed, addOrder, repeated, result, clearCart, setOrderNr]);

  if (result !== "failed" && result !== "success") navigate("/");

  return (
    <Box>
      {result === "failed" ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
          >
            <Typography variant="body1">
              Your payment was not successfull.
            </Typography>

            <Typography variant="body2">
              Any questions, please contact us on
              <span>
                <Link to="mailto:email@roundthefield.co.uk">
                  <Typography variant="subtitle1">
                    email@roundthefield.co.uk
                  </Typography>
                </Link>
              </span>
            </Typography>

            <Box>
              <Typography variant="body2">
                Or Click
                <span>
                  <Link to="/cart">
                    <Typography variant="subtitle1">here</Typography>
                  </Link>
                </span>
                to go back to your cart.
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Typography variant="h5">Thank you!</Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              Your payment has been successful.
            </Typography>
            <Typography variant="body1">
              You will receive your email confirmation shortly.
            </Typography>
            <Typography variant="body2">
              Any questions, please contact us on
              <span>
                <Link to="mailto:email@roundthefield.co.uk">
                  <Typography variant="subtitle1">
                    email@roundthefield.co.uk
                  </Typography>
                </Link>
              </span>
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};
