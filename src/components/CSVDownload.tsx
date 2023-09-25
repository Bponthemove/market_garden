import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import { useToast } from "../hooks/useToast";
import { IGetOrder } from "../types/allTypes";

export function CSVDownload({
  getCSV,
  csv,
  orders,
}: {
  csv: boolean;
  getCSV: Dispatch<SetStateAction<boolean>>;
  orders: IGetOrder[];
}) {
  const csvRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  const { error } = useToast();
  //const { saturday, sunday, monday } = useDate("csv");
  //const daysArray = [saturday, sunday, monday];

  const filteredOrders = orders?.filter((order) => !order.processed);

  //TODO remove the orders from the database, maybe the order from 4 weeks ago and before

  useEffect(() => {
    if (filteredOrders.length && csv) {
      csvRef?.current?.link.click();
    }

    if (!filteredOrders.length) error("No orders found.");

    getCSV(false);
  }, [csv, error, filteredOrders.length, getCSV]);

  //find this weekend's orders
  return (
    <CSVLink
      data={orders}
      filename={`orders ${new Date()}`}
      target="_blank"
      ref={csvRef}
    />
  );
}
