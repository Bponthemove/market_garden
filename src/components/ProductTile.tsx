import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCartContext } from "../context/CartContext";

function ProductTile(props: { product: any; idx: number }) {
  const {
    id,
    label,
    description,
    image,
    price,
    stockLevel,
    eachOrWeigth,
    banner,
  } = props.product;

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

  const soldOut = stockLevel - itemQuantity === 0;

  return (
    <Grid
      item
      position="relative"
      key={id}
      sx={({ palette }) => ({
        height: { xs: "12rem", sm: "18rem", md: "25rem" },
        width: { xs: "100%", sm: "10rem", md: "18rem" },
        display: "flex",
        flexDirection: { xs: "row", sm: "column" },
        alignItems: { sm: "center" },
        gridTemplateColumns: "repeat(auto-fill, auto)",
        backgroundColor: "#fff",
        border: `1px solid ${palette.grey[300]}`,
        borderRadius: "4px",
        "&:hover": {
          //cursor: "pointer",
          boxShadow:
            "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
        },
      })}
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
            border: `2px solid ${palette.dark.main}`,
            backgroundColor: palette.primary.main,
            color: palette.dark.main,
          })}
        >
          {itemQuantity}
        </Box>
      )}

      {banner || (stockLevel && stockLevel - itemQuantity < 10) ? (
        <Box
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={0.5}
          sx={({ palette }) => ({
            bottom: { xs: "11px", sm: "34%" },
            left: { xs: "4.5rem", sm: "0.1rem" },
            borderRadius: "5%",
            backgroundColor: palette.error.light,
          })}
        >
          <Typography variant="subtitle2">
            {soldOut
              ? "Sold Out"
              : stockLevel && stockLevel - itemQuantity < 10
              ? `Only ${stockLevel - itemQuantity} items left`
              : fromCamelCaseToNormal(banner)}
          </Typography>
        </Box>
      ) : null}
      <Box
        flex={3}
        sx={{
          height: { xs: "100%", sm: "" },
          width: { xs: "50%", sm: "100%" },
          borderTopLeftRadius: "4px",
          borderTopRightRadius: { xs: 0, sm: "4px" },
          borderBottomLeftRadius: { xs: "4px", sm: 0 },
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box
        flex={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={1}
        rowGap={1}
        sx={{ width: { xs: "50%", sm: "100%" } }}
      >
        <Box
          
          p={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxHeight="60%"
          minHeight="60%"
        >
          <Typography variant="h6">{label}</Typography>
          <Typography variant="subtitle2" pt={1} sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}>
            {description}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Typography variant="subtitle2" pt={1}>
            £ {price}
          </Typography>
          <Typography variant="subtitle2" pt={1}>
            {eachOrWeigth}
          </Typography>
        </Box>
        <Box
          display="flex"
          minHeight="2rem"
          maxHeight="2rem"
          alignItems="center"
        >
          {soldOut ? (
            <Button
              variant="outlined"
              disabled
              onClick={() => null}
              sx={{
                marginY: "0.25rem",
              }}
            >
              <Typography variant="subtitle2">Sold Out</Typography>
            </Button>
          ) : itemQuantity ? (
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
