"use client"
import React, { useState } from 'react';
import { Plus, Minus, X, ArrowRight } from 'lucide-react';
import { featuredProducts } from '../data/featuredProduct';
import { CartCard } from '../components/CartCard';
import Header from '../components/Header';

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(
    featuredProducts.map(product => ({
      ...product,
      quantity: 1,
    }))
  );
  
  const [paymentMethod, setPaymentMethod] = useState('online');

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.offerPrice * item.quantity, 0);
  const originalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = originalPrice - subtotal;
  const shipping = 4.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    const orderData = {
      items: cartItems.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.offerPrice,
        total: item.offerPrice * item.quantity
      })),
      paymentMethod: paymentMethod,
      subtotal: subtotal.toFixed(2),
      savings: savings.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      timestamp: new Date().toISOString()
    };
    
    console.log('Order Data:', orderData);
  };

  return (
    <>
    <Header />
    <div className="min-h-screen py-8 px-4 md:py-16 bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-text-primary">
          Shopping Cart
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6 xl:gap-8">
          <div className="w-full lg:max-w-2xl xl:max-w-4xl mx-auto lg:mx-0">
            <div className="space-y-6">
              {cartItems.map(item => (
                <CartCard
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 w-full flex-1 space-y-6 lg:mt-0 lg:max-w-md">
            <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-4 shadow-sm sm:p-6">
              <p className="text-xl font-semibold text-text-primary">
                Order summary
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-text-secondary">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-text-primary">
                      ${originalPrice.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-text-secondary">
                      Savings
                    </dt>
                    <dd className="text-base font-medium text-success">
                      -${savings.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-text-secondary">
                      Store Pickup
                    </dt>
                    <dd className="text-base font-medium text-text-primary">
                      ${shipping.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-text-secondary">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-text-primary">
                      ${tax.toFixed(2)}
                    </dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-border pt-2">
                  <dt className="text-base font-bold text-text-primary">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-primary">
                    ${total.toFixed(2)}
                  </dd>
                </dl>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="online">💳 Online Payment</option>
                  <option value="cod">💵 Cash on Delivery</option>
                </select>
              </div>

              <button
                onClick={handleCheckout}
                className="flex w-full items-center cursor-pointer justify-center rounded-lg bg-primary hover:bg-secondary px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-text-secondary">or</span>
                <a
                  href="#"
                  className="inline-flex items-center cursor-pointer gap-2 text-sm font-medium text-primary underline hover:no-underline"
                >
                  Continue Shopping
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}