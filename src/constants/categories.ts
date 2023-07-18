export const categories = [
  {
    label: 'Veg Box',
    path: '/shop/vegbox',
    cat: 'vegbox',
  },
  {
    label: 'Fruit & Vegetables',
    path: '/shop/vegetables',
    cat: 'vegetables',
  },
  {
    label: 'Eggs',
    path: '/shop/eggs',
    cat: 'eggs',
  },
  {
    label: 'Meat',
    path: '/shop/meat',
    cat: 'meat',
  },
  {
    label: 'More',
    path: '/shop/more',
    cat: 'more',
  },  
] as const;

export type Categories = typeof categories;
