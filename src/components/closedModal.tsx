import { Box, Button, Modal, Typography } from "@mui/material";
import { useClosedContext } from "../context/closedContext";

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

export function ClosedNextDayModal() {
  const { ticked, setTicked } = useClosedContext();

  return (
    <Modal
      open={!ticked}
      aria-labelledby="closed-modal-title"
      aria-describedby="closed-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h4" sx={{ marginBottom: "16px" }}>
          Sorry!
        </Typography>
        <div>
          We are closed on 24/01/2024. All deliveries made on 23/01/2024 will be
          delivered on 25/01/2024.
        </div>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={() => setTicked(true)}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
