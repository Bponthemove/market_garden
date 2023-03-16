import { useTheme, useMediaQuery, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { routes } from "../constants/routes";
import DrawerComponent from "./nav/Drawer";

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h4"
          sx={{
            flexGrow: "1",
            cursor: "pointer",
          }}
        >
          Footer
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
export default Footer;

