import { QueryFunctionContext } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { IUserDetails, useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";
import { database, db } from "../firebase";
import {
  IAddOrder,
  IAddProduct,
  IGetProduct,
  IUpdateProduct,
} from "../types/allTypes";

export const useFirebase = () => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(false);
  const [firebaseError, setFirebaseError] = useState<string>("");
  const { cartItems, cartTotal } = useCartContext();
  const { currentUser } = useAuthContext();
  const { orderNr } = useOrderContext();

  //------------------CRUD------------//
  //----------------PRODUCTS----------//
  //create product
  const addProduct = async (product: IAddProduct) => {
    const { label, price } = product;
    const addedProductRef = await addDoc(collection(db, "product"), product);
    try {
      const response = await fetch(
        `.netlify/functions/stripeAddProduct?name=${label}&price=${price}&id=${addedProductRef.id}`,
        {
          method: "POST",
        }
      );
      console.log(response);
    } catch (err) {
      console.error("Item not added to Stripe: " + err);
    }
  };

  // read all products in category
  const getProducts = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[] | undefined> => {
    const [queryKey] = context.queryKey;
    const productRef = collection(db, "product");
    const q = query(productRef, where("category", "==", queryKey));
    const querySnapShot = await getDocs(q);
    return querySnapShot?.docs.map((doc: { id: string; data: () => any }) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  //read product by id and category
  const getProductById = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[]> => {
    const [, id] = context.queryKey;
    const q = query(database.products, where("id", "==", id));
    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.map((doc: { id: string; data: () => any }) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  //update product
  const updateProduct = async (toUpdate: IUpdateProduct) => {
    setFirebaseLoading(true);
    let firebaseResp, stripeResp;
    const { id } = toUpdate;
    try {
      if (id) {
        firebaseResp = await updateDoc(doc(db, "product", id), {
          ...toUpdate,
        });
        if (Object.keys(toUpdate).includes("label" || "price")) {
          const { label, price } = toUpdate;
          stripeResp = await fetch(
            `.netlify/functions/stripeUpdateProduct?id=${id}&name=${
              label || ""
            }&price=${price || ""}`,
            {
              method: "POST",
            }
          );
        }
      }
    } catch (err) {
      setFirebaseError(`Error updating product: id ${id}`);
    } finally {
      setFirebaseLoading(false);
    }
    console.log({ firebaseResp, stripeResp });
  };

  //delete product
  const deleteProduct = async (id: string) => {
    console.log(id);
    const firebaseResp = await deleteDoc(doc(db, "product", id));
    const stripeResp = await fetch(
      `.netlify/functions/stripeDeleteProduct?id=${id}`,
      {
        method: "POST",
      }
    );
    console.log({ firebaseResp, stripeResp });
  };

  //-----------------USER--------------//

  //add user details
  const addUserDetails = async (user: IUserDetails) => {
    const addedUserRef = await addDoc(collection(db, "users"), user);
    console.log("Document written with ID: ", addedUserRef.id);
  };

  //get user details
  const getUserDetails = async (
    context: QueryFunctionContext
  ): Promise<IUserDetails[]> => {
    const [, uid] = context.queryKey;
    const q = query(database.users, where("uid", "==", uid));
    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.map((doc: { id: string; data: () => any }) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  // check for existing accounts
  const existingAccount = async (
    context: QueryFunctionContext
  ): Promise<boolean> => {
    const [, email] = context.queryKey;
    const q = query(database.users, where("email", "==", email));
    const querySnapShot = await getDocs(q);
    console.log(querySnapShot.docs)
    return querySnapShot.docs.length > 0;
  };

  //delete user details

  //-----------orders----------//

  //create order
  const addOrder = async () => {
    const modifiedOrder = {
      name: `${currentUser.userDetails[0].firstName} ${currentUser.userDetails[0].lastName}`,
      email: currentUser.user?.email,
      phone: currentUser.userDetails[0].phone,
      addressLineOne: currentUser.userDetails[0].addressLine1,
      addressLineTwo: currentUser.userDetails[0].addressLine2,
      postcode: currentUser.userDetails[0].postcode,
      price: cartTotal,
      town: currentUser.userDetails[0].town,
      orderNr: "",
      processed: false,
      timestamp: new Date().toISOString(),
      order: JSON.stringify(cartItems),
    };

    try {
      const addedOrderRef = await addDoc(
        collection(db, "orders"),
        modifiedOrder
      );
      console.log("Order added with ID: ", addedOrderRef.id);
    } catch (err) {
      console.log("Error adding order", orderNr, err);
    }
  };

  //read orders
  // read all products in category
  const getOrders = async (
    context: QueryFunctionContext
  ): Promise<IAddOrder[] | undefined> => {
    const productRef = collection(db, "orders");
    const q = query(
      productRef,
      where("processed", "==", false),
      where("timestamp", ">=", "2023-11-02T15:56:51.887Z"),
      where("timestamp", "<=", "2023-11-06T12:56:51.887Z")
      //where("timestamp", ">=", ordersRange().start),
      //where("timestamp", "<=", ordersRange().end),
    );
    const querySnapShot = await getDocs(q);
    const orders = querySnapShot?.docs.map(
      (doc: { id: string; data: () => any }) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
    return orders;
  };

  //update field to processed
  const setOrdersToProcessed = async () => {
    const productRef = collection(db, "orders");
    const q = query(
      productRef,
      where("processed", "==", false),
      where("timestamp", ">", ordersRange().start),
      where("timestamp", "<", ordersRange().end)
    );
    const querySnapShot = await getDocs(q);
    querySnapShot.docs.forEach(async (order) => {
      const docRef = doc(db, "orders", order.id);
      await updateDoc(docRef, { processed: true });
    });
    // if day is monday, delete orders for previous week
    if (new Date().getDay() === 0) {
      try {
        await deleteOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  //delete orders
  const deleteOrders = async () => {
    const productRef = collection(db, "orders");
    const q = query(
      productRef,
      where("processed", "==", true),
      where("timestamp", ">", deleteRange().start),
      where("timestamp", "<", deleteRange().end)
    );
    const querySnapShot = await getDocs(q);
    querySnapShot?.docs.map((doc) => deleteDoc(doc.ref));

    console.log(
      `Deleting orders in range ${new Date(deleteRange().start)} - ${new Date(
        deleteRange().end
      )}: ${querySnapShot}`
    );
  };

  // helpers
  const deleteRange = () => {
    const date = new Date();
    date.setHours(parseFloat("16"));
    date.setMinutes(parseFloat("00"));
    date.setSeconds(parseFloat("00"));
    const start = date.setDate(date.getDate() - 21);
    const end = date.setDate(date.getDate() - 14);

    return {
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    };
  };

  const ordersRange = () => {
    const date = new Date();
    date.setHours(parseFloat("16"));
    date.setMinutes(parseFloat("00"));
    date.setSeconds(parseFloat("00"));
    const start = date.setDate(date.getDate() - (date.getDay() === 0 ? 2 : 1));

    return {
      start: new Date(start).toISOString(),
      end: date.toISOString(),
    };
  };

  // useEffect(() => {
  //   if (firebaseLoading) {
  //     //check if current user is part of the super users
  //     const user = auth.currentUser;
  //     setAuthenticated(superUsers.includes(user?.email?.toLowerCase() ?? ""));
  //   }
  // }, [firebaseLoading]);

  return {
    firebaseLoading,
    firebaseError,
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addUserDetails,
    getUserDetails,
    existingAccount,
    addOrder,
    getOrders,
    setOrdersToProcessed,
  };
};
