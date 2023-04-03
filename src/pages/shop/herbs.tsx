import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Herbs() {
  const { getProducts } = useFirebase();
  const {
    data: herbs,
    isLoading,
    error,
  } = useQuery<IGetProduct[] | undefined>(["herbs"], getProducts);

  return (
    <>
      {herbs ? (
        herbs.map((herb: IGetProduct) => (
          <ProductTile product={herb} key={herb.id} />
        ))
      ) : (
        <Typography variant="h3">No items found</Typography>
      )}
    </>
  );
}
