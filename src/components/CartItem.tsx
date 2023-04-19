import { Grid, TableRow, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
//import { products } from "../constants/products";
import { ICartItem, useCartContext } from "../context/CartContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export function CartItem({ item }: { item: ICartItem }) {
  const { decreaseCartQuantity, increaseCartQuantity } = useCartContext();

  const { label, price, quantity, id } = item;

  return (
    <TableRow>
      <TableCell>
        <Grid container>
          <AddCircleIcon
            color="primary"
            onClick={() => increaseCartQuantity(item)}
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
        <Typography variant="h5">{label ?? "-"}</Typography>
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
