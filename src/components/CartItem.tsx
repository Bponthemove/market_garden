import { Grid, TableRow } from "@mui/material";
import TableCell from "@mui/material/TableCell";
//import { products } from "../constants/products";
import { ICartItem, useCartContext } from "../context/CartContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { TableCellStyled } from "../pages/Cart";

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
      <TableCellStyled>
        {label ?? "-"}
      </TableCellStyled>
      <TableCellStyled>
        {`x ${quantity ?? 0}`}
      </TableCellStyled>
      <TableCellStyled>
        =
      </TableCellStyled>
      <TableCellStyled>
        
          {price ? quantity * price : 0}
        
      </TableCellStyled>
    </TableRow>
  );
}
