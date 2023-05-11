import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Herbs() {
  const { getProducts } = useFirebase();
  const {
    data,
    isLoading,
    isError,
  } = useQuery<IGetProduct[] | undefined>(["herbs"], getProducts);

  const herbs = data || []
  console.log(herbs)

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      )
      : isError ? (
        <Box>Error loading</Box>
      )
      : herbs.length ? (
        herbs.map((herb) => (
          <ProductTile product={herb} key={herb.id} />
        ))
      ) : (
        <Typography variant="h3">No items found</Typography>
      )}
    </>
  );
}
