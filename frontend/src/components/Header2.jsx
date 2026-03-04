import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, PackageSearch, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../features/auth/authSelector';
import { selectItemCount } from '../features/cart/cartSlice';
import { logoutAuth } from '../features/auth/authSlice';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const total = useSelector(selectItemCount);
  const {user} = useSelector(selectAuthUser);
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

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logoutAuth());
    navigate('/');
  };


  return (
    <header id="home" className="sticky top-0 z-50 bg-bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-text-primary">ApnaMart</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">

            <Link to="/cart" className="relative p-2 cursor-pointer hover:bg-primary-bg rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-text-primary" />
              <div className={`absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center ${total === 0? "hidden" : ""}`}>
                <span className="text-xs font-bold text-text-primary">{total || 0}</span>
              </div>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 p-1 hover:bg-primary-bg cursor-pointer rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                  <img
                    src="/images/profile.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user?.name || 'My Account'}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user?.email || ''}
                    </p>
                  </div>

                  {/* Orders */}
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

          </div>
        </div>
      </div>
    </header>
  );
}