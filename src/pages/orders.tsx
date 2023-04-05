import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { CartItem } from "../components/CartItem";
import { useCartContext } from "../context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckOut } from "./checkOut";
import { TableHead } from "@mui/material";

const orders = [
  {
    name: 'Bob Dylan',
    email: 'bobD@dd.com',
    address: 'roundfield 49, upper Bucklebury, RG8 9YY',
    price: 24.49,
    products: 'red pepper 2, leek 3, mushrooms 1, coriander 1'
  },
  {
    name: 'Susie Loovie',
    email: 'ss@dd.com',
    address: 'roundfield 76, Bucklebury, RG8 6lY',
    price: 35.49,
    products: 'red pepper 8, leek 1, mushrooms 4, coriander 2'
  }
]

export function Orders() {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h5">Name</Typography></TableCell>
            <TableCell><Typography variant="h5">Email</Typography></TableCell>
            <TableCell><Typography variant="h5">Address</Typography></TableCell>
            <TableCell><Typography variant="h5">Price</Typography></TableCell>
            <TableCell><Typography variant="h5">Products</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, idx) => (
            <TableRow>
              <TableCell>
                <Typography variant="h6">{order.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{order.email}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{order.address}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{order.price}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{order.products}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
