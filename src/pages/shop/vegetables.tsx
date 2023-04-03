import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Vegetables() {
  const { getProducts } = useFirebase();
  const {
    data: vegetables,
    isLoading,
    error,
  } = useQuery<IGetProduct[] | undefined>(["vegetables"], getProducts);

  return (
    <>
      {vegetables ? (
        vegetables.map((vegetable) => (
          <ProductTile product={vegetable} key={vegetable.id} />
        ))
      ) : (
        <Typography variant="h3">No items found</Typography>
      )}
    </>
  );
}
