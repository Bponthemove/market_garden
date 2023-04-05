import { QueryFunctionContext } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IUserDetails, superUsers } from "../context/AuthContext";
import { auth, database, db } from "../firebase";
import { IAddProduct, IGetProduct } from "../types/allTypes";
import { query, where, addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import getStripe from "../stripe";

const stripePromise = getStripe();

export const useFirebase = () => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(false);
  const [firebaseError, setFirebaseError] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  //----------------PRODUCTS----------//
  //add product
  const addProduct = async (
    product: IAddProduct
  ) => {
    const {label, price} = product;
    const addedProductRef = await addDoc(collection(db, "product"), product);
    console.log("Document written with ID: ", addedProductRef.id);
    const addProductToStripe = await fetch(`.netlify/functions/stripeAddProduct?name=${label}&price=${price}&id=${addedProductRef.id}`, {
      method: "POST",
    });
    console.log({addProductToStripe})
  };

  // get all products in category
  const getProducts = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[] | undefined> => {
    const [queryKey] = context.queryKey;
    const productRef = collection(db, 'product');
    const q = query(productRef, where("category", "==", queryKey));
    const querySnapShot = await getDocs(q);
    console.log({querySnapShot})
    return querySnapShot?.docs.map(
      (doc: { id: string; data: () => any }) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };

  //get product by id and category
  const getProductById = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[]> => {
    const [, id] = context.queryKey;
    const q = query(database.products, where("id", "==", id));
    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.map(
      (doc: { id: string; data: () => any }) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };

  //update product
  const updateProduct = async (
    context: QueryFunctionContext
  ): Promise<void> => {
    const [, id, toUpdate] = context.queryKey;
    const updating = toUpdate ?? {};
    const toUpdateRef = doc(db, "product", `${id}`);
    const firebaseResp = await updateDoc(toUpdateRef, {
      ...updating
    });
    let stripeResp;
    if (Object.keys(updating).includes('label' || 'price')){
      stripeResp = await fetch(`.netlify/functions/stripeUpdateProduct?id=${id}&product=${toUpdate}`, {
        method: "POST",
      });
    }
    console.log({firebaseResp, stripeResp})
  };

  //delete product
  const deleteProduct = async (
    context: QueryFunctionContext
    ): Promise<void> => {
    const [, id] = context.queryKey;
    const firebaseResp = await deleteDoc(doc(db, "product", `${id}`));
    const stripeResp = await fetch(`.netlify/functions/stripeDeleteProduct?id=${id}`, {
      method: "POST",
    });
    console.log({firebaseResp, stripeResp})
  };

  //-----------------USER--------------//

  //add user details
  const addUserDetails  = async (user: IUserDetails) => {
    const addedUserRef = await addDoc(collection(db, "users"), user);
    console.log("Document written with ID: ", addedUserRef.id);
  };

  //get user details
  const getUserDetails = async (
    context: QueryFunctionContext
  ): Promise<IUserDetails[] | undefined> => {
    const [, uid] = context.queryKey;
    const q = query(database.users, where("uid", "==", uid));
    const querySnapShot = await getDocs(q);
    console.log({querySnapShot})
    return querySnapShot.docs.map(
      (doc: { id: string; data: () => any }) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };

  //modify product

  //delete user details

  useEffect(() => {
    if (firebaseLoading) {
      //check if current user is part of the super users
      const user = auth.currentUser;
      setAuthenticated(superUsers.includes(user?.email?.toLowerCase() ?? ""));
    }
  }, [firebaseLoading]);

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
  };
};
