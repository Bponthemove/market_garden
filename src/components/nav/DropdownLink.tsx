import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { categories } from "../../constants/categories";

const DropdownLink = (props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  const active = pathname.includes("shop");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    path: string,
    index: number
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    navigate(path);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setSelectedIndex(categories.map((cat) => cat.path).indexOf(pathname));
  }, [pathname]);

  return (
    <Box>
      <Button
        //aria-haspopup="true"
        //aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={({ palette }) => ({
          padding: 0,
          color: palette.dark.main,
          fontWeight: active ? "600" : "400",
          borderBottom: active ? `2px solid ${palette.dark.main}` : "",
          "&.MuiButton-root": {
            minWidth: 0,
            borderRadius: 0,
          },
        })}
      >
        {props.label ? props.label : <AccountCircleIcon />}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {props.label === "Shop"
          ? categories.map((cat, idx) => (
              <MenuItem
                key={cat.label}
                selected={idx === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, cat.path, idx)}
              >
                {cat.label}
              </MenuItem>
            ))
          : [
              <MenuItem
                key="PROFILE - MYDETAILS"
                selected={0 === selectedIndex}
                onClick={(event) =>
                  handleMenuItemClick(event, "/profile/mydetails", 0)
                }
              >
                My Details
              </MenuItem>,
              <MenuItem
                key="PROFILE - LOGOUT"
                selected={1 === selectedIndex}
                onClick={(event) =>
                  handleMenuItemClick(event, "/profile/logout", 1)
                }
              >
                Log out
              </MenuItem>,
            ]}
      </Menu>
    </Box>
  );
};

export default DropdownLink;
