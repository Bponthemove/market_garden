import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import React, { PropsWithChildren } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { useAuthContext } from "../../context/AuthContext";

const linkStyles = {
  textDecoration: "none",
  color: "white",
  fontSize: "14px",
  borderBottom: "1px solid transparent",
  "&:hover": {
    borderBottom: "1px solid white",
  },
};

interface ILinkProps {
  path: string;
  label: string;
  navbar?: boolean;  
}

const Link = (props: PropsWithChildren<ILinkProps>) => {
  const { path, label, children, navbar = true } = props;
  const { pathname } = useLocation();

  return (
    <Box>
      <ButtonBase
        component={NavLink}
        to={path}        
        sx={(theme) => ({
          ...linkStyles,
          marginLeft: path !== '/' ? theme.spacing(10) : 0,
          color: !navbar ? theme.palette.primary.main : theme.palette.primary.light,
          borderBottom:
            pathname === path && path !== '/'
              ? `2px solid ${!navbar ? theme.palette.primary.main : theme.palette.primary.light}`
              : "",
        })}
      >
        {children ?? label}
      </ButtonBase>
    </Box>
  );
};

export default Link;
