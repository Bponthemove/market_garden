import {
  Card,
  Box,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Grid,
} from "@mui/material";
import { useCartContext } from "../context/CartContext";
import { IProduct } from "../types/IProduct";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ButtonBase from "@mui/material/ButtonBase";

function ProductTile({ product }: { product: IProduct }) {
  const {
    id,
    category,
    dataKey,
    label,
    price,
    isOffer,
    perItem,
    image,
    description,
    soldOut,
  } = product;

  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    getItemQuantity,
  } = useCartContext();

  return (
    <Grid
      item
      key={id}
      position="relative"
      sx={{
        height: "15rem",
        width: "15rem",
        gridTemplateColumns: "repeat(auto-fill, auto)",
      }}
    >
      <ImageListItem
        sx={{
          height: 'inherit !important'
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
          {getItemQuantity(id)}
        </Box>
        <img
          src={image}
          srcSet={image}
          width="100%"
          height="100%"
          alt={label}
          loading="lazy"
        />
        <ImageListItemBar
          title={label}
          subtitle={description}
          actionIcon={
            <>
              <AddCircleIcon
                color="primary"
                onClick={() => increaseCartQuantity(id)}
                sx={{
                  cursor: 'pointer'
                }}
              />
              <RemoveCircleIcon
                color={getItemQuantity(id) === 0 ? "disabled" : "primary"}
                onClick={() => decreaseCartQuantity(id)}
                sx={{
                  cursor: 'pointer'
                }}
              />
            </>
          }
        />
      </ImageListItem>
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
