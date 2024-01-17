import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { CSVDownload } from "../components/CSVDownload";
import { Order } from "../components/order";
import { useFirebase } from "../hooks/useFirebase";

const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const tomorrow = 24 * 60 * 60 * 1000;
const dayAfterTomorrow = 48 * 60 * 60 * 1000;

const TableCellOrdersStyled = ({
  children,
  head,
}: {
  children: React.ReactElement | string | React.ReactElement[];
  head: boolean;
}) => (
  <TableCell
    sx={{
      verticalAlign: "top",
      "&.MuiTableCell-root": {
        padding: "0",
        fontSize: "10px",
        span: {
          fontSize: "10px",
        },
      },
    }}
  >
    <Typography
      color={head ? "primary" : "black"}
      variant={head ? "subtitle2" : "caption"}
      fontSize="10px !important"
    >
      {children}
    </Typography>
  </TableCell>
);

export function Orders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getOrders, setOrderToProcessed } = useFirebase();
  const [csv, getCSV] = useState<boolean>(false);
  const [onlyShowUnprocessed, setOnlyShowUnprocessed] = useState<boolean>(true);

  const { data, refetch } = useQuery(["getOrders"], getOrders);

  const orders = data || [];
  const parsed = orders.length
    ? orders.map((eachOrder) => {
        return {
          ...eachOrder,
          order: eachOrder.order
            ? JSON.parse(eachOrder.order).reduce((string, item) => {
                string = `${string}${string ? ", " : ""}${item.label} x ${
                  item.quantity
                }`;
                return string;
              }, "")
            : "",
        };
      })
    : [];

  const handleGetCSV = () => {
    getCSV(true);
  };

  const nextDeliveryDay = () => {
    const now = new Date();
    now.setDate(now.getDate() + (now.getDay() === 6 ? 2 : 1));
    return now.toDateString();
  };

  const handleProcessing = (id, processed) => {
    setOrderToProcessed(id, processed);
    refetch();
  };

  const findDeliveryDay = (timestamp: string) => {
    const before4pm = new Date(timestamp).getHours() <= 15;

    const deliveryTimestamp = new Date(
      new Date(timestamp).getTime() + (before4pm ? tomorrow : dayAfterTomorrow)
    );

    const deliveryDate =
      deliveryTimestamp.getDay() === 0
        ? new Date(
            new Date(deliveryTimestamp).getTime() + tomorrow
          ).toLocaleDateString()
        : deliveryTimestamp.toLocaleDateString();

    const deliveryDay =
      deliveryTimestamp.getDay() === 0 ? 1 : deliveryTimestamp.getDay();

    return `${days[deliveryDay]} - ${deliveryDate}`;
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={2}
      >
        <Button
          onClick={handleGetCSV}
          disabled={
            true
            // csv ||
            // new Date().getDay() === 6 ||
            // new Date().toLocaleTimeString() < "16:01:00"
          }
        >
          Get orders for {nextDeliveryDay()}
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={onlyShowUnprocessed}
              onChange={() => setOnlyShowUnprocessed(!onlyShowUnprocessed)}
            />
          }
          label="Only show unprocessed orders"
        />
        {isMobile &&
          parsed &&
          parsed.length &&
          parsed
            .filter((order) => order.order)
            .filter((order) => (onlyShowUnprocessed ? !order.processed : order))
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((order, idx) => (
              <Order
                key={order.id}
                idx={idx}
                handleProcessing={handleProcessing}
                deliveryDay={findDeliveryDay(order.timestamp)}
                {...order}
              />
            ))}
        {!isMobile && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCellOrdersStyled head>Delivery day</TableCellOrdersStyled>
                <TableCellOrdersStyled head>Telephone</TableCellOrdersStyled>
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
                  .filter((order) =>
                    onlyShowUnprocessed ? !order.processed : order
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((order) => {
                    const splitOrderNr = order.orderNr.match(/.{1,14}/g) ?? [];
                    return (
                      <TableRow key={order.orderNr}>
                        <TableCellOrdersStyled head={false}>
                          {findDeliveryDay(order.timestamp)}
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          {order.phone}
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          {order.name}
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          {order.email}
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          <span>{order.addressLineOne}</span>
                          <br />
                          <span>{order.addressLineOne}</span>
                          <br />
                          <span>{order.town}</span>
                          <br />
                          <span>{order.postcode}</span>
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          {order?.price?.toFixed(2) ?? "-"}
                        </TableCellOrdersStyled>
                        <TableCellOrdersStyled head={false}>
                          {order.order ? (
                            order.order.split(",").map((product, idx) => (
                              <Fragment key={idx}>
                                <Typography variant="caption" color="inherit">
                                  {product}
                                </Typography>
                                <br />
                              </Fragment>
                            ))
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
        )}
      </Box>
      {csv && (
        <Box sx={{ display: "none" }}>
          <CSVDownload getCSV={getCSV} csv={csv} orders={parsed} />
        </Box>
      )}
    </>
  );
}
