import React from "react";
import ProductTile from "../../components/ProductTile";
import { products } from "../../constants/products";

export default function vegetables() {
  return (
    <>
      {products.map(
        (product) =>
          product.category === "vegetable" && (
            <ProductTile product={product} key={product.id} />
          )
      )}
    </>
  );
}
