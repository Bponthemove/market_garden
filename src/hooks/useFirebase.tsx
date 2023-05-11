import { QueryFunctionContext } from "@tanstack/react-query";
import { useState } from "react";
import { IUserDetails, useAuthContext } from "../context/AuthContext";
import { database, db } from "../firebase";
import { IAddOrder, IAddProduct, IGetProduct, IUpdateProduct } from "../types/allTypes";
import {
  query,
  where,
  addDoc,
  getDocs,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";

export const useFirebase = () => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(false);
  const [firebaseError, setFirebaseError] = useState<string>("");
  const {cartItems, cartTotal} = useCartContext();
  const {currentUser} = useAuthContext();
  const {orderNr, deliveryDay} = useOrderContext();

  //------------------CRUD------------// 
  //----------------PRODUCTS----------//
  //create product
  const addProduct = async (product: IAddProduct) => {
    const { label, price } = product;
    const addedProductRef = await addDoc(collection(db, "product"), product);
    console.log("Document written with ID: ", addedProductRef.id);
    const addProductToStripe = await fetch(
      `.netlify/functions/stripeAddProduct?name=${label}&price=${price}&id=${addedProductRef.id}`,
      {
        method: "POST",
      }
    );
    console.log({ addProductToStripe });
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
    }))
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
    setFirebaseLoading(true)
    let firebaseResp, stripeResp;
    const { id } = toUpdate;
    try {
      if (id) {
        firebaseResp = await updateDoc(doc(db, "product", id), {
          ...toUpdate,
        });
        if (Object.keys(toUpdate).includes("label" || "price")) {
          const {label, price} = toUpdate;
          stripeResp = await fetch(
            `.netlify/functions/stripeUpdateProduct?id=${id}&name=${label || ''}&price=${price || ''}`,
            {
              method: "POST",
            }
          );
        }
      }
    } catch (err) {
      setFirebaseError(`Error updating product: id ${id}`)
    } finally {
      setFirebaseLoading(false)
    }
    console.log({ firebaseResp, stripeResp });
  };

  //delete product
  const deleteProduct = async (id: string) => {
    console.log(id)
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

  //delete user details

  //-----------orders----------//

  //create order
  const addOrder = async () => {

    const modifiedOrder = {
      name: `${currentUser.userDetails[0].firstName} ${currentUser.userDetails[0].lastName}`,
      email: currentUser.user?.email,
      phone: '',
      addressLineOne: currentUser.userDetails[0].addressLine1, 
      addressLineTwo: currentUser.userDetails[0].addressLine2,
      postcode: currentUser.userDetails[0].postcode,
      price: cartTotal,
      town: currentUser.userDetails[0].town,
      orderNr,
      deliveryDay,
      processed: false,
      order: JSON.stringify(cartItems)
    }
    
    try{
      const addedOrderRef = await addDoc(collection(db, "orders"), modifiedOrder);
      console.log("Order added with ID: ", addedOrderRef.id);
    } catch(err) {
      console.log("Error adding order", orderNr, err)
    }
  };

  //read orders
  // read all products in category
  const getOrders = async (
    context: QueryFunctionContext
  ): Promise<IAddOrder[] | undefined> => {
    const productRef = collection(db, "orders");
    const q = query(productRef, where("processed", "==", false));
    const querySnapShot = await getDocs(q);
    console.log({ querySnapShot });
    return querySnapShot?.docs.map((doc: { id: string; data: () => any }) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  //update field to processed
  const setOrdersToProcessed = async () => {
    const productRef = collection(db, "orders");
    const q = query(productRef, where("processed", "==", false));
    const querySnapShot = await getDocs(q);
    querySnapShot.docs.forEach(async(order) => {
      const docRef = doc(db, "orders", order.id);
      await updateDoc(docRef, {processed: true});
    });
  };

  //delete orders

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
    addOrder,
    getOrders,
    setOrdersToProcessed,
  };
};
