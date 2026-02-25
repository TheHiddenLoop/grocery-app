import { useEffect, useState } from "react";
import { Search, Filter, Eye, RefreshCw, X } from "lucide-react";
import { useStore } from "../store/useStore";
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
import { allOrders } from "../features/order/orderSlice";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusFilters = ["All", ...statusOptions];

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dispatch = useDispatch();
  const order = useSelector(state=>state.orders.orders);

  console.log(order);

  useEffect(()=>{
    dispatch(allOrders());
  }, [dispatch]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered": return "success";
      case "shipped": return "info";
      case "processing": return "warning";
      case "pending": return "default";
      case "cancelled": return "error";
    }
  };

  const handleUpdateStatus = () => {
    if (updateStatusOrder) {
      updateOrderStatus(updateStatusOrder.id, newStatus);
      toast({
        title: "Status Updated",
        description: `Order ${updateStatusOrder.id} is now ${newStatus}.`,
      });
      setUpdateStatusOrder(null);
    }
  };

  const handleCancelOrder = (order) => {
    if (order.status === "pending") {
      updateOrderStatus(order.id, "cancelled");
      toast({
        title: "Order Cancelled",
        description: `Order ${order.id} has been cancelled.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Items</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-medium text-foreground">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{order.items.length} items</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge variant={getStatusVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </StatusBadge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-popover-foreground"
                          onClick={() => setViewingOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-popover-foreground"
                          onClick={() => {
                            setUpdateStatusOrder(order);
                            setNewStatus(order.status);
                          }}
                          disabled={order.status === "delivered" || order.status === "cancelled"}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-error"
                            onClick={() => handleCancelOrder(order)}
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
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order {viewingOrder?.id}</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{viewingOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{format(new Date(viewingOrder.createdAt), "PPp")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge variant={getStatusVariant(viewingOrder.status)}>
                    {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                  </StatusBadge>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground mb-3">Items</p>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between text-sm">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">${viewingOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!updateStatusOrder} onOpenChange={(open) => !open && setUpdateStatusOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order {updateStatusOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} className="gradient-primary text-primary-foreground">
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}