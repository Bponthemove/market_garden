import { Box, Button, Modal, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #12af83",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

export function CheckOutErrorModal({
  openErrorModal,
  setOpenErrorModal,
  serverError,
}: {
  openErrorModal: boolean;
  setOpenErrorModal: Dispatch<SetStateAction<boolean>>;
  serverError: string;
}) {
  const { cartItems } = useCartContext();

  return (
    <Modal
      open={openErrorModal}
      aria-labelledby="closed-modal-title"
      aria-describedby="closed-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h4" sx={{ marginBottom: "16px" }}>
          Sorry!
        </Typography>
        <div>
          <p>
            Something has gone wrong. You can help us resolve this issue by
            making a screenshot of this error and emailing it to{" "}
            <Link to="mailto:email@roundthefield.co.uk">us</Link>.
          </p>
          <p>
            We apologise for the inconvenience and will contact you as soon as
            we have resolved the issue. Thank you!
          </p>
          <p>Error: {serverError}</p>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} >{item.label}</li>
            ))}
          </ul>
        </div>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={() => setOpenErrorModal(false)}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
