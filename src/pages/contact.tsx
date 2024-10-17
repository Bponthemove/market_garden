import InstagramIcon from "@mui/icons-material/Instagram";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { iconStyles } from "../components/Footer";

const Contact = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      sx={{
        width: "100%",
        justifyContent: "center",
        alingItems: "center",
      }}
    >
      <Box>
        <Typography variant="h5">Contact us via email: </Typography>
        <Link to="mailto:roundthefield@gmail.com">
          <Typography variant="subtitle1">roundthefield@gmail.com</Typography>
        </Link>
      </Box>
      <Box display="flex" gap={3}>
        <Link to="http://www.instagram.com/roundthefield_marketgarden">
          <InstagramIcon sx={iconStyles} fontSize="large" style={{ color: '#000', borderColor: '#000' }}/>
        </Link>
        <Typography variant="h5">Follow us on instagram! </Typography>
      </Box>
    </Box>
  );
};

export default Contact;
