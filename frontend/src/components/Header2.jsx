import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { selectAuthUser } from '../features/auth/authSelector';
import { useSelector } from 'react-redux';
import { selectTotalQuantity, selectItemCount } from '../features/cart/cartSlice';


export default function Header() {
  const total = useSelector(selectItemCount);  

  return (
    <>
      <header id="home" className="sticky top-0 z-50 bg-bg-primary border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to={"/"} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-text-primary">ApnaMart</span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-3">
              
              <Link to={"/cart"} className="relative p-2 cursor-pointer hover:bg-primary-bg rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-text-primary">{total || 0}</span>
                </div>
              </Link>

              <button className="p-1 hover:bg-primary-bg cursor-pointer rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                  <img
                    src="/images/profile.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}