import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Vegetables() {
  const { getProducts } = useFirebase();
  const {
    data,
    isLoading,
    isError,
  } = useQuery<IGetProduct[] | undefined>(["vegetables"], getProducts);

  const vegetables = data || [];

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      )
      : isError ? (
        <Box>Error loading</Box>
      )
      : vegetables.length ? (
        vegetables.map((vegetable) => (
          <ProductTile product={vegetable} key={vegetable.id} />
        ))
      ) : (
        <Typography variant="h3">No items found</Typography>
      )}
    </>
  );
}
