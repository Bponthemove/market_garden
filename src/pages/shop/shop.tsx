import { Box, Grid, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Link from "../../components/nav/Link";
import { routes } from "../../constants/routes";

const Shop = () => {
  const { pathname } = useLocation();

  return pathname === "/shop" ? (
    <Navigate to={"/shop/vegbox"} />
  ) : (
    <Box display="flex" position='relative'>
      <Box sx={{ maxWidth: { xs: "70%", sm: "80%" } }}>
        <Grid container columnGap={4} rowGap={7} justifyContent="center">
          <Outlet />
        </Grid>
      </Box>
      <Box position='fixed' sx={{top: '4rem', right: '0.5rem'}}>
        <Box
          display="flex"
          sx={{
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">What we sell</Typography>
          {routes["SHOP"]?.childrenRoutes?.map(
            ({ childPath: path, childLabel: label }) => (
              <Link
                key={label}
                path={path}
                label={`- ${label}`}
                navbar={false}
                sx={{ fontSize: "12px" }}
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Shop;
