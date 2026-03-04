import { useEffect } from "react";
import { Package, ShoppingCart, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../features/dashboard/dashboardslice.js";

const getStatusVariant = (status) => {
  switch ((status || "").toUpperCase()) {
    case "DELIVERED":  return "success";
    case "CONFIRMED":  return "success";
    case "SHIPPED":    return "info";
    case "PROCESSING": return "warning";
    case "PENDING":    return "default";
    case "CANCELLED":  return "error";
    default:           return "default";
  }
};

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "N/A";

const getCustomerName = (order) =>
  typeof order?.userId === "object" ? order.userId?.name ?? "N/A" : "N/A";

const getOrderId  = (order) => order?._id || order?.id || "";
const getShortId  = (order) => { const id = getOrderId(order); return id ? `#${id.slice(-8).toUpperCase()}` : "N/A"; };

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats = {}, recentOrders = [], lowStockProductsList = [], loading } = useSelector(
    (state) => state.dashboard ?? {}
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your grocery store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          change={`${stats.outOfStockProducts ?? 0} out of stock`}
          changeType={(stats.outOfStockProducts ?? 0) > 0 ? "negative" : "positive"}
          icon={Package}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders ?? 0}
          change={`${stats.pendingOrders ?? 0} pending`}
          changeType="neutral"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue ?? 0).toFixed(2)}`}
          change="All time"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Low Stock Alert"
          value={stats.lowStockProducts ?? 0}
          change="Items need restocking"
          changeType={(stats.lowStockProducts ?? 0) > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
        />
      </div>

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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={getOrderId(order)}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-mono font-medium text-foreground">
                      {getShortId(order)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {getCustomerName(order)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {Array.isArray(order.items) ? order.items.length : 0} items
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      ₹{(order.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge variant={getStatusVariant(order.status)}>
                        {formatStatus(order.status)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(lowStockProductsList?.length ?? 0) > 0 && (
        <div className="glass rounded-xl p-6 border-warning/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Low Stock Alert</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProductsList.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-warning-bg/50"
              >
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
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