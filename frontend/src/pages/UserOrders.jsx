import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrders, cancelOrderThunk } from "../features/order/ordersSlice";
import Header from "../components/Header2";
import { CancelModal } from "../components/CancelModal";
import { OrderCard } from "../components/OrderCard";

if (typeof document !== "undefined" && !document.getElementById("fa-cdn")) {
  const link = document.createElement("link");
  link.id = "fa-cdn";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  document.head.appendChild(link);
}

const Icon = ({ i, className = "" }) => <i className={`fa-solid ${i} ${className}`} />;


const FILTERS = ["All", "Active", "Delivered", "Cancelled"];

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtId   = (id)  => id  ? `#${id.slice(-8).toUpperCase()}` : "—";
const fmtAddr = (a)   => a   ? [a.street, a.city, a.state, a.pincode].filter(Boolean).join(", ") || "—" : "—";





export default function UserOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => { dispatch(getOrders()); }, [dispatch]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    await dispatch(cancelOrderThunk(cancelTarget._id));
    setCancelLoading(false);
    setCancelTarget(null);
  };

  const filtered = (orders || []).filter((o) => {
    const st = o.status?.toUpperCase() || "";
    const id = fmtId(o._id).toLowerCase();
    const names = o.items?.map(i => i.product?.name?.toLowerCase() || "").join(" ") || "";
    const matchSearch = !search || id.includes(search.toLowerCase()) || names.includes(search.toLowerCase());
    const matchFilter =
      filter === "All"       ? true :
      filter === "Active"    ? ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(st) :
      filter === "Delivered" ? st === "DELIVERED" :
                               st === "CANCELLED";
    return matchSearch && matchFilter;
  });

  const stats = {
    total:     orders?.length || 0,
    active:    orders?.filter(o => ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(o.status?.toUpperCase())).length || 0,
    delivered: orders?.filter(o => o.status?.toUpperCase() === "DELIVERED").length || 0,
    spent:     orders?.filter(o => o.status?.toUpperCase() !== "CANCELLED").reduce((s, o) => s + (o.amount || 0), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
            <p className="text-sm text-text-secondary mt-0.5">{stats.total} orders placed</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: "Active",    value: stats.active,    icon: "fa-bolt",        color: "text-warning", bg: "bg-warning-bg",  border: "border-warning/20"  },
              { label: "Delivered", value: stats.delivered,  icon: "fa-circle-check",color: "text-success", bg: "bg-success-bg",  border: "border-success/20"  },
              { label: `₹${stats.spent.toLocaleString("en-IN")}`, value: null, icon: "fa-chart-line", color: "text-primary", bg: "bg-primary-bg", border: "border-primary/20" },
            ].map(({ label, value, icon, color, bg, border }) => (
              <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bg} border ${border}`}>
                <Icon i={icon} className={`${color} text-xs`} />
                <span className={`text-xs font-bold ${color}`}>{value !== null ? `${value} ${label}` : label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon i="fa-magnifying-glass" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-sm" />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary/40 outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-1 bg-bg-secondary border border-border rounded-xl p-1 shrink-0">
            {FILTERS.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filter === tab
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[72px] rounded-2xl border border-border bg-bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {/* Orders */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(o => <OrderCard key={o._id} order={o} onCancel={setCancelTarget} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-4">
              <Icon i="fa-bag-shopping" className="text-text-secondary text-2xl" />
            </div>
            <p className="text-base font-semibold text-text-primary">No orders found</p>
            <p className="text-sm text-text-secondary mt-1">
              {search ? "No orders match your search" : "Nothing here in this category yet"}
            </p>
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onConfirm={confirmCancel}
          onClose={() => !cancelLoading && setCancelTarget(null)}
          loading={cancelLoading}
        />
      )}
    </div>
  );
}