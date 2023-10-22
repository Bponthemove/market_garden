import { Box } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

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
  sx?: { [key: string]: string };
}

const Link = (props: PropsWithChildren<ILinkProps>) => {
  const { path, label, children, sx } = props;

  return (
    <Box>
      <ButtonBase
        component={NavLink}
        to={path}
        sx={({ palette: { dark } }) => ({
          ...linkStyles,
          ...sx,
          color: dark.main,
          "&.active": {
            fontWeight: "600",
            borderBottom: `2px solid ${dark.main}`,
          },
        })}
      >
        {children ?? label}
      </ButtonBase>
    </Box>
  );
};

export default Link;
