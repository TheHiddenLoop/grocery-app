import { Plus, Minus, X } from "lucide-react";

export const CartCard = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-4 md:p-6 shadow-sm">
      <div className="flex items-center gap-4 md:gap-6">
        
        <a href="#" className="shrink-0">
          <img
            className="h-20 w-20 rounded-lg object-cover"
            src={item.images[0]}
            alt={item.name}
          />
        </a>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <a
            href="#"
            className="text-base font-medium text-text-primary hover:underline
                       truncate md:whitespace-normal"
          >
            {item.name}
          </a>

          <p
            className="text-sm text-text-secondary
                       truncate md:whitespace-normal"
          >
            {item.description[0]}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-success">
              ₹{item.offerPrice.toFixed(2)}
            </span>
            <span className="text-sm line-through text-text-secondary">
              ₹{item.price.toFixed(2)}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-success-bg text-success">
              Save ₹{(item.price - item.offerPrice).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item._id, -1)}
                className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-border bg-primary-bg hover:bg-primary transition-all"
              >
                <Minus size={12} className="text-text-primary" />
              </button>

              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-8 text-center text-sm font-medium bg-transparent focus:outline-none"
              />

              <button
                type="button"
                onClick={() => onUpdateQuantity(item._id, 1)}
                className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-border bg-primary-bg hover:bg-primary transition-all"
              >
                <Plus size={12} className="text-text-primary" />
              </button>
            </div>

            <p className="text-base font-bold text-primary">
              ₹{(item.offerPrice * item.quantity).toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item._id)}
            className="flex items-center cursor-pointer gap-1.5 text-sm font-medium text-error hover:underline mt-1"
          >
            <X size={16} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
