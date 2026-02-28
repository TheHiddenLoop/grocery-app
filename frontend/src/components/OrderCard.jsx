import { useState } from "react";


const STATUS = {
  PENDING:          { label: "Pending",         color: "text-warning",   bg: "bg-warning-bg",   iconBg: "bg-warning/10",   icon: "fa-clock",          canCancel: true  },
  CONFIRMED:        { label: "Confirmed",        color: "text-warning",   bg: "bg-warning-bg",   iconBg: "bg-warning/10",   icon: "fa-clock",          canCancel: true  },
  PROCESSING:       { label: "Processing",       color: "text-info",      bg: "bg-info-bg",      iconBg: "bg-info/10",      icon: "fa-rotate",         canCancel: true  },
  SHIPPED:          { label: "Shipped",          color: "text-secondary", bg: "bg-secondary-bg", iconBg: "bg-secondary/10", icon: "fa-truck",          canCancel: false },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-primary",   bg: "bg-primary-bg",   iconBg: "bg-primary/10",   icon: "fa-truck-fast",     canCancel: false },
  DELIVERED:        { label: "Delivered",        color: "text-success",   bg: "bg-success-bg",   iconBg: "bg-success/10",   icon: "fa-circle-check",   canCancel: false },
  CANCELLED:        { label: "Cancelled",        color: "text-error",     bg: "bg-error-bg",     iconBg: "bg-error/10",     icon: "fa-ban",            canCancel: false },
};

if (typeof document !== "undefined" && !document.getElementById("fa-cdn")) {
  const link = document.createElement("link");
  link.id = "fa-cdn";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  document.head.appendChild(link);
}

const Icon = ({ i, className = "" }) => <i className={`fa-solid ${i} ${className}`} />;

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtId   = (id)  => id  ? `#${id.slice(-8).toUpperCase()}` : "—";
const fmtAddr = (a)   => a   ? [a.street, a.city, a.state, a.pincode].filter(Boolean).join(", ") || "—" : "—";


export function OrderCard({ order, onCancel }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[order.status?.toUpperCase()] || STATUS.PENDING;
  const totalQty = order.items?.reduce((n, i) => n + (i.quantity || 0), 0) || 0;

  const thumbs = order.items?.slice(0, 3).map(i => {
    const img = i.product?.image;
    return Array.isArray(img) ? img[0] : img;
  }).filter(Boolean) || [];

  return (
    <div className={`rounded-2xl border bg-bg-secondary overflow-hidden transition-all duration-200 ${open ? "border-border-dark" : "border-border hover:border-border-dark"}`}>

      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <div className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${s.iconBg}`}>
          <Icon i={s.icon} className={`${s.color} text-base`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-primary tracking-wide">{fmtId(order._id)}</span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.color.replace("text-", "bg-")} ${s.label === "Processing" ? "animate-pulse" : ""}`} />
              {s.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {thumbs.length > 0 && (
              <div className="flex -space-x-2">
                {thumbs.map((t, i) => (
                  <img key={i} src={t} className="h-6 w-6 rounded-md object-cover border border-border-dark ring-1 ring-bg-secondary" alt="" />
                ))}
                {(order.items?.length || 0) > 3 && (
                  <div className="h-6 w-6 rounded-md bg-primary-bg border border-border flex items-center justify-center text-[9px] font-bold text-primary ring-1 ring-bg-secondary">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-text-secondary truncate">
              {order.items?.map(i => i.product?.name).filter(Boolean).slice(0, 2).join(", ")}
              {(order.items?.length || 0) > 2 ? ` +${order.items.length - 2}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-text-secondary">{fmtDate(order.createdAt)}</p>
            <p className="text-[11px] text-text-secondary">{totalQty} items</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-text-primary">₹{order.amount}</p>
            {order.isPaid
              ? <p className="text-[10px] text-success font-semibold">Paid <Icon i="fa-check" className="text-[9px]" /></p>
              : <p className="text-[10px] text-warning font-semibold">Unpaid</p>
            }
          </div>
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center bg-bg-primary border border-border transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
            <Icon i="fa-chevron-down" className="text-text-secondary text-xs" />
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg-primary/30">

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {order.items?.map((item, i) => {
              const p = item.product || {};
              const img = Array.isArray(p.image) ? p.image[0] : p.image;
              const price = p.offerPrice || p.price || 0;
              const total = price * (item.quantity || 1);
              return (
                <div key={item._id || i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-border">
                  {img
                    ? <img src={img} alt={p.name} className="h-11 w-11 rounded-xl object-cover shrink-0 border border-border" />
                    : <div className="h-11 w-11 rounded-xl bg-primary-bg border border-border shrink-0 flex items-center justify-center">
                        <Icon i="fa-box" className="text-primary text-sm" />
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{p.name || "Product"}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {p.category && <span className="text-accent mr-1.5">{p.category}</span>}
                      x{item.quantity}{p.unit ? ` · per ${p.unit}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">₹{total}</p>
                    <p className="text-[11px] text-text-secondary">₹{price} each</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-4 mb-4 rounded-xl bg-bg-secondary border border-border overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border">
              {order.address && (
                <div className="flex items-start gap-1.5 text-xs text-text-secondary flex-1 min-w-0">
                  <Icon i="fa-location-dot" className="text-primary mt-0.5 shrink-0" />
                  <span className="truncate">{fmtAddr(order.address)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
                <Icon i="fa-credit-card" className="text-primary text-xs" />
                <span>{order.paymentType || "—"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Icon i="fa-indian-rupee-sign" className="text-primary text-xs" />
                <span className="text-sm text-text-secondary">Order Total</span>
                <span className="text-base font-bold text-primary ml-1">₹{order.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                {s.canCancel && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onCancel(order); }}
                    className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-error/25 bg-error-bg/50 text-xs font-semibold text-error hover:bg-error-bg transition-colors"
                  >
                    <Icon i="fa-xmark" className="text-xs" /> Cancel Order
                  </button>
                )}
                {order.status?.toUpperCase() === "DELIVERED" && (
                  <button className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-success/25 bg-success-bg/50 text-xs font-semibold text-success hover:bg-success-bg transition-colors">
                    <Icon i="fa-rotate-left" className="text-xs" /> Reorder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}