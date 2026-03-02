
if (typeof document !== "undefined" && !document.getElementById("fa-cdn")) {
  const link = document.createElement("link");
  link.id = "fa-cdn";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  document.head.appendChild(link);
}

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtId   = (id)  => id  ? `#${id.slice(-8).toUpperCase()}` : "—";
const fmtAddr = (a)   => a   ? [a.street, a.city, a.state, a.pincode].filter(Boolean).join(", ") || "—" : "—";
const Icon = ({ i, className = "" }) => <i className={`fa-solid ${i} ${className}`} />;


export function CancelModal({ order, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-bg-secondary border border-border shadow-2xl overflow-hidden">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>
        <div className="h-1 w-full bg-linear-to-r from-error/60 via-error to-error/60" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-error-bg border border-error/20 flex items-center justify-center shrink-0">
              <Icon i="fa-trash-can" className="text-error text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Cancel Order?</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Order <span className="font-mono font-bold text-primary">{fmtId(order._id)}</span> will be permanently cancelled.
                {order.paymentType === "ONLINE" && order.isPaid && " Refund will be processed in 3–5 business days."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-bg-primary border border-border p-3 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const img = order.items?.[0]?.product?.image;
                const thumb = Array.isArray(img) ? img[0] : img;
                return thumb
                  ? <img src={thumb} className="h-9 w-9 rounded-lg object-cover border border-border" alt="" />
                  : <div className="h-9 w-9 rounded-lg bg-primary-bg border border-border flex items-center justify-center">
                      <Icon i="fa-box" className="text-primary text-sm" />
                    </div>;
              })()}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-text-secondary">{fmtDate(order.createdAt)}</p>
              </div>
            </div>
            <p className="text-base font-bold text-text-primary">₹{order.amount}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer flex-1 py-3 rounded-xl border border-border bg-bg-primary text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-border-dark transition-all disabled:opacity-50"
            >
              No, Go Back
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="cursor-pointer flex-1 py-3 rounded-xl bg-error text-sm font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-error/20"
            >
              {loading
                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <Icon i="fa-xmark" className="text-sm" />
              }
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}