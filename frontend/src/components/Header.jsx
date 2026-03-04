import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X, PackageSearch, LogOut, ChevronDown, Home, Tag, Zap, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../features/auth/authSelector';
import { selectItemCount } from '../features/cart/cartSlice';
import { logoutAuth } from '../features/auth/authSlice';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navItems = [
    { label: "Home", icon: Home },
    { label: "Products", icon: Tag },
    { label: "Deals", icon: Zap },
    { label: "Contact", icon: Phone },
  ];
  const {user} = useSelector(selectAuthUser);
  const total = useSelector(selectItemCount);
  const navigate = useNavigate();  
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId.toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    dispatch(logoutAuth());
    navigate('/');
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
              {navItems.map(({ label }) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(label); }}
                  className="text-text-secondary hover:text-primary transition-colors font-medium"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">

              <Link to="/cart" className="relative p-2 cursor-pointer hover:bg-primary-bg rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-text-primary" />
                <div className={`absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center ${total === 0? "hidden" : ""}`}>
                  <span className="text-xs font-bold text-text-primary">{total || 0}</span>
                </div>
              </Link>

              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 p-1 hover:bg-primary-bg cursor-pointer rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                    <img src="/images/profile.jpg" alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'My Account'}</p>
                      <p className="text-xs text-text-secondary truncate">{user?.email || ''}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-text-primary hover:text-primary hover:bg-primary-bg transition-colors"
                    >
                      <PackageSearch className="w-4 h-4" />
                      <span className="text-sm font-medium">My Orders</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors border-t border-border"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1 hover:bg-primary-bg cursor-pointer rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                  <img src="/images/profile.jpg" alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
                </div>
              </button>

            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-bg-secondary border-r border-border-dark z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">

          <div className="relative bg-linear-to-br from-primary/20 to-secondary/10 px-5 pt-10 pb-5 border-b border-border">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-primary-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary overflow-hidden flex items-center justify-center ring-2 ring-primary/40">
                <img src="/images/profile.jpg" alt="Profile" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-text-primary truncate">{user?.name || 'My Account'}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email || 'user@email.com'}</p>
                <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Member
                </span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col p-4 gap-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest px-3 mb-1">Menu</p>
            {navItems.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(label); }}
                className="flex items-center gap-3 text-text-primary hover:text-primary hover:bg-primary-bg px-3 py-2.5 rounded-xl transition-all font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                {label}
              </a>
            ))}
          </nav>

          <div className="px-4">
            <div className="border-t border-border" />
          </div>

          <div className="flex flex-col p-4 gap-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest px-3 mb-1">Account</p>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-text-primary hover:text-primary hover:bg-primary-bg px-3 py-2.5 rounded-xl transition-all font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center relative">
                <ShoppingCart className="w-4 h-4 text-primary" />
              </div>
              Cart
              {total > 0 && (
                <span className="ml-auto text-xs bg-primary text-text-primary font-bold px-2 py-0.5 rounded-full">
                  {total}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-text-primary hover:text-primary hover:bg-primary-bg px-3 py-2.5 rounded-xl transition-all font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PackageSearch className="w-4 h-4 text-primary" />
              </div>
              My Orders
            </Link>
          </div>

          <div className="mt-auto p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-400 border border-red-400/30 rounded-xl hover:bg-red-400/10 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}