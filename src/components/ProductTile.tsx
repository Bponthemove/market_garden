import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCartContext } from "../context/CartContext";

function ProductTile(props: { product: any }) {
  const {
    id,
    label,
    description,
    image,
    inSeason,
    price,
    eachOrWeigth,
    isOffer,
    stillGrowing,
    soldOut,
    sellingFast,
    popular,
    comingSoon,
  } = props.product;

  const banners = [
    { inSeason },
    { isOffer },
    { stillGrowing },
    { soldOut },
    { sellingFast },
    { popular },
    { comingSoon },
  ].filter((banner) => Object.values(banner)[0]);

  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useCartContext();

  const itemQuantity = id ? getItemQuantity(id) : 0;

  const fromCamelCaseToNormal = (value: string) => {
    const string = value.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
    let flat = "";

    string.forEach(
      (word) =>
        (flat = flat + word.charAt(0).toUpperCase() + word.slice(1) + " ")
    );
    return flat;
  };

  return (
    <Grid
      item
      position="relative"
      key={id}
      sx={{
        height: { xs: "15em", sm: "22.5rem" },
        width: { xs: "100%", sm: "10rem" },
        display: "flex",
        flexDirection: { xs: "row", sm: "column" },
        alignItems: { sm: "center" },
        gridTemplateColumns: "repeat(auto-fill, auto)",
        backgroundColor: "#fff",
        "&:hover": {
          //cursor: "pointer",
          boxShadow:
            "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
        },
      }}
    >
      {itemQuantity > 0 && (
        <Box
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={({ palette }) => ({
            top: "0.1rem",
            left: "0.1rem",
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "50%",
            backgroundColor: palette.primary.main,
            color: palette.dark.main,
          })}
        >
          {itemQuantity}
        </Box>
      )}

      {banners.length > 0 && (
        <Box
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={0.5}
          sx={({ palette }) => ({
            top: { xs: "45%", sm: "34%" },
            right: { xs: "none", sm: "0.1rem" },
            borderRadius: "5%",
            backgroundColor: palette.primary.main,
            color: palette.dark.main,
          })}
        >
          <Typography variant="subtitle2">
            {fromCamelCaseToNormal(Object.keys(banners[0])[0])}
          </Typography>
        </Box>
      )}
      <Box
      flex={3}
        sx={{
          height: { xs: "50%", sm: "" },
          width: { xs: "50%", sm: "100%" },
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box flex={5} display="flex" flexDirection="column" alignItems="center" mb={1} rowGap={1} sx={{width: {xs: "50%", sm: "100%"}}}>
        <Box
          py={2}
          px={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            height: "100%",
          }}
        >
          <Typography variant="h6">{label}</Typography>
          <Typography variant="subtitle2" pt={1}>
            {description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" pt={1}>
            £ {price}
          </Typography>
          <Typography variant="subtitle2" pt={1}>
            {eachOrWeigth}
          </Typography>
        </Box>
        <Box display="flex">
          {itemQuantity ? (
            <>
              <AddCircleIcon
                color="primary"
                onClick={() => increaseCartQuantity(props.product)}
                sx={{
                  cursor: "pointer",
                }}
              />
              <RemoveCircleIcon
                color={id && getItemQuantity(id) === 0 ? "disabled" : "primary"}
                onClick={id ? () => decreaseCartQuantity(id) : () => null}
                sx={{
                  cursor: "pointer",
                }}
              />
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => increaseCartQuantity(props.product)}
              sx={{
                cursor: "pointer",
                marginY: "0.25rem",
              }}
            >
              <Typography variant="subtitle2">Add to cart</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Grid>
  );
}

export default ProductTile;
