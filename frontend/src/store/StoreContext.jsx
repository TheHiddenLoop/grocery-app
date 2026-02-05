import React, { createContext, useContext, useReducer } from "react";

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
];

const sampleOrders = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    items: [
      {
        productId: "1",
        productName: "Organic Bananas",
        quantity: 2,
        price: 2.99,
      },
    ],
    total: 5.98,
    status: "delivered",
    createdAt: "2025-01-28T14:30:00Z",
  },
];

const initialState = {
  products: sampleProducts,
  orders: sampleOrders,
};

function storeReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [
          ...state.products,
          {
            ...action.payload,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates }
            : p
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id
            ? { ...o, status: action.payload.status }
            : o
        ),
      };

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
};
