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

  const notAvailable = {
    vegbox:
      "Coming soon! We are working on subscription veg boxes to provide your household the very best produce the British seasons have to offer.",
    meat: "Coming soon! We are working with fantastic local organic farmers to offer a range of quality high welfare meats.",
    honey: "Local honey",
    herbalTeas:
      "Homemade herbal teas. Made with ingredients hand picked from the market garden.",
    storeCupboard: "Local products, sold locally.",
    cutFlowers: "Beautiful cut flowers, great as a gift or to treat yourself.",
  };

  const products =
    data
      ?.filter((product) => product.stockLevel)
      // @ts-ignore
      .filter((product) => product.stockLevel !== '0') || [];

  console.group({ products });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Box>Error loading</Box>;
  }

  if (products.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body1">{notAvailable[cat]}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box maxWidth="400px" margin="1rem auto">
        {cat === "vegetables" && (
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
        )}
      </Box>
      {cat === "eggs" || cat === "skinCare" ? (
        <>
          <Typography mt={2} variant="body1">
            {cat === "eggs"
              ? "Pastured, free range eggs. Moved onto new pasture daily so they can forage naturally, producing super happy eggs."
              : "100% natural skin care. Hand and homemade. No chemicals and beeswax produced by local beekeepers."}
          </Typography>
          <Box
            display="flex"
            sx={{ flexDirection: { xs: "column", md: "row" } }}
            mt={2}
          >
            {cat === "eggs" && (
              <Box
                sx={{
                  minHeight: { xs: "30vh", sm: "60vh" },
                  width: "100%",
                  alignSelf: { xs: "center", sm: "stretch" },
                  backgroundImage:
                    "url(https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fhens2.jpeg?alt=media&token=1ec08890-0a20-4a1d-a86b-690f5b64e5e3)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            <Grid
              container
              display="flex"
              columnGap={4}
              rowGap={7}
              justifyContent="center"
              sx={{ paddingTop: { xs: "3rem", md: "0" } }}
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
          </Box>
        </>
      ) : (
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
      )}
    </>
  );
}
