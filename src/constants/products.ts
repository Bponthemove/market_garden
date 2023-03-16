import pepperRed from '../images/pepper_red.jpg';
import onions from '../images/onions.jfif';
import basil from '../images/basil.jfif';
import parsley from '../images/parsley.jfif';
import carrots from '../images/carrots.jfif';
import leeks from '../images/leeks.jfif';
import potatoes from '../images/potatoes.jfif';
import beetroot from '../images/beetroot.jfif';
import vegetables from '../images/vegetables.jfif';
import herbs from '../images/herbs.jfif';
import meat from '../images/meat.jfif';
import cheese from '../images/cheese.jfif';

export const products = [
  {
    id: 1,
    category: 'vegetable',
    dataKey: 'pepperRed',
    label: 'Pepper Red',
    price: 0.80,
    isOffer: false,
    perItem: true,
    image: pepperRed,
    description: 'blablabla',
    soldOut: false,
  },
  {
    id: 2,
    category: 'vegetable',
    dataKey: 'onions',
    label: 'Onions',
    price: 50,
    isOffer: false,
    perItem: false,
    image: onions,
    description: 'description',
    soldOut: false
  },
  {
    id: 3,
    category: 'herb',
    dataKey: 'basil',
    label: 'Basil',
    price: 0.99,
    isOffer: false,
    perItem: true,
    image: basil,
    description: 'description',
    soldOut: false,
  },
  {
    id: 4,
    category: 'herb',
    dataKey: 'parsley',
    label: 'Parsley',
    price: 1.25,
    isOffer: false,
    perItem: false,
    image: parsley,
    description: 'description',
    soldOut: false,
  },
  {
    id: 5,
    category: 'vegetable',
    dataKey: 'carrots',
    label: 'carrots',
    price: 1.40,
    isOffer: false,
    perItem: false,
    image: carrots,
    description: 'description',
    soldOut: false,
  },
  {
    id: 6,
    category: 'vegetable',
    dataKey: 'leeks',
    label: 'Leeks',
    price: 1.75,
    isOffer: false,
    perItem: false,
    image: leeks,
    description: 'description',
    soldOut: false,
  },
  {
    id: 7,
    category: 'vegetable',
    dataKey: 'potatoes',
    label: 'Potatoes',
    price: 0.80,
    isOffer: false,
    perItem: true,
    image: potatoes,
    description: 'description',
    soldOut: false,
  },
  {
    id: 8,
    category: 'vegetable',
    dataKey: 'beetroot',
    label: 'Beetroot',
    price: 1.25,
    isOffer: false,
    perItem: false,
    image: beetroot,
    description: 'description',
    soldOut: false,
  }
];

export const categories = [
  {
    id: 1,    
    dataKey: 'vegetables',
    label: 'Vegetables',
    image: vegetables,
  },
  {
    id: 2,    
    dataKey: 'herbs',
    label: 'Herbs',
    image: herbs,
  },
  {
    id: 3,    
    dataKey: 'meat',
    label: 'Meat',
    image: meat,
  },
  {
    id: 4,    
    dataKey: 'cheese',
    label: 'Cheese',
    image: cheese,
  },
];