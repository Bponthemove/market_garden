import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import { iconStyles } from "../components/Footer";

const Contact = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      sx={{
        width: "100%",
        height: "50vh",
        justifyContent: "center",
        alingItems: "center",
      }}
    >
      <Box>
        <Typography variant="h5">Contact us via email: </Typography>
        <Link to="mailto:email@roundthefield.co.uk">
          <Typography variant="subtitle1">email@roundthefield.co.uk</Typography>
        </Link>
      </Box>
      <Box>
        <Typography variant="h5">
          Or follow us on instagram!{" "}
          <Link to="instagram.com/yourusername/">
            <InstagramIcon sx={iconStyles} fontSize="large" />
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Contact;
