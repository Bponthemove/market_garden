import {
  Box,
  ImageListItem,
  ImageListItemBar,
  Grid,
  Typography,
} from "@mui/material";
import { useCartContext } from "../context/CartContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

function ProductTile(props: { product: any }) {
  const {
    id,
    label,
    description,
    image,
    inSeason,
    isOffer,
    stillGrowing,
    soldOut,
    sellingFast,
    popular,
    comingSoon,
  } = props.product;

  console.log(description);

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
      key={id}
      position="relative"
      sx={{
        height: "25rem",
        width: "15rem",
        gridTemplateColumns: "repeat(auto-fill, auto)",
        "&:hover": {
          //cursor: "pointer",
          boxShadow: "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
        },
      }}
    >
      <ImageListItem
        sx={{
          height: "inherit !important",
          "& .MuiImageListItemBar-root: hover": {
            height: "200px",
            alignItems: "stretch",
            ".MuiImageListItemBar-subtitle": {
              height: "100%",
              textOverflow: "clip",
              overflow: "visible",
              whiteSpace: "normal",
            },
          },
        }}
      >
        <Box
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={(theme) => ({
            top: "1rem",
            left: "1rem",
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.light,
          })}
        >
          {id ? getItemQuantity(id) : 0}
        </Box>
        <img
          src={image ?? "https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Flogo.png?alt=media&token=be046d76-e8dd-4303-bf27-11c86b1aac5d"}
          width="100%"
          height="100%"
          alt={label}
          loading="lazy"
        />
        <ImageListItemBar
          title={label}
          subtitle={description}
          sx={{
            justifyContent: "space-between",
            "& .MuiImageListItemBar-titleWrap": {
              flex: "1 1 70%",
            },
            "& .MuiImageListItemBar-actionIcon": {
              flex: "1 1 20%",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
            },
          }}
          actionIcon={
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
          }
        />
      </ImageListItem>

      <Box
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          right: 0,
          padding: "2px 4px",
          backgroundColor: theme.palette.secondary.light,
          borderRadius: '0 0 0 5px'
        })}
      >
        {banners.map((banner, idx) => (
          <Typography
            key={idx}
            variant="subtitle2"
            sx={(theme) => ({
              color: theme.palette.primary.light,
            })}
          >
            {fromCamelCaseToNormal(Object.keys(banner)[0])}
          </Typography>
        ))}
      </Box>
    </Grid>

    // <Card
    //   sx={(theme) => ({
    //     backgroundColor: theme.palette.primary.light,
    //     boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    //     width: "36rem",
    //             height: "12rem",
    //     margin: "auto",
    //     textAlign: "center",
    //     cursor: "pointer",
    //     "&:hover": {
    //       opacity: "0.8",
    //     },
    //     display: soldOut ? 'none' : 'flex',
    //   })}
    // >
    //   <Box
    //     sx={{
    //       width: "60%",
    //     }}
    //   >
    //     <img src={image} alt="" style={{ width: "100%", height: '100%' }} />
    //   </Box>
    //   <Box
    //     sx={{
    //       width: "40%",
    //       display: "flex",
    //       flexDirection: "column",
    //     }}
    //   >
    //     <Typography variant="h5">{label}</Typography>
    //     <Typography variant="h5">{description}</Typography>
    //     <Typography variant="h5">{price}</Typography>
    //   </Box>
    // </Card>
  );
}

export default ProductTile;
