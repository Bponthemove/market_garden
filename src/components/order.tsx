import { Box, Button, Typography } from "@mui/material";

export function Order(props) {
  const {
    orderNr,
    order,
    price,
    idx,
    name,
    deliveryDay,
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
        <Button
          variant="contained"
          color={processed ? "primary" : "error"}
          onClick={() => handleProcessing(id, !processed)}
        >
          {processed ? "Processed ✔" : "Process"}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap="10px">
        <Typography variant="h6">Delivery day:</Typography>
        <Typography>{deliveryDay}</Typography>
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
