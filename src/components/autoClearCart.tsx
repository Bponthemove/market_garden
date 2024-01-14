import { useEffect, useRef, useState } from "react";

import { Box, Button, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";

const thirtyMinutesFromCountdown = 1000 * 60 * 30;
const oneMinutesInMs = 1000 * 60;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '80%',
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function AutoClearCart() {
  const [open, setOpen] = useState(false);

  const { logOut } = useAuthContext();
  const { clearCart, cartTotal } = useCartContext();

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const twoMinTimeoutRef = useRef(null);

  useEffect(() => {
    if (!cartTotal) return;

    function actionNoActivity() {
      clearCart();
      setOpen(false);
      logOut();
      navigate("/");
    }

    function handleTime() {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setOpen(true);
        if (twoMinTimeoutRef.current) clearTimeout(twoMinTimeoutRef.current);
        twoMinTimeoutRef.current = setTimeout(actionNoActivity, oneMinutesInMs);
      }, thirtyMinutesFromCountdown);
    }

    handleTime();

    document.body.addEventListener("mouseup", handleTime);

    return () => {
      document.body.removeEventListener("mouseup", handleTime);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cartTotal, clearCart, logOut, navigate]);

  function handleButtonClick(callback: () => void) {
    if (twoMinTimeoutRef.current !== null)
      clearTimeout(twoMinTimeoutRef.current);
    callback();
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="inactivity-modal-title"
      aria-describedby="inactivity-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h4" sx={{ marginBottom: "16px" }}>
          Session Timeout
        </Typography>
        <div>
          You're being timed out due to inactivity. Please choose to stay signed
          in or to logoff. Otherwise, you will be logged off and your cart will
          be emptied automatically.
        </div>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={() => handleButtonClick(logOut)}>
            Log off
          </Button>
          <Button
            variant="contained"
            onClick={() => handleButtonClick(() => setOpen(false))}
            sx={{
              marginLeft: "16px",
            }}
          >
            Stay Logged In
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
