import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Grid, TableRow } from "@mui/material";
import { ICartItem, useCartContext } from "../context/CartContext";
import { TableCellStyled } from "../pages/Cart";

export function CartItem({ item }: { item: ICartItem }) {
  const { decreaseCartQuantity, increaseCartQuantity } = useCartContext();

  const { label, price, quantity, id } = item;

  return (
    <TableRow>
      <TableCellStyled>
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
      </TableCellStyled>
      <TableCellStyled>{`${label ?? "-"} x ${
        quantity ?? 0
      }  =`}</TableCellStyled>
      <TableCellStyled>
        {`£ ${price ? (quantity * Math.round(price * 100)) / 100 : 0}`}
      </TableCellStyled>
    </TableRow>
  );
}
