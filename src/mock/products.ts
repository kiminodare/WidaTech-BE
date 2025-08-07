import { Product } from '@/features/invoices/interfaces/products.interface';

export const products: Product[] = [
  {
    id: 1,
    name: 'Bluetooth Speaker',
    picture:
      'https://placehold.jp/30/0000FF/ffffff/300x150.png?text=Bluetooth+Speaker',
    stock: 25,
    price: 252000,
    cost: 210000,
  },
  {
    id: 2,
    name: 'Headphone',
    picture: 'https://placehold.jp/30/0000FF/ffffff/300x150.png?text=Headphone',
    stock: 30,
    price: 60000,
    cost: 50000,
  },
  {
    id: 3,
    name: 'Laptop Charger',
    picture:
      'https://placehold.jp/30/0000FF/ffffff/300x150.png?text=Laptop+Charger',
    stock: 40,
    price: 240000,
    cost: 200000,
  },
  {
    id: 4,
    name: 'LCD Monitor',
    picture:
      'https://placehold.jp/30/0000FF/ffffff/300x150.png?text=LCD+Monitor',
    stock: 12,
    price: 600000,
    cost: 500000,
  },
];
