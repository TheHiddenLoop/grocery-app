import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Add Product",
    href: "/admin/add-product",
    icon: PackagePlus,
  },
  {
    title: "All Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];


export function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">GroceryAdmin</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 text-sidebar-foreground transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-sidebar-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "group-hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@grocery.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-sm border-b border-border flex items-center px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="text-right ">
              <p className="text-sm font-medium text-foreground">
                Welcome back
              </p>
              <p className="text-xs text-muted-foreground">
                Manage your grocery store
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
