import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Category({cat}: {cat: string}) {
  const { getProducts } = useFirebase();
  const {
    data,
    isLoading,
    isError,
  } = useQuery<IGetProduct[] | undefined>([cat], getProducts);

  const products = data || []

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      )
      : isError ? (
        <Box>Error loading</Box>
      )
      : products.length ? (
        products.map((product) => (
          <ProductTile product={product} key={product.id} />
        ))
      ) : (
        <Typography variant="h3">No items found</Typography>
      )}
    </>
  );
}
