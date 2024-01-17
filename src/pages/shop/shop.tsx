import { Box, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { categories } from "../../constants/categories";

const Shop = () => {
  const { pathname } = useLocation();

  return pathname === "/shop" ? (
    <Navigate to={"/shop/vegbox"} />
  ) : (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4">
          {categories.find((cat) => cat.path === pathname).label}
        </Typography>
        <Box
          sx={{
            borderBottom: "2px solid black",
            paddingY: "0.5rem",
            width: "30%",
          }}
        />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Shop;
