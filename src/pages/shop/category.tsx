import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductTile from "../../components/ProductTile";
import { useFirebase } from "../../hooks/useFirebase";
import { IGetProduct } from "../../types/allTypes";

export default function Category({ cat }: { cat: string }) {
  const [query, setQuery] = useState("");
  const [filteredOption, setFilteredOption] = useState(null);
  const { getProductsByCategory } = useFirebase();
  const { data, isLoading, isError } = useQuery<IGetProduct[] | undefined>(
    [cat],
    getProductsByCategory
  );

  console.log("BRAM", filteredOption);

  const notAvailable = {
    vegbox:
      "Coming soon! We are working on subscription veg boxes to provide your household the very best produce the British seasons have to offer. Check back soon!",
    meat: "Coming soon! We are working with fantastic local organic farmers to offer a range of quality high welfare meats. Check back soon!",
    eggs: "Coming soon! Pastured layers; happy hens allowed to roam on meadow grass. Moved daily so they can forage naturally, producing gorgeous healthy eggs. Check back soon. ",
    storeCupboard: ["Herbal Teas", <br />, "Honey"],
  };

  const products = data || [];

  if (isLoading) <CircularProgress />;

  if (isError) <Box>Error loading</Box>;

  if (notAvailable.hasOwnProperty(cat)) {
    return (
      <Box px={2}>
        <Typography variant="body1">{notAvailable[cat]}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box maxWidth="400px" margin='1rem auto'>
        {cat === "vegetables" && (
          <Autocomplete
            fullWidth
            options={products}
            getOptionLabel={(option) => option.label}
            filterOptions={(options) =>
              options.filter((opt) => opt.label.toLowerCase().includes(query))
            }
            onInputChange={(_, value) => {
              console.log("BRAM2", value);
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
        )}
      </Box>
      <Grid
        pt={3}
        container
        display="flex"
        columnGap={4}
        rowGap={7}
        justifyContent="center"
      >
        {!filteredOption ? (
          products
            .sort((a, b) => b.stockLevel - a.stockLevel)
            .map((product, idx) => (
              <ProductTile product={product} key={product.id} idx={idx} />
            ))
        ) : (
          <ProductTile
            product={filteredOption}
            key={filteredOption.id}
            idx={0}
          />
        )}
      </Grid>
    </>
  );
}
