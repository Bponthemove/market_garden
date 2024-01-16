import { Box, Button, Typography } from "@mui/material";

const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function Order(props) {
  const {
    orderNr,
    order,
    price,
    idx,
    timestamp,
    name,
    phone,
    email,
    addressLineOne,
    addressLineTwo,
    town,
    postcode,
    processed,
    id,
    handleProcessing,
  } = props;

  const screenId = idx + 1;

  const tomorrow = 24 * 60 * 60 * 1000;
  const dayAfterTomorrow = 48 * 60 * 60 * 1000;
  const before4pm = new Date(timestamp).getHours() <= 15;

  const deliveryTimestamp = new Date(
    new Date(timestamp).getTime() + (before4pm ? tomorrow : dayAfterTomorrow)
  );

  const deliveryDate =
    deliveryTimestamp.getDay() === 0
      ? new Date(
          new Date(deliveryTimestamp).getTime() + tomorrow
        ).toLocaleDateString()
      : deliveryTimestamp.toLocaleDateString();

  const deliveryDay =
    deliveryTimestamp.getDay() === 0 ? 1 : deliveryTimestamp.getDay();

  return (
    <Box
      sx={{
        borderBottom: "1px solid black",
        marginBottom: "2rem",
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">{screenId}</Typography>
        <Typography variant="body1">
          {" "}
          {days[deliveryDay]} {deliveryDate}
        </Typography>
        <Button
          variant="contained"
          color={processed ? "primary" : "error"}
          onClick={() => handleProcessing(id, !processed)}
        >
          {processed ? "Processed ✔" : "Process"}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Name:</Typography>
        <Typography>{name}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Telephone:</Typography>
        <Typography>{phone}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Email:</Typography>
        <Typography>{email}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Address:</Typography>
        <ul style={{ listStyleType: "none", paddingLeft: "1rem" }}>
          <li>{addressLineOne}</li>
          <li>{addressLineTwo}</li>
          <li>{town}</li>
          <li>{postcode}</li>
        </ul>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Order Total:</Typography>
        <Typography>{price}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Order number:</Typography>
        <Typography>{orderNr}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Order:</Typography>
        <ul>
          {order.split(",").map((product, idx) => (
            <li key={idx}>{product}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
