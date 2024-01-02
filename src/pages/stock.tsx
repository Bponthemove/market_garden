import { Box, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import StockItem from "../components/StockItem";
import { useFirebase } from "../hooks/useFirebase";

export default function Stock() {
  const { getProductsForStock } = useFirebase();

  const { data, isLoading, isError, refetch } = useQuery(
    [],
    getProductsForStock
  );

  const products =
    data && data.length
      ? data
          .map((product) => { // add space after slash for better readability
            const index = product.label.indexOf("/");
            if (index > -1 && product.label[index + 1] !== " ") {
              const arr = product.label.split("");
              arr.splice(index, 0, " ");
              product.label = arr.join("");
            }
            return product;
          })
          .sort((a, b) => a.category.localeCompare(b.category))
      : [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        Error loading your data, please try again
        <Button onClick={() => refetch}>Refetch</Button>
      </Box>
    );
  }

  if (products.length === 0) {
    return <Box>No data was found</Box>;
  }

  return (
    <Box component="main" mt={4}>
      {products.map((product) => (
        <StockItem product={product} refetch={refetch} />
      ))}
    </Box>
  );
}
