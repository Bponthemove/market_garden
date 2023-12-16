export const categories = [
  {
    label: 'Subscription veg box',
    path: '/shop/vegbox',
    cat: 'vegbox',
  },
  {
    label: 'Fruit & Vegetables',
    path: '/shop/vegetables',
    cat: 'vegetables',
  },
  {
    label: 'Herbs and edible flowers',
    path: '/shop/herbsflowers',
    cat: 'herbsFlowers',
  },
  {
    label: 'Meat',
    path: '/shop/meat',
    cat: 'meat',
  },
  {
    label: 'Store cupboard',
    path: '/shop/storecupboard',
    cat: 'storeCupboard',
  },  
] as const;

export type Categories = typeof categories;
