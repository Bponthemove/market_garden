import { Box, Table, TableBody, TableRow, Typography } from "@mui/material";
import { TableHead, TableCell } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useFirebase } from "../hooks/useFirebase";

const TableCellStyled = ({
  children,
  head,
}: {
  children: React.ReactElement | string | React.ReactElement[];
  head: boolean;
}) => (
  <TableCell sx={{ verticalAlign: "top" }}>
    <Typography
      color={head ? "primary" : "black"}
      variant={head ? "subtitle2" : "caption"}
    >
      {children}
    </Typography>
  </TableCell>
);

export function Orders() {
  const { getOrders } = useFirebase();

  const { data } = useQuery(["getOrders"], getOrders);

  const orders = data || [];

  const parsed = orders.length ? orders.map((eachOrder) => {
    console.log('parsing', orders)
    return ({
      ...eachOrder,
      order: eachOrder.order ? JSON.parse(eachOrder.order) : '',
    });
  }) : [];

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCellStyled head>Name</TableCellStyled>
            <TableCellStyled head>Email</TableCellStyled>
            <TableCellStyled head>Address</TableCellStyled>
            <TableCellStyled head>Price</TableCellStyled>
            <TableCellStyled head>Products</TableCellStyled>
            <TableCellStyled head>Order Nr</TableCellStyled>
          </TableRow>
        </TableHead>
        <TableBody>
          {parsed && parsed.length && parsed.filter(order => order.order).map((order, idx) => {
            const splitOrderNr = order.orderNr.match(/.{1,14}/g) ?? [];
            return (
              <TableRow key={idx}>
                <TableCellStyled head={false}>{order.name}</TableCellStyled>
                <TableCellStyled head={false}>{order.email}</TableCellStyled>
                <TableCellStyled head={false}>
                  {`${order.addressLineOne} ${order.addressLineTwo} ${order.town} ${order.postcode}`}
                </TableCellStyled>
                <TableCellStyled head={false}>
                  {order?.price?.toFixed(2) ?? '-'}
                </TableCellStyled>
                <TableCellStyled head={false}>
                  {order.order ? order.order.map(
                    (product: { label: string; quantity: number }) => (
                      <Fragment key={product.label}>
                        <Typography
                          
                          variant="caption"
                          color="inherit"
                        >
                          {`${product.label} x ${product.quantity} `}
                        </Typography>
                        <br />
                      </Fragment>
                    )
                  ) : (
                    <Typography>-</Typography>
                  )}
                </TableCellStyled>
                <TableCellStyled head={false}>
                  {splitOrderNr.map((stringBit: string) => (
                    <Fragment  key={stringBit}>
                      <Typography
                       
                        variant="caption"
                        color="inherit"
                      >
                        {stringBit}
                      </Typography>
                      <br />
                    </Fragment>
                  ))}
                </TableCellStyled>
              </TableRow>
            );
          })}
          {(!orders || !orders.length) && (
              <TableRow>
                <TableCell>No orders found</TableCell>
              </TableRow>
          ) }
        </TableBody>
      </Table>
    </Box>
  );
}
