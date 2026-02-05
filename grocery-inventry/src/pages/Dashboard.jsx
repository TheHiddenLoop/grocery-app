import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useStore } from "../store/useStore";

export default function Dashboard() {
  const { products, orders } = useStore();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered": return "success";
      case "shipped": return "info";
      case "processing": return "warning";
      case "pending": return "default";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your grocery store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          change={`${outOfStockProducts} out of stock`}
          changeType={outOfStockProducts > 0 ? "negative" : "positive"}
          icon={Package}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change={`${orders.filter(o => o.status === "pending").length} pending`}
          changeType="neutral"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change="This month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Low Stock Alert"
          value={lowStockProducts}
          change="Items need restocking"
          changeType={lowStockProducts > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
        />
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{order.items.length} items</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={getStatusVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts > 0 && (
        <div className="glass rounded-xl p-6 border-warning/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Low Stock Alert</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((p) => p.stock > 0 && p.stock <= 10)
              .map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-warning-bg/50">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-warning">{product.stock} {product.unit}(s) left</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}