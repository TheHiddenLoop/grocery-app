import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../features/auth/authSelector';

export default function Header({cartCount}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = ["Home", "Products", "Deals", "Contact"];
  const user = useSelector(selectAuthUser);  

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    setTimeout(() => {
      const el = document.getElementById(sectionId.toLowerCase());
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };



  return (
    <>
      <header id="home" className="sticky top-0 z-50 bg-bg-primary border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-text-primary">ApnaMart</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item);
                  }}
                  className="text-text-secondary hover:text-primary transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>


            <div className="flex items-center gap-3">
              
              <Link to={"/cart"} className="relative p-2 cursor-pointer hover:bg-primary-bg rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-text-primary">{cartCount}</span>
                </div>
              </Link>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className=" p-1 hover:bg-primary-bg cursor-pointer rounded-lg transition-colors">
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

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-bg-secondary border-r border-border-dark z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
              </div>
              <span className="text-xl font-bold text-text-primary">ApnaMart</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-primary-bg rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-text-primary" />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
                className="text-text-primary hover:text-primary hover:bg-primary-bg px-4 py-3 rounded-lg transition-all font-medium"
              >
                {item}
              </a>
            ))}
          </nav>


          <div className="mt-auto p-4 border-t border-border">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-bg border border-border rounded-lg hover:bg-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-6 h-6 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-text-primary font-medium">My Account</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}