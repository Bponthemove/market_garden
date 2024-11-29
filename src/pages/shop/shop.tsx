import { Box, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { categories } from "../../constants/categories";
import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";

const Shop = () => {
  const { pathname } = useLocation();
  const toast = useToast();

  useEffect(() => {
    toast.error("Cut-off time for next day delivery is now 2pm", 5000);
  }, []);

  return pathname === "/shop" ? (
    <Navigate to={"/shop/vegetables"} />
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
