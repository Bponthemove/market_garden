import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";
import ButtonBase from "@mui/material/ButtonBase";

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
  const { path, label, children } = props;
  const { pathname } = useLocation();

  const activeLink =
    path === "/shop"
      ? pathname === `${path}/vegetables` || pathname === `${path}/herbs`
      : pathname === path && path !== "/";

  return (
    <Box>
      <ButtonBase
        component={NavLink}
        to={path}
        sx={({ palette: { dark } }) => ({
          ...linkStyles,
          color: dark.main,
          borderBottom: activeLink ? `2px solid ${dark.main}` : "",
        })}
      >
        {children ?? label}
      </ButtonBase>
    </Box>
  );
};

export default Link;
