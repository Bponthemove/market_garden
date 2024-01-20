import { QueryFunctionContext } from "@tanstack/react-query";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { TAuthSignIn } from "../components/SignInForm";
import { IUserDetails, useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useDeliveryContext } from "../context/DeliveryContext";
import { database, db } from "../firebase";
import { TMyDetailsWithID } from "../pages/myDetails";
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
  const { currentUser, logOut } = useAuthContext();
  const { deliveryDetails } = useDeliveryContext();

  //------------------CRUD------------//
  //----------------PRODUCTS----------//
  //create product
  const addProduct = async (product: IAddProduct) => {
    let addedProductRef;
    try {
      addedProductRef = await addDoc(collection(db, "product"), product);
    } catch (err) {
      console.error("Item not added to DB" + err)
    }
    const { label, price } = product;    
    if (!addedProductRef) throw new Error('Error adding product to DB')
    try {
      await fetch(
        `/.netlify/functions/stripeAddProduct?name=${label}&price=${price}&id=${addedProductRef.id}`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.error("Item not added to Stripe: " + err);
    }
  };

  // get all products for stock levels
  const getProductsForStock = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[] | undefined> => {
    const productRef = collection(db, "product");
    const querySnapShot = await getDocs(productRef);
    return querySnapShot?.docs.map((doc: { id: string; data: () => any }) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  // read all products in category
  const getProductsByCategory = async (
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

    const { id } = toUpdate;
    try {
      if (id) {
        await updateDoc(doc(db, "product", id), {
          ...toUpdate,
        });
        const toUpdateKeys = Object.keys(toUpdate);
        let url = `/.netlify/functions/stripeUpdateProduct?id=${id}`;
        if (toUpdateKeys.includes("label")) url += `&name=${toUpdate.label}`;
        if (toUpdateKeys.includes("price")) url += `&price=${toUpdate.price}`;
        await fetch(url, {
          method: "POST",
        });
      }
    } catch (err) {
      setFirebaseError(`Error updating product: id ${id}`);
    } finally {
      setFirebaseLoading(false);
    }
  };

  const updateProductStockLevel = async (product: IUpdateProduct) => {
    setFirebaseLoading(true);
    const { id, stockLevel } = product;
    try {
      if (id) {
        await updateDoc(doc(db, "product", id), {
          stockLevel,
        });
      }
    } catch (err) {
      setFirebaseError(`Error updating product: id ${id}`);
    } finally {
      setFirebaseLoading(false);
    }
  };

  //delete product
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "product", id));
    await fetch(`/.netlify/functions/stripeDeleteProduct?id=${id}`, {
      method: "POST",
    });
  };

  //-----------------USER--------------//

  //add user details
  const addUserDetails = async (user: IUserDetails) => {
    const addedUserRef = doc(collection(db, "users"), user.uid);
    await setDoc(addedUserRef, user);
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
    return querySnapShot.docs.length > 0;
  };

  //update user
  const updateUserDetails = async (toUpdate: TMyDetailsWithID) => {
    setFirebaseLoading(true);

    const { id, ...rest } = toUpdate;
    try {
      if (id) {
        await updateDoc(doc(db, "users", id), {
          ...rest,
        });
      }
    } catch (err) {
      setFirebaseError(`Error updating user: id ${id}`);
    } finally {
      setFirebaseLoading(false);
    }
  };

  //delete user details
  const deleteThisUser = async (credentials: TAuthSignIn) => {
    let response;
    if (!credentials.email) {
      try {
        await deleteUser(currentUser.user);
        response = { status: 200, message: "user deleted successfully" };
        await deleteDoc(doc(db, "users", currentUser.user.uid));
        logOut();
      } catch (err) {
        response = { status: 500, message: err.toString() };
      } finally {
        return response;
      }
    } else {
      try {
        const credential = await EmailAuthProvider.credential(
          credentials.email,
          credentials.password
        );
        await reauthenticateWithCredential(currentUser.user, credential);
      } catch (err) {
        console.error(err);
      }
    }
  };

  //-----------orders----------//

  //create order
  const addOrder = async () => {
    const modifiedOrder = {
      name: `${
        deliveryDetails?.firstName ?? currentUser.userDetails[0].firstName
      } ${deliveryDetails?.lastName ?? currentUser.userDetails[0].lastName}`,
      email: deliveryDetails?.email ?? currentUser.user?.email,
      phone: deliveryDetails?.phone ?? currentUser.userDetails[0].phone,
      addressLineOne:
        deliveryDetails?.addressLine1 ??
        currentUser.userDetails[0].addressLine1,
      addressLineTwo:
        deliveryDetails?.addressLine2 ??
        currentUser.userDetails[0].addressLine2,
      postcode:
        deliveryDetails?.postcode ?? currentUser.userDetails[0].postcode,
      price: cartTotal,
      town: deliveryDetails?.town ?? currentUser.userDetails[0].town,
      orderNr: "",
      processed: false,
      timestamp: new Date().toISOString(),
      order: JSON.stringify(cartItems),
    };

    try {
      await addDoc(collection(db, "orders"), modifiedOrder);
    } catch (err) {
      console.error(err);
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
      // where("processed", "==", false)

      where("timestamp", ">=", ordersRange().start),
      where("timestamp", "<=", ordersRange().end)
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

  const setOrderToProcessed = async (id: string, processed: boolean) => {
    setFirebaseLoading(true);
    try {
      if (id) {
        await updateDoc(doc(db, "orders", id), {
          processed,
        });
      }
    } catch (err) {
      setFirebaseError(`Error processing order: id ${id}`);
    } finally {
      setFirebaseLoading(false);
    }
  };

  //update field to processed
  // const setOrdersToProcessed = async () => {
  //   const productRef = collection(db, "orders");
  //   const q = query(
  //     productRef,
  //     where("processed", "==", false),
  //     where("timestamp", ">", ordersRange().start),
  //     where("timestamp", "<", ordersRange().end)
  //   );
  //   const querySnapShot = await getDocs(q);
  //   querySnapShot.docs.forEach(async (order) => {
  //     const docRef = doc(db, "orders", order.id);
  //     await updateDoc(docRef, { processed: true });
  //   });
  // if day is monday, delete orders for previous week
  // if (new Date().getDay() === 0) {
  //   try {
  //     await deleteOrders();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  //};

  //delete orders
  // const deleteOrders = async () => {
  //   const productRef = collection(db, "orders");
  //   const q = query(
  //     productRef,
  //     where("processed", "==", true),
  //     where("timestamp", ">", deleteRange().start),
  //     where("timestamp", "<", deleteRange().end)
  //   );
  //   const querySnapShot = await getDocs(q);
  //   querySnapShot?.docs.map((doc) => deleteDoc(doc.ref));
  // };

  // helpers
  // const deleteRange = () => {
  //   const date = new Date();
  //   date.setHours(parseFloat("16"));
  //   date.setMinutes(parseFloat("00"));
  //   date.setSeconds(parseFloat("00"));
  //   const start = date.setDate(date.getDate() - 21);
  //   const end = date.setDate(date.getDate() - 14);

  //   return {
  //     start: new Date(start).toISOString(),
  //     end: new Date(end).toISOString(),
  //   };
  // };

  const ordersRange = () => {
    const date = new Date();
    date.setHours(parseFloat("16"));
    date.setMinutes(parseFloat("00"));
    date.setSeconds(parseFloat("00"));
    const start = date.setDate(date.getDate() - 3); //(date.getDay() === 0 ? 2 : 1));

    return {
      start: new Date(start).toISOString(),
      end: new Date().toISOString(),
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
    getProductsForStock,
    getProductsByCategory,
    getProductById,
    updateProduct,
    updateProductStockLevel,
    deleteProduct,
    addUserDetails,
    getUserDetails,
    updateUserDetails,
    deleteThisUser,
    existingAccount,
    addOrder,
    getOrders,
    setOrderToProcessed,
  };
};
