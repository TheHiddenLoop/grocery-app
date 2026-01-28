import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-text-primary">ApnaMart</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Products
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Deals
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:block p-1 hover:bg-primary-bg rounded-lg transition-colors">
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

            <button className="relative p-2 hover:bg-primary-bg rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-text-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-text-primary">3</span>
              </div>
            </button>

            <button 
              className="md:hidden p-2 hover:bg-primary-bg rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <a href="#" className="px-4 py-3 text-text-primary hover:bg-primary-bg rounded-lg transition-colors">
                Home
              </a>
              <a href="#" className="px-4 py-3 text-text-primary hover:bg-primary-bg rounded-lg transition-colors">
                Products
              </a>
              <a href="#" className="px-4 py-3 text-text-primary hover:bg-primary-bg rounded-lg transition-colors">
                Deals
              </a>
              <a href="#" className="px-4 py-3 text-text-primary hover:bg-primary-bg rounded-lg transition-colors">
                Contact
              </a>
              
              <div className="px-4 pt-2">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-bg border border-border rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                    <img 
                      src="/images/profile.jpg" 
                      alt="Profile" 
                      width={24} 
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-text-primary">My Account</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}