export const categories = [
  {
    label: "Subscription Veg Box",
    path: "",
    cat: "vegbox",
  },
  {
    label: "Fruit & Vegetables",
    path: "/shop/vegetables",
    cat: "vegetables",
  },
  {
    label: "Herbs and Edible Flowers",
    path: "/shop/herbsflowers",
    cat: "herbsFlowers",
  },
  {
    label: "Meat",
    path: "/shop/meat",
    cat: "meat",
  },
  {
    label: "Herbal Teas",
    path: "/shop/herbalteas",
    cat: "herbalTeas",
  },
  {
    label: "Honey",
    path: "/shop/honey",
    cat: "honey",
  },
  {
    label: "Skin Care",
    path: "/shop/skincare",
    cat: "skinCare",
  },
  {
    label: "Eggs",
    path: "/shop/eggs",
    cat: "eggs",
  },
  {
    label: "Store Cupboard",
    path: "/shop/storecupboard",
    cat: "storeCupboard",
  },
  {
    label: "Cut Flowers",
    path: "/shop/cutFlowers",
    cat: "cutFlowers",
  },
] as const;

export type Categories = typeof categories;
