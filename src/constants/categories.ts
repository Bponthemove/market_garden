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
    label: 'Herbal Teas',
    path: '/shop/herbalteas',
    cat: 'herbalTeas',
  }, 
  {
    label: 'Honey',
    path: '/shop/honey',
    cat: 'honey',
  }, 
  {
    label: 'Skin Care',
    path: '/shop/skincare',
    cat: 'skinCare',
  }, 
  {
    label: 'Eggs',
    path: '/shop/eggs',
    cat: 'eggs',
  },  
] as const;

export type Categories = typeof categories;
