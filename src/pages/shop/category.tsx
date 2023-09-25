import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Category({ cat }: { cat: string }) {
  const { getProducts } = useFirebase();
  const { data, isLoading, isError } = useQuery<IGetProduct[] | undefined>(
    [cat],
    getProducts
  );

  const notAvailable = {
    vegbox:
      "Coming soon! We are working on subscription veg boxes to provide your household the very best produce the British seasons have to offer. Check back soon!",
    meat: "Coming soon! We are working with fantastic local organic farmers to offer a range of quality high welfare meats. Check back soon!",
    eggs: "Coming soon! Pastured layers; happy hens allowed to roam on meadow grass. Moved daily so they can forage naturally, producing gorgeous healthy eggs. Check back soon. ",
    more: ["Herbal Teas", <br />, "Honey"],
  };

  const products = data || [];

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Box>Error loading</Box>
      ) : notAvailable.hasOwnProperty(cat) ? (
        <Box px={2}>
          <Typography variant="body1">{notAvailable[cat]}</Typography>
        </Box>
      ) : (
        products.map((product) => (
          <ProductTile product={product} key={product.id} />
        ))
      )}
    </>
  );
}
