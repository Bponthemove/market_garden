import React from "react";
import ProductTile from "../../components/ProductTile";
import { products } from "../../constants/products";

export default function herbs() {
  return (
    <>
      {products.map(
        (product) =>
          product.category === "herb" && (
            <ProductTile product={product} key={product.id} />
          )
      )}
    </>
  );
}
