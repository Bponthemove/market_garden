import { useState } from "react";
import { Drawer, IconButton, List, ListItem } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { routes } from "../../constants/routes";
import Link from "./Link";

function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {Object.values(routes).map((link) => (
            <ListItem key={link.label} onClick={() => setOpenDrawer(false)}>
              <Link {...link} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{ color: ({ palette }) => palette.primary.light }}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
