interface ICat {
  id: number;    
  dataKey: string;
  label: string;
  path: string;
  image: string;  
}

export const categories: ICat[] = [
  {
    id: 1,    
    dataKey: 'vegetables',
    label: 'Vegetables',
    path: '/shop/vegetables',
    image: 'https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fvegetables.jfif?alt=media&token=c2c9ede6-587c-404b-9ef5-b3f5599f3c33',
  },
  {
    id: 2,    
    dataKey: 'herbs',
    label: 'Herbs',
    path: '/shop/herbs',
    image: 'https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fherbs.jfif?alt=media&token=a78a45f9-bf08-4b09-8d90-0569e45f953f',
  },
  {
    id: 3,    
    dataKey: 'meat',
    label: 'Meat',
    path: '/shop/meat',
    image: 'https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fmeat.jfif?alt=media&token=f78f4ff3-3796-494f-bcde-aec869f19fcf',
  },
  {
    id: 4,    
    dataKey: 'cheese',
    label: 'Cheese',
    path: '/shop/cheese',
    image: 'https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fcheese.jfif?alt=media&token=67e35d78-b7c2-424e-ba0c-7422af4062a2'    ,
  },
];