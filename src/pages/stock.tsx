import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StockItem from "../components/StockItem";
import { useFirebase } from "../hooks/useFirebase";

export default function Stock() {
  const [query, setQuery] = useState("");
  const [filteredOption, setFilteredOption] = useState(null);
  const { getProductsForStock } = useFirebase();

  const { data, isLoading, isError, refetch } = useQuery(
    [],
    getProductsForStock
  );

  const products =
    data && data.length
      ? data
          .map((product) => {
            // add space after slash for better readability
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
      <Box my={2} maxWidth='400px'>
        <Autocomplete
          fullWidth
          options={products}
          getOptionLabel={(option) => option.label}
          filterOptions={(options) =>
            options.filter((opt) => opt.label.toLowerCase().includes(query))
          }
          onInputChange={(_, value) => {
            setQuery(value.toLowerCase());
            const itemFound = products.find(
              (product) => product.label.toLowerCase() === value.toLowerCase()
            );
            if (itemFound) setFilteredOption(itemFound);
            if (!value) setFilteredOption(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search products"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
        />
      </Box>
      {!filteredOption ? (
        products.map((product) => (
          <StockItem product={product} refetch={refetch} />
        ))
      ) : (
        <StockItem product={filteredOption} refetch={refetch} />
      )}
    </Box>
  );
}
