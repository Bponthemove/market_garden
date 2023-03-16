import { Box, Grid, Table, TableRow, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { products } from "../constants/products";
import { ICartItem, useCartContext } from "../context/CartContext";
import { IProduct } from "../types/IProduct";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export function CartItem({ id, quantity }: ICartItem) {
  const item: IProduct | undefined = products.find(
    (product) => product.id === id
  );

  const { decreaseCartQuantity, increaseCartQuantity } = useCartContext()

  const { label, price } = item ?? {};

  return (
    <TableRow>
      <TableCell>
        <Grid container>
          <AddCircleIcon
            color="primary"
            onClick={() => increaseCartQuantity(id)}
            sx={{
              cursor: "pointer",
            }}
          />
          <RemoveCircleIcon
            color="primary"
            onClick={() => decreaseCartQuantity(id)}
            sx={{
              cursor: "pointer",
            }}
          />
        </Grid>
      </TableCell>
      <TableCell>
        <Typography variant="h3">{label ?? "-"}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5">X</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5">{quantity ?? 0}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5">=</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5">{price ? quantity * price : 0}</Typography>
      </TableCell>
    </TableRow>
  );
}
