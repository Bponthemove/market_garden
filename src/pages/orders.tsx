import {
  Box,
  Button,
  Table,
  TableBody,
  TableRow,
  Typography,
} from "@mui/material";
import { TableHead, TableCell } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useFirebase } from "../hooks/useFirebase";
import { CSVDownload } from "../components/CSVDownload";

const TableCellOrdersStyled = ({
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
  const [csv, getCSV] = useState(false);

  const { data } = useQuery(["getOrders"], getOrders);

  const orders = data || [];

  const parsed = orders.length
    ? orders.map((eachOrder) => {
        return {
          ...eachOrder,
          order: eachOrder.order ? JSON.parse(eachOrder.order) : "",
        };
      })
    : [];
    console.count("rendering");
  const handleGetCSV = () => {    
    getCSV(true);
  };

  return (
    <>
      <Box>
        <Button onClick={handleGetCSV} disabled={csv}>
          Download the orders for this weekend
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellOrdersStyled head>Delivery Day</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Name</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Email</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Address</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Price</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Products</TableCellOrdersStyled>
              <TableCellOrdersStyled head>Order Nr</TableCellOrdersStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {parsed &&
              parsed.length &&
              parsed
                .filter((order) => order.order)
                .sort((a, b) => {
                  if (a.deliveryDay < b.deliveryDay) return -1;
                  if (a.deliveryDay > b.deliveryDay) return 1;
                  return 0;
                })
                .map((order, idx) => {
                  const splitOrderNr = order.orderNr.match(/.{1,14}/g) ?? [];
                  return (
                    <TableRow key={idx}>
                      <TableCellOrdersStyled head={false}>
                        {order.deliveryDay}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {order.name}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {order.email}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {`${order.addressLineOne} ${order.addressLineTwo} ${order.town} ${order.postcode}`}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {order?.price?.toFixed(2) ?? "-"}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {order.order ? (
                          order.order.map(
                            (product: { label: string; quantity: number }) => (
                              <Fragment key={product.label}>
                                <Typography variant="caption" color="inherit">
                                  {`${product.label} x ${product.quantity} `}
                                </Typography>
                                <br />
                              </Fragment>
                            )
                          )
                        ) : (
                          <Typography>-</Typography>
                        )}
                      </TableCellOrdersStyled>
                      <TableCellOrdersStyled head={false}>
                        {splitOrderNr.map((stringBit: string) => (
                          <Fragment key={stringBit}>
                            <Typography variant="caption" color="inherit">
                              {stringBit}
                            </Typography>
                            <br />
                          </Fragment>
                        ))}
                      </TableCellOrdersStyled>
                    </TableRow>
                  );
                })}
            {(!orders || !orders.length) && (
              <TableRow>
                <TableCell>No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      {csv && (
        <Box sx={{ display: "none" }}>
          <CSVDownload getCSV={getCSV} csv={csv} orders={parsed} />
        </Box>
      )}
    </>
  );
}
