import { create } from "zustand";
import { persist } from "zustand/middleware";

// Sample data
const sampleProducts = [
  {
    id: "1",
    name: "Organic Bananas",
    category: "Fruits",
    price: 2.99,
    stock: 150,
    unit: "bunch",
    description: "Fresh organic bananas from Ecuador",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Fresh Milk",
    category: "Dairy",
    price: 4.49,
    stock: 80,
    unit: "gallon",
    description: "Farm fresh whole milk",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    createdAt: "2025-01-16T10:00:00Z",
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 3.99,
    stock: 45,
    unit: "loaf",
    description: "Freshly baked whole wheat bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    createdAt: "2025-01-17T10:00:00Z",
  },
  {
    id: "4",
    name: "Fresh Salmon",
    category: "Seafood",
    price: 12.99,
    stock: 25,
    unit: "lb",
    description: "Wild-caught Atlantic salmon",
    image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400",
    createdAt: "2025-01-18T10:00:00Z",
  },
  {
    id: "5",
    name: "Organic Spinach",
    category: "Vegetables",
    price: 3.49,
    stock: 8,
    unit: "bag",
    description: "Fresh organic baby spinach",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    createdAt: "2025-01-19T10:00:00Z",
  },
  {
    id: "6",
    name: "Free Range Eggs",
    category: "Dairy",
    price: 5.99,
    stock: 0,
    unit: "dozen",
    description: "Farm fresh free-range eggs",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    createdAt: "2025-01-20T10:00:00Z",
  },
];

const sampleOrders = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    items: [
      { productId: "1", productName: "Organic Bananas", quantity: 2, price: 2.99 },
      { productId: "2", productName: "Fresh Milk", quantity: 1, price: 4.49 },
    ],
    total: 10.47,
    status: "delivered",
    createdAt: "2025-01-28T14:30:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    items: [
      { productId: "4", productName: "Fresh Salmon", quantity: 2, price: 12.99 },
      { productId: "5", productName: "Organic Spinach", quantity: 3, price: 3.49 },
    ],
    total: 36.45,
    status: "shipped",
    createdAt: "2025-01-29T09:15:00Z",
  },
  {
    id: "ORD-003",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    items: [
      { productId: "3", productName: "Whole Wheat Bread", quantity: 2, price: 3.99 },
    ],
    total: 7.98,
    status: "processing",
    createdAt: "2025-01-30T11:00:00Z",
  },
  {
    id: "ORD-004",
    customerName: "Emily Wilson",
    customerEmail: "emily@example.com",
    items: [
      { productId: "1", productName: "Organic Bananas", quantity: 3, price: 2.99 },
      { productId: "5", productName: "Organic Spinach", quantity: 2, price: 3.49 },
      { productId: "2", productName: "Fresh Milk", quantity: 2, price: 4.49 },
    ],
    total: 24.93,
    status: "pending",
    createdAt: "2025-01-31T08:45:00Z",
  },
  {
    id: "ORD-005",
    customerName: "Robert Brown",
    customerEmail: "robert@example.com",
    items: [
      { productId: "6", productName: "Free Range Eggs", quantity: 2, price: 5.99 },
    ],
    total: 11.98,
    status: "cancelled",
    createdAt: "2025-01-27T16:20:00Z",
  },
];

export const useStore = create(
  persist(
    (set) => ({
      products: sampleProducts,
      orders: sampleOrders,
      
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),
    }),
    {
      name: "grocery-admin-storage",
    }
  )
);