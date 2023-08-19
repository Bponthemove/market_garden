import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/EmailOutlined";

export const iconStyles = {
  "&:hover": { transform: "scale(1.04)" },
  padding: "0.25rem",
  border: "0.25px solid white",
  borderRadius: "5px",
  color: "white",
  display: "flex",
  alignSelf: "center",
};

function Footer() {
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          minHeight: "2rem",
          paddingY: "1rem",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column-reverse", sm: "row" },
            rowGap: { xs: "1rem", sm: "0" },
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              justifyItems: "center",
              rowGap: { xs: "0.75rem", md: "1.25rem" },
            }}
          >
            <Typography color="white" variant="caption">
              Round the field market garden
            </Typography>
            <Typography color="white" variant="caption">
              Designed and created by Bram peter van Zalk &copy; 2023
            </Typography>
          </Grid>
          <Grid
            item
            gap={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Link to="http://www.instagram.com/roundthefield_marketgarden">
              <InstagramIcon sx={iconStyles} fontSize="large" />
            </Link>
            <Link to="instagram.com/yourusername/">
              <EmailIcon sx={iconStyles} fontSize="large" />
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
export default Footer;
