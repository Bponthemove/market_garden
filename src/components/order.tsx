import { Box, Typography } from "@mui/material";

export function Order(props) {
  const id = props.idx + 1
  
  return (
    <Box 
      sx={{borderBottom: '1px solid black', marginBottom: '2rem'}}
    >
      <Typography variant="h5">{id}</Typography>
      <Box display="flex" alignItems="center" gap='10px'>
        <Typography variant="h6">Name:</Typography>
        <Typography>{props.name}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap='10px'>
        <Typography variant="h6">Telephone:</Typography>
        <Typography>{props.phone}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap='10px'>
        <Typography variant="h6">Email:</Typography>
        <Typography>{props.email}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Address:</Typography>
        <ul style={{listStyleType: 'none', paddingLeft: '1rem'}}>
          <li>{props.addressLineOne}</li>
          <li>{props.addressLineTwo}</li>
          <li>{props.town}</li>
          <li>{props.postcode}</li>
        </ul>
      </Box>
      <Box display="flex" alignItems="center" gap='10px'>
        <Typography variant="h6">Order Total:</Typography>
        <Typography>{props.price}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap='10px'>
        <Typography variant="h6">Order number:</Typography>
        <Typography>{props.orderNr}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Order:</Typography>
        <ul>
          {props.order.split(",").map((product, idx) =>(
            <li key={idx}>{product}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
