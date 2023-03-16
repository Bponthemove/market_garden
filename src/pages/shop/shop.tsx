import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
} from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Link from "../../components/nav/Link";
import ProductTile from "../../components/ProductTile";
import { products } from "../../constants/products";
import { routes } from "../../constants/routes";
import Vegetables from "./vegetables";

const Shop = () => {

  return (
    <Box>
      <Grid container mb={4}>
        { routes['SHOP']?.childrenRoutes?.map(({childPath: path, childLabel: label}) => <Link key={label} path={path} label={label} navbar={false}/>) }
      </Grid>
      <Grid
        container                
        columnGap={4}
        rowGap={7}
        justifyContent='center'
      >        
        <Outlet />
      </Grid>
      
      
    </Box>
    // <Grid
    //   container
    //   display='flex'
    //   flexDirection='column'
    // >
    //   <Grid
    //   item

    //   display='flex'
    //   flexDirection='column'
    //   >
    //     <Typography variant='h2'>
    //       Vegetables
    //     </Typography>
    //     <Grid
    //      container
    //      gap={4}
    //     >
    //     {products.map(product => product.category === 'vegetable' && (
    //     <Grid item xs={5}>
    //       <ProductTile product={product} />
    //     </Grid>
    //   ))}

    //     </Grid>
    //   </Grid>
    //   <Grid
    //   item

    //   display='flex'
    //   flexDirection='column'
    //   >
    //     <Typography variant='h2'>
    //       Herbs
    //     </Typography>
    //     <Grid
    //      container
    //      gap={4}
    //     >
    //     {products.map(product => product.category === 'herb' && (
    //     <Grid item xs={5}>
    //       <ProductTile product={product} />
    //     </Grid>
    //   ))}

    //     </Grid>
    //   </Grid>

    // </Grid>
  );
};

export default Shop;
