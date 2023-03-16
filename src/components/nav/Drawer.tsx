import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import { routes } from "../../constants/routes"; 

const linkStyles = {
  textDecoration: "none",
  color: "blue",
  fontSize: "20px",
};

const iconStyles = {
  color: "white",
};

function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {Object.values(routes).map(({ path, label }) => (
            <ListItem onClick={() => setOpenDrawer(false)}>
              <ListItemText>
                <Box sx={{ ...linkStyles }}>
                  <NavLink to={path}>{label}</NavLink>
                </Box>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{ ...iconStyles }}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
