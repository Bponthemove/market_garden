import { QueryFunctionContext } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IUserDetails, superUsers } from "../context/AuthContext";
import { auth, database, db } from "../firebase";
import { IAddProduct, IGetProduct } from "../types/allTypes";
import { query, where, addDoc, getDocs, collection } from "firebase/firestore";

export const useFirebase = () => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(false);
  const [firebaseError, setFirebaseError] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  //----------------PRODUCTS----------//
  //add product
  const addProduct = async (
    product: IAddProduct
  ) => {
    const addedProductRef = await addDoc(collection(db, "product"), product);
    console.log("Document written with ID: ", addedProductRef.id);
  };

  // get all products in category
  const getProducts = async (
    context: QueryFunctionContext
  ): Promise<IGetProduct[] | undefined> => {
    const [queryKey] = context.queryKey;
    const q = query(database.products, where("category", "==", queryKey));
    const querySnapShot = await getDocs(q);
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
  // const updateById = async (
  //   context: QueryFunctionContext
  // ): Promise<IGetProduct[]> => {
  //   const [, id, toUpdate] = context.queryKey;
  //   const productRef = doc(db, 'products', id )
  //   const querySnapShot = await database.products.where("id", "==", id);
  //   return querySnapShot.update
  // };

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
    addUserDetails,
    getUserDetails,
  };
};
