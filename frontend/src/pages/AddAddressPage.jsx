import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, clearAddressError } from "../features/address/addressSlice";
import { selectAuthUser } from "../features/auth/authSelector";
import { useNavigate } from "react-router";
import {
  ArrowLeft, MapPin, Loader2, Lock,
  User, Phone, Home, Building2, Hash, Globe,
} from "lucide-react";

const FIELDS = [
  {
    row: true,
    fields: [
      { name: "firstName", label: "First Name",    type: "text",  placeholder: "John",                 required: true,  locked: false, icon: User      },
      { name: "lastName",  label: "Last Name",     type: "text",  placeholder: "Doe",                  required: true,  locked: false, icon: User      },
    ],
  },
  { name: "email",  label: "Email Address",  type: "email", placeholder: "john@example.com",          required: false, locked: true,  icon: Lock      },
  { name: "phone",  label: "Phone Number",   type: "tel",   placeholder: "+91 9876543210",            required: true,  locked: false, icon: Phone     },
  { name: "street", label: "Street Address", type: "text",  placeholder: "House No., Street, Area",   required: true,  locked: false, icon: Home      },
  {
    row: true,
    fields: [
      { name: "city",  label: "City",  type: "text", placeholder: "Mumbai",      required: true, locked: false, icon: Building2 },
      { name: "state", label: "State", type: "text", placeholder: "Maharashtra", required: true, locked: false, icon: Building2 },
    ],
  },
  {
    row: true,
    fields: [
      { name: "zipCode", label: "ZIP / Pincode", type: "text", placeholder: "400001", required: true, locked: false, icon: Hash  },
      { name: "country", label: "Country",       type: "text", placeholder: "India",  required: true, locked: false, icon: Globe },
    ],
  },
];

export default function AddAddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuthUser);
  const { loading, error } = useSelector((state) => state.address);

  const [form, setForm] = useState({
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName:  user?.lastName  || user?.name?.split(" ").slice(1).join(" ") || "",
    email:     user?.email  || "",
    phone:     user?.phone  || "",
    street:    "",
    city:      "",
    state:     "",
    zipCode:   "",
    country:   "India",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    const all = FIELDS.flatMap((f) => f.row ? f.fields : [f]);
    all.forEach(({ name, label, required }) => {
      if (required && !String(form[name] ?? "").trim()) errors[name] = `${label} is required`;
    });
    if (form.phone   && !/^\+?[\d\s\-]{7,15}$/.test(form.phone))  errors.phone   = "Enter a valid phone number";
    if (form.zipCode && !/^\d{4,10}$/.test(String(form.zipCode)))  errors.zipCode = "Enter a valid ZIP";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setFieldErrors((p) => ({ ...p, [name]: undefined }));
    if (error) dispatch(clearAddressError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    try {
      await dispatch(addAddress(form)).unwrap();
      navigate("/cart");
    } catch (_) {}
  };

  const renderInput = ({ name, label, type, placeholder, required, locked, icon: Icon }) => (
    <div key={name} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-0.5 text-xs">*</span>}
        </label>
        {locked && (
          <span className="flex items-center gap-1 text-[10px] text-text-secondary/50 bg-border/30 px-2 py-0.5 rounded-full">
            <Lock className="w-2.5 h-2.5" /> locked
          </span>
        )}
        {fieldErrors[name] && (
          <span className="text-xs text-error">{fieldErrors[name]}</span>
        )}
      </div>
      <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-150
        ${fieldErrors[name]
          ? "border-error bg-error-bg/20"
          : locked
          ? "border-border/30 opacity-50"
          : "border-border bg-bg-primary hover:border-border-dark focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
        }`}
      >
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${fieldErrors[name] ? "text-error" : "text-text-secondary/40"}`} />}
        <input
          id={name} name={name} type={type}
          value={form[name]} onChange={handleChange}
          placeholder={placeholder}
          readOnly={locked} disabled={locked}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/35 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-border px-6 py-3.5 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-text-primary">Add Delivery Address</h1>
      </div>

      {/* Split body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Form ── */}
        <div className="flex-1 overflow-y-auto px-8 py-8 md:px-12 lg:px-16">
          <div className="max-w-md w-full">

            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-error-bg border border-error/30 text-error text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Personal */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Personal Info
                </p>
                {FIELDS.slice(0, 3).map((fieldDef, i) =>
                  fieldDef.row
                    ? <div key={i} className="grid grid-cols-2 gap-3">{fieldDef.fields.map(renderInput)}</div>
                    : renderInput(fieldDef)
                )}
              </div>

              <div className="h-px bg-border" />

              {/* Location */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Location
                </p>
                {FIELDS.slice(3).map((fieldDef, i) =>
                  fieldDef.row
                    ? <div key={i} className="grid grid-cols-2 gap-3">{fieldDef.fields.map(renderInput)}</div>
                    : renderInput(fieldDef)
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 text-sm font-medium border border-border rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                    bg-primary hover:bg-secondary text-text-primary rounded-lg
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                    : <><MapPin className="w-4 h-4" />Save Address</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT: Illustration ── */}
        <div className="hidden lg:flex flex-col items-center justify-center w-[44%] bg-bg-secondary border-l border-border px-12 py-16 gap-10">

          {/* SVG map illustration */}
          <svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm drop-shadow-lg">
            {/* Map card */}
            <rect x="16" y="16" width="328" height="268" rx="20" fill="#152531" />
            <rect x="16" y="16" width="328" height="268" rx="20" stroke="#2A4052" strokeWidth="1.5" />

            {/* Grid lines */}
            {[80,120,160,200,240].map(y => (
              <line key={`h${y}`} x1="16" y1={y} x2="344" y2={y} stroke="#1F3645" strokeWidth="1"/>
            ))}
            {[80,140,200,260,320].map(x => (
              <line key={`v${x}`} x1={x} y1="16" x2={x} y2="284" stroke="#1F3645" strokeWidth="1"/>
            ))}

            {/* Main roads */}
            <rect x="16"  y="155" width="328" height="14" rx="0" fill="#1F3645"/>
            <rect x="164" y="16"  width="14"  height="268" rx="0" fill="#1F3645"/>
            {/* Road dashes horizontal */}
            {[30,70,110,210,250,290].map(x => (
              <rect key={`rd${x}`} x={x} y="160" width="24" height="4" rx="2" fill="#2A4052"/>
            ))}
            {/* Road dashes vertical */}
            {[30,70,110,190,230,260].map(y => (
              <rect key={`rvd${y}`} x="169" y={y} width="4" height="16" rx="2" fill="#2A4052"/>
            ))}

            {/* Buildings — top left quadrant */}
            <rect x="32"  y="32"  width="50" height="100" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[40,40],[54,40],[68,40],[40,56],[68,56],[40,72],[54,72],[68,72],[40,88],[54,88]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.3 + (i%4)*0.1}/>
            ))}

            <rect x="100" y="50"  width="42" height="82" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[108,58],[122,58],[136,58],[108,74],[136,74],[108,90],[122,90]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="9" height="9" rx="1.5" fill="#4A9FD8" opacity={0.25 + (i%3)*0.15}/>
            ))}

            {/* Buildings — top right quadrant */}
            <rect x="196" y="28"  width="56" height="110" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[204,38],[218,38],[234,38],[248,38],[204,56],[234,56],[248,56],[204,72],[218,72],[248,72],[204,88],[218,88],[234,88]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.2 + (i%5)*0.08}/>
            ))}

            <rect x="272" y="44"  width="48" height="90" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[280,54],[294,54],[308,54],[280,70],[308,70],[280,86],[294,86]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.3 + (i%3)*0.1}/>
            ))}

            {/* Buildings — bottom left */}
            <rect x="28"  y="184" width="62" height="72" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[36,192],[52,192],[68,192],[36,208],[68,208],[36,224],[52,224],[68,224]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.25 + (i%4)*0.1}/>
            ))}

            <rect x="108" y="196" width="36" height="58" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[116,204],[130,204],[116,220],[130,220],[116,236]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="9" height="9" rx="1.5" fill="#4A9FD8" opacity={0.3 + i*0.08}/>
            ))}

            {/* Buildings — bottom right */}
            <rect x="196" y="188" width="54" height="66" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[204,196],[220,196],[236,196],[204,212],[236,212],[204,228],[220,228],[236,228]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.2 + (i%3)*0.12}/>
            ))}

            <rect x="268" y="180" width="60" height="76" rx="5" fill="#1C3341" stroke="#2A4052" strokeWidth="1.5"/>
            {[[276,190],[292,190],[308,190],[276,206],[308,206],[276,222],[292,222],[308,222]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="10" height="10" rx="1.5" fill="#4A9FD8" opacity={0.3 + (i%4)*0.07}/>
            ))}

            {/* Pin shadow */}
            <ellipse cx="180" cy="170" rx="14" ry="4.5" fill="#000" opacity="0.35"/>
            {/* Pin */}
            <path d="M180 88 C160 88 144 104 144 124 C144 150 180 178 180 178 C180 178 216 150 216 124 C216 104 200 88 180 88Z" fill="#4A9FD8"/>
            <path d="M180 88 C160 88 144 104 144 124 C144 136 152 148 162 158 C168 148 180 134 180 134 C180 134 192 148 198 158 C208 148 216 136 216 124 C216 104 200 88 180 88Z" fill="#5AB8F0" opacity="0.4"/>
            <circle cx="180" cy="124" r="12" fill="#0F1C26"/>
            <circle cx="180" cy="124" r="6"  fill="#4A9FD8"/>
            <circle cx="177" cy="121" r="2"  fill="#7DCFF5" opacity="0.7"/>
          </svg>

          {/* Caption */}
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-text-primary">Save your delivery address</p>
            <p className="text-xs text-text-secondary leading-relaxed max-w-55">
              We'll deliver your order right to your doorstep.
            </p>
          </div>

          <div className="w-full max-w-55 space-y-3">
            {[
              "Enter your name & contact",
              "Add your full address",
              "Save & proceed to checkout",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs text-text-secondary">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}