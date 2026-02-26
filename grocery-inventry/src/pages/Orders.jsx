import { useEffect, useState } from "react";
import { Search, Filter, Eye, RefreshCw, X, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { allOrders, updateOrderStatus, cancelOrder } from "../features/order/orderSlice";

const statusOptions = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const statusFilters = ["All", ...statusOptions];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getOrderId       = (order) => order?._id || order?.id || "";
const getShortId       = (order) => { const id = getOrderId(order); return id ? `#${id.slice(-8).toUpperCase()}` : "N/A"; };
const getCustomerName  = (order) => (typeof order?.userId === "object" ? order.userId?.name  : null) ?? "N/A";
const getCustomerEmail = (order) => (typeof order?.userId === "object" ? order.userId?.email : null) ?? "";
const formatStatus     = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "N/A";

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

const isTerminalStatus = (status) => {
  const s = (status || "").toUpperCase();
  return s === "DELIVERED" || s === "CANCELLED";
};

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, updating } = useSelector((state) => state.orders);

  const [searchQuery,       setSearchQuery]       = useState("");
  const [statusFilter,      setStatusFilter]      = useState("All");
  const [viewingOrder,      setViewingOrder]      = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [newStatus,         setNewStatus]         = useState("PENDING");

  useEffect(() => {
    dispatch(allOrders());
  }, [dispatch]);

  const filteredOrders = (orders || []).filter((order) => {
    const id   = getOrderId(order).toLowerCase();
    const name = getCustomerName(order).toLowerCase();
    const matchesSearch =
      id.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "").toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async () => {
    if (!updateStatusOrder) return;
    const result = await dispatch(
      updateOrderStatus({ orderId: getOrderId(updateStatusOrder), status: newStatus })
    );
    if (updateOrderStatus.fulfilled.match(result)) {
      toast({
        title: "Status Updated",
        description: `Order ${getShortId(updateStatusOrder)} is now ${formatStatus(newStatus)}.`,
      });
      setUpdateStatusOrder(null);
    }
  };

  const handleCancelOrder = async (order) => {
    if ((order.status || "").toUpperCase() !== "PENDING") return;
    const result = await dispatch(cancelOrder(getOrderId(order)));
    if (cancelOrder.fulfilled.match(result)) {
      toast({ title: "Order Cancelled", description: `Order ${getShortId(order)} has been cancelled.` });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">
          {loading ? "Loading..." : `${orders?.length ?? 0} total orders`}
        </p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All" : formatStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Items</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Payment</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={getOrderId(order)} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-foreground">{getShortId(order)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-foreground">{getCustomerName(order)}</p>
                        <p className="text-xs text-muted-foreground">{getCustomerEmail(order)}</p>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(order.items) ? order.items.length : 0} items
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {order.paymentType || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{(order.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge variant={getStatusVariant(order.status)}>
                          {formatStatus(order.status)}
                        </StatusBadge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-popover-foreground"
                            onClick={() => setViewingOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-popover-foreground"
                            onClick={() => { setUpdateStatusOrder(order); setNewStatus(order.status || "PENDING"); }}
                            disabled={isTerminalStatus(order.status) || updating}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          {(order.status || "").toUpperCase() === "PENDING" && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-error"
                              onClick={() => handleCancelOrder(order)}
                              disabled={updating}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order {viewingOrder ? getShortId(viewingOrder) : ""}</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">{getCustomerName(viewingOrder)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{getCustomerEmail(viewingOrder)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {viewingOrder.createdAt ? format(new Date(viewingOrder.createdAt), "PPp") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge variant={getStatusVariant(viewingOrder.status)}>
                    {formatStatus(viewingOrder.status)}
                  </StatusBadge>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Type</p>
                  <p className="font-medium text-foreground">{viewingOrder.paymentType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid</p>
                  <p className="font-medium text-foreground">{viewingOrder.isPaid ? "✅ Yes" : "❌ No"}</p>
                </div>
              </div>

              {viewingOrder.address && (
                <div className="border-t border-border pt-4 text-sm">
                  <p className="font-medium text-foreground mb-1">Shipping Address</p>
                  <p className="text-muted-foreground text-xs">
                    {typeof viewingOrder.address === "object"
                      ? [
                          viewingOrder.address.street,
                          viewingOrder.address.city,
                          viewingOrder.address.state,
                          viewingOrder.address.pincode,
                          viewingOrder.address.country,
                        ].filter(Boolean).join(", ")
                      : viewingOrder.address}
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground mb-3">Items</p>
                <div className="space-y-2">
                  {Array.isArray(viewingOrder.items) &&
                    viewingOrder.items.map((item, i) => {
                      const product     = typeof item.product === "object" ? item.product : {};
                      const productName = product?.name || "Unknown Product";
                      const price       = product?.offerPrice ?? product?.price ?? 0;
                      const qty         = item.quantity || 1;
                      return (
                        <div key={item._id || i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{productName} × {qty}</span>
                          <span className="font-medium text-foreground">₹{(price * qty).toFixed(2)}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between text-sm">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">₹{(viewingOrder.amount || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingOrder(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!updateStatusOrder} onOpenChange={(open) => !open && setUpdateStatusOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order {updateStatusOrder ? getShortId(updateStatusOrder) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>{formatStatus(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusOrder(null)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updating} className="gradient-primary text-primary-foreground">
              {updating
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Updating...</span>
                : "Update Status"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}