import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft, MapPin, Clock, Minus, Plus, Trash2, ChevronRight,
  Check, Bike, Home, Building2, Navigation, CreditCard, Tag, Info,
  ShoppingBag, X, Star,
} from "lucide-react";

const sourdoughImg = "https://images.unsplash.com/photo-1654524069610-31e8242a25c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBicmVhZCUyMGFydGlzYW4lMjBsb2FmfGVufDF8fHx8MTc3ODAwODk0N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const croissantImg = "https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjcm9pc3NhbnQlMjBmbGFreSUyMHBhc3RyeXxlbnwxfHx8fDE3NzgwMDg5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080";
const cinnamonImg  = "https://images.unsplash.com/photo-1639695855253-0c23c9c60fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHJvbGwlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc4MDA4OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080";
const riderImg     = "https://images.unsplash.com/photo-1757777440206-00dcce0205e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHJpZGVyJTIwYmljeWNsZSUyMHVyYmFuJTIwY2l0eSUyMGZvb2R8ZW58MXx8fHwxNzc4MDA5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080";

interface CartItem {
  id: number; name: string; description: string;
  price: number; quantity: number; image: string;
  rating: number; badge?: string;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Sourdough Loaf",   description: "Classic long ferment, sea salt crust", price: 6.50, quantity: 1, image: sourdoughImg, rating: 4.9, badge: "Bestseller" },
  { id: 2, name: "Butter Croissant", description: "French-style, laminated dough",         price: 3.20, quantity: 2, image: croissantImg, rating: 4.8 },
  { id: 3, name: "Cinnamon Roll",    description: "Cardamom spiced, cream cheese glaze",   price: 4.00, quantity: 1, image: cinnamonImg,  rating: 4.7 },
];

const savedAddresses = [
  { id: "home", icon: Home,      label: "Home", address: "14 Grainger St, Newcastle NE1 5AF", eta: "25–35 min" },
  { id: "work", icon: Building2, label: "Work", address: "Central Station, Neville St NE1 5DL", eta: "30–40 min" },
];

const deliverySlots = [
  { id: "asap", label: "ASAP",      sublabel: "25–35 min", highlight: true  },
  { id: "1130", label: "11:30 AM",  sublabel: "Scheduled", highlight: false },
  { id: "1200", label: "12:00 PM",  sublabel: "Scheduled", highlight: false },
  { id: "1230", label: "12:30 PM",  sublabel: "Scheduled", highlight: false },
];

type Step = "cart" | "address" | "tracking";
interface Props { onBack?: () => void; }

export function DeliveryPage({ onBack }: Props) {
  const [cart, setCart]           = useState<CartItem[]>(initialCart);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedSlot, setSelectedSlot]       = useState("asap");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [step, setStep]           = useState<Step>("cart");
  const [preview, setPreview]     = useState<CartItem | null>(null);

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
          .filter(i => i.quantity > 0)
    );
    setPreview(p => p && p.id === id
      ? p.quantity + delta <= 0 ? null : { ...p, quantity: p.quantity + delta }
      : p
    );
  };
  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
    setPreview(p => (p?.id === id ? null : p));
  };

  const subtotal    = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 15 ? 0 : 2.5;
  const discount    = promoApplied ? 1.5 : 0;
  const total       = subtotal + deliveryFee - discount;
  const totalItems  = cart.reduce((s, i) => s + i.quantity, 0);
  const address     = savedAddresses.find(a => a.id === selectedAddress)!;

  // ── Shared: Product Preview Sheet ──────────────────────────────
  const PreviewSheet = () => !preview ? null : (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(30,18,12,0.55)", backdropFilter: "blur(4px)" }}
      onClick={() => setPreview(null)}>
      <div className="bg-white rounded-t-3xl overflow-hidden"
        style={{ boxShadow: "0 -8px 40px rgba(73,46,35,0.18)" }}
        onClick={e => e.stopPropagation()}>
        {/* Hero image */}
        <div style={{ width: "100%", height: "220px", position: "relative" }}>
          <ImageWithFallback src={preview.image}
            alt={`${preview.name} — ${preview.description}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(73,46,35,0.55) 0%,transparent 55%)" }} />
          <button onClick={() => setPreview(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}>
            <X size={15} color="white" strokeWidth={2.5} />
          </button>
          {preview.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full" style={{ backgroundColor: "#492e23" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "white" }}>{preview.badge}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <p style={{ fontSize: "22px", fontWeight: 800, color: "white", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              {preview.name}
            </p>
          </div>
        </div>
        <div className="px-5 pt-4 pb-5">
          <p style={{ fontSize: "14px", color: "#6e6d68", lineHeight: 1.6 }}>{preview.description}</p>
          <div className="flex items-center justify-between mt-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Star size={13} color="#bf7f4f" fill="#bf7f4f" />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#492e23" }}>{preview.rating}</span>
              <span style={{ fontSize: "12px", color: "#a0938a" }}>rating</span>
            </div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.5px" }}>
              £{preview.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-2xl px-4 py-3" style={{ backgroundColor: "#f6f6f4" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#492e23" }}>Quantity</span>
            <div className="flex items-center gap-4">
              <button onClick={() => updateQuantity(preview.id, -1)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: "1.5px solid #e5d5cb", backgroundColor: "white" }}>
                <Minus size={13} color="#492e23" strokeWidth={2.5} />
              </button>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#492e23", minWidth: "20px", textAlign: "center" }}>
                {preview.quantity}
              </span>
              <button onClick={() => updateQuantity(preview.id, 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#492e23" }}>
                <Plus size={13} color="white" strokeWidth={2.5} />
              </button>
            </div>
          </div>
          {/* Sticky Add to Basket */}
          <button onClick={() => setPreview(null)}
            className="w-full rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#492e23", padding: "16px 20px" }}>
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} color="white" strokeWidth={2} />
              <span style={{ fontSize: "15px", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>Add to Basket</span>
            </div>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#c79e77", letterSpacing: "-0.3px" }}>
              £{(preview.price * preview.quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // ── TRACKING ────────────────────────────────────────────────────
  if (step === "tracking") {
    return (
      <div className="flex flex-col h-full bg-[#f6f6f4]" style={{ paddingTop: "54px" }}>
        {/* Hero map */}
        <div className="relative flex-shrink-0" style={{ height: "260px" }}>
          <ImageWithFallback src={riderImg} alt="Delivery rider on the way"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(73,46,35,0.12) 0%,rgba(73,46,35,0) 45%,rgba(73,46,35,0.65) 100%)" }} />

          {/* Live status */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#492e23" }}>On the way · #TYN-441</span>
            </div>
          </div>

          {/* ETA overlay card */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4"
              style={{ boxShadow: "0 4px 24px rgba(73,46,35,0.14)", border: "1px solid rgba(229,213,203,0.4)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#bf7f4f,#83533d)" }}>
                <Bike size={22} color="white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Estimated arrival
                </p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                  {deliverySlots.find(s => s.id === selectedSlot)?.sublabel || "25–35 min"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "24px" }}>
          {/* Progress */}
          <div className="px-5 pt-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
              Order Progress
            </p>
            {[
              { label: "Order received",  sub: "Confirmed by bakery",  done: true,  time: "10:22 AM" },
              { label: "Being prepared",  sub: "Freshly baked to order", done: true, time: "10:28 AM" },
              { label: "Out for delivery", sub: "Jamie is on the way",  done: true,  time: "10:41 AM", active: true },
              { label: "Delivered",        sub: "Estimated arrival",    done: false, time: "Est. 11:05 AM" },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: s.done ? "#492e23" : "#ece9e6",
                      outline: s.active ? "3px solid rgba(191,127,79,0.3)" : "none",
                    }}>
                    {s.done
                      ? <Check size={13} color="white" strokeWidth={3} />
                      : <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#c9c2bc" }} />}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 my-1" style={{ height: "28px", backgroundColor: s.done ? "#e5d5cb" : "#ece9e6" }} />
                  )}
                </div>
                <div className="flex-1 flex justify-between items-start pb-3 pt-1">
                  <div>
                    {/* Status label — primary */}
                    <p style={{ fontSize: "14px", fontWeight: s.active ? 800 : 600, color: s.done ? "#492e23" : "#a0938a", letterSpacing: "-0.2px" }}>
                      {s.label}
                    </p>
                    {/* Sub description — secondary */}
                    <p style={{ fontSize: "11.5px", color: "#a0938a", marginTop: "1px" }}>{s.sub}</p>
                  </div>
                  {/* Time — tertiary */}
                  <p style={{ fontSize: "11px", color: "#a0938a", marginTop: "2px" }}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className="px-5 pt-2">
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ border: "1px solid rgba(229,213,203,0.4)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#f6f6f4" }}>
                <Navigation size={17} color="#bf7f4f" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "#a0938a", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Delivering to</p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>{address.address}</p>
              </div>
            </div>
          </div>

          {/* Rider card */}
          <div className="px-5 pt-3">
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ backgroundColor: "#492e23" }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#83533d", border: "2px solid #c79e77", fontSize: "20px" }}>
                👤
              </div>
              <div className="flex-1">
                <p style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>Jamie — Your rider</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={11} color="#c79e77" fill="#c79e77" />
                  <span style={{ fontSize: "11.5px", color: "#c79e77", fontWeight: 600 }}>4.9</span>
                  <span style={{ fontSize: "11px", color: "rgba(199,158,119,0.7)" }}>· 284 deliveries</span>
                </div>
              </div>
              <button className="px-3.5 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.14)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                Contact
              </button>
            </div>
          </div>

          <div className="px-5 pt-3 pb-4">
            <button onClick={() => { setStep("cart"); setCart(initialCart); }}
              className="w-full rounded-2xl py-4"
              style={{ backgroundColor: "white", border: "1.5px solid #e5d5cb", fontSize: "14px", fontWeight: 700, color: "#492e23" }}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ADDRESS STEP ────────────────────────────────────────────────
  if (step === "address") {
    return (
      <div className="flex flex-col h-full bg-[#f6f6f4] relative" style={{ paddingTop: "54px" }}>
        <div className="bg-white px-5 pt-4 pb-4" style={{ borderBottom: "1px solid rgba(229,213,203,0.5)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setStep("cart")}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "#f6f6f4" }}>
              <ArrowLeft size={15} color="#492e23" strokeWidth={2} />
            </button>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Bike size={11} color="#bf7f4f" strokeWidth={2} />
                <span style={{ fontSize: "10px", color: "#bf7f4f", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Home Delivery
                </span>
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                Delivery Details
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "130px" }}>
          <div className="px-5 pt-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Saved Addresses
            </p>
            <div className="flex flex-col gap-2.5">
              {savedAddresses.map(addr => (
                <button key={addr.id} onClick={() => setSelectedAddress(addr.id)} className="text-left w-full">
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all"
                    style={{ border: `2px solid ${selectedAddress === addr.id ? "#492e23" : "#e5d5cb"}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedAddress === addr.id ? "#492e23" : "#f6f6f4" }}>
                      <addr.icon size={17} color={selectedAddress === addr.id ? "white" : "#bf7f4f"} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>{addr.label}</p>
                      <p style={{ fontSize: "12px", color: "#a0938a", lineHeight: 1.4, marginTop: "1px" }}>{addr.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Clock size={10} color="#bf7f4f" strokeWidth={2} />
                        <span style={{ fontSize: "11px", color: "#bf7f4f", fontWeight: 700 }}>{addr.eta}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 pt-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              New Address
            </p>
            <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3.5"
              style={{ border: "1px solid rgba(229,213,203,0.6)" }}>
              <MapPin size={14} color="#a0938a" strokeWidth={2} />
              <input type="text" placeholder="Street address or postcode…"
                className="flex-1 outline-none bg-transparent"
                style={{ fontSize: "13px", color: "#492e23" }} />
            </div>
          </div>

          <div className="px-5 pt-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Delivery Time
            </p>
            <div className="flex gap-2.5 overflow-x-auto" style={{ paddingBottom: "4px", scrollbarWidth: "none" }}>
              {deliverySlots.map(slot => (
                <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                  className="flex-shrink-0 rounded-2xl px-4 py-3 text-left transition-all"
                  style={{
                    minWidth: "130px",
                    backgroundColor: selectedSlot === slot.id ? "#492e23" : "white",
                    border: `1.5px solid ${selectedSlot === slot.id ? "#492e23" : "#e5d5cb"}`,
                  }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {slot.highlight && <Bike size={11} color={selectedSlot === slot.id ? "#c79e77" : "#bf7f4f"} strokeWidth={2.5} />}
                    <span style={{ fontSize: "13px", fontWeight: 700, color: selectedSlot === slot.id ? "white" : "#492e23" }}>
                      {slot.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: selectedSlot === slot.id ? "#c79e77" : "#a0938a" }}>
                    {slot.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 pt-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Delivery Note
            </p>
            <div className="bg-white rounded-2xl px-4 py-3.5" style={{ border: "1px solid rgba(229,213,203,0.6)" }}>
              <textarea rows={2} placeholder="Leave by door, ring bell, etc."
                className="w-full outline-none bg-transparent resize-none"
                style={{ fontSize: "13px", color: "#492e23" }} />
            </div>
          </div>

          <div className="px-5 pt-4">
            <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: "#fff9f6", border: "1px solid rgba(229,213,203,0.5)" }}>
              <Info size={14} color="#bf7f4f" className="mt-0.5 flex-shrink-0" strokeWidth={2} />
              <p style={{ fontSize: "12.5px", color: "#7b7260", lineHeight: 1.6 }}>
                Free delivery on orders over <span style={{ fontWeight: 700, color: "#492e23" }}>£15</span>.
                {subtotal >= 15
                  ? <span style={{ color: "#bf7f4f", fontWeight: 600 }}> Free delivery applied ✓</span>
                  : <span> £{(15 - subtotal).toFixed(2)} away from free.</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ borderTop: "1px solid rgba(229,213,203,0.5)", padding: "14px 20px 28px", boxShadow: "0 -8px 32px rgba(73,46,35,0.10)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: "10px", color: "#a0938a", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Total inc. delivery
              </p>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                £{total.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#f6f6f4" }}>
              <Clock size={12} color="#bf7f4f" strokeWidth={2} />
              <span style={{ fontSize: "12px", color: "#6e6d68", fontWeight: 600 }}>
                {deliverySlots.find(s => s.id === selectedSlot)?.sublabel}
              </span>
            </div>
          </div>
          <button onClick={() => setStep("tracking")}
            className="w-full rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#492e23", padding: "16px 20px" }}>
            <div className="flex items-center gap-2.5">
              <Bike size={18} color="white" strokeWidth={2} />
              <span style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>Confirm Delivery</span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#c79e77" }}>£{total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    );
  }

  // ── CART (main screen) ──────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#f6f6f4] relative" style={{ paddingTop: "54px" }}>

      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-4" style={{ borderBottom: "1px solid rgba(229,213,203,0.5)" }}>
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "#f6f6f4" }}>
              <ArrowLeft size={15} color="#492e23" strokeWidth={2} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Bike size={11} color="#bf7f4f" strokeWidth={2} />
              <span style={{ fontSize: "10px", color: "#bf7f4f", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                Tyne Artisan Bakery
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Home Delivery
            </h1>
          </div>
          {totalItems > 0 && (
            <div className="relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#492e23" }}>
                <ShoppingBag size={17} color="white" strokeWidth={2} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#bf7f4f" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "white" }}>{totalItems}</span>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => setStep("address")} className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: "#f6f6f4" }}>
          <MapPin size={12} color="#bf7f4f" strokeWidth={2} />
          <span style={{ fontSize: "12px", color: "#6e6d68", flex: 1, textAlign: "left" }} className="truncate">
            {address.address}
          </span>
          <div className="flex items-center gap-1">
            <Clock size={10} color="#a0938a" strokeWidth={2} />
            <span style={{ fontSize: "11px", color: "#a0938a", fontWeight: 600 }}>{address.eta}</span>
          </div>
          <ChevronRight size={12} color="#a0938a" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "130px" }}>

        {/* Delivery window */}
        <div className="px-5 pt-5 pb-1">
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Delivery Window
          </p>
          <div className="flex gap-2.5 overflow-x-auto" style={{ paddingBottom: "4px", scrollbarWidth: "none" }}>
            {deliverySlots.map(slot => (
              <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                className="flex-shrink-0 rounded-2xl px-4 py-3 text-left transition-all"
                style={{
                  minWidth: "130px",
                  backgroundColor: selectedSlot === slot.id ? "#492e23" : "white",
                  border: `1.5px solid ${selectedSlot === slot.id ? "#492e23" : "#e5d5cb"}`,
                }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {slot.highlight && <Bike size={11} color={selectedSlot === slot.id ? "#c79e77" : "#bf7f4f"} strokeWidth={2.5} />}
                  <span style={{ fontSize: "13px", fontWeight: 700, color: selectedSlot === slot.id ? "white" : "#492e23" }}>
                    {slot.label}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: selectedSlot === slot.id ? "#c79e77" : "#a0938a" }}>
                  {slot.sublabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cart items */}
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase" }}>
                Your Order
              </p>
              <p style={{ fontSize: "12px", color: "#6e6d68", marginTop: "1px" }}>
                {totalItems} {totalItems === 1 ? "item" : "items"} selected
              </p>
            </div>
            <button style={{ fontSize: "12px", color: "#bf7f4f", fontWeight: 700 }}>+ Add More</button>
          </div>
          <div className="flex flex-col gap-3">
            {cart.map(item => (
              /* div avoids nested <button> DOM nesting error */
              <div key={item.id} onClick={() => setPreview(item)} style={{ cursor: "pointer" }}>
                <div className="bg-white rounded-2xl overflow-hidden flex"
                  style={{ border: "1px solid rgba(229,213,203,0.4)", boxShadow: "0 2px 12px rgba(73,46,35,0.06)" }}>
                  {/* Large product image */}
                  <div style={{ width: "96px", height: "96px", flexShrink: 0, position: "relative" }}>
                    <ImageWithFallback src={item.image}
                      alt={`${item.name} — ${item.description}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {item.badge && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#492e23" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, color: "white" }}>{item.badge}</span>
                      </div>
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "11.5px", color: "#a0938a", lineHeight: 1.45, marginTop: "2px" }} className="truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star size={10} color="#bf7f4f" fill="#bf7f4f" />
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#bf7f4f" }}>{item.rating}</span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#f6f6f4" }}>
                        <Trash2 size={11} color="#a0938a" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.4px" }}>
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1.5px solid #e5d5cb", backgroundColor: item.quantity === 1 ? "#fdf8f5" : "white" }}>
                          <Minus size={11} color={item.quantity === 1 ? "#c79e77" : "#492e23"} strokeWidth={2.5} />
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#492e23", minWidth: "16px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#492e23" }}>
                          <Plus size={11} color="white" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo */}
        <div className="px-5 pt-5">
          <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3 overflow-hidden"
            style={{ border: "1px solid rgba(229,213,203,0.6)" }}>
            <Tag size={14} color="#bf7f4f" strokeWidth={2} className="flex-shrink-0" />
            <input type="text" placeholder="Promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              className="flex-1 outline-none bg-transparent"
              style={{ fontSize: "13px", color: "#492e23" }} />
            <button
              onClick={() => { if (promoCode === "TYNE10") setPromoApplied(true); }}
              className="px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: promoApplied ? "#e5d5cb" : "#492e23", fontSize: "12px", fontWeight: 700, color: promoApplied ? "#72422c" : "white" }}>
              {promoApplied ? "Applied ✓" : "Apply"}
            </button>
          </div>
          {!promoApplied
            ? <p style={{ fontSize: "11px", color: "#a0938a", marginTop: "6px", paddingLeft: "4px" }}>
                Try <span style={{ fontWeight: 700, color: "#bf7f4f" }}>TYNE10</span> for a welcome discount
              </p>
            : <p style={{ fontSize: "11.5px", color: "#bf7f4f", fontWeight: 600, marginTop: "6px", paddingLeft: "4px" }}>
                −£1.50 discount applied
              </p>
          }
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="px-5 pt-5">
            <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(229,213,203,0.4)" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                Order Summary
              </p>
              {cart.map(i => (
                <div key={i.id} className="flex justify-between py-1.5">
                  <span style={{ fontSize: "13px", color: "#6e6d68" }}>{i.name} × {i.quantity}</span>
                  <span style={{ fontSize: "13px", color: "#492e23", fontWeight: 600 }}>£{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(229,213,203,0.5)", marginTop: "10px", paddingTop: "10px" }}
                className="space-y-1.5">
                <div className="flex justify-between">
                  <span style={{ fontSize: "13px", color: "#6e6d68" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", color: "#492e23", fontWeight: 600 }}>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: "13px", color: "#6e6d68" }}>Delivery</span>
                  <span style={{ fontSize: "13px", color: deliveryFee === 0 ? "#bf7f4f" : "#492e23", fontWeight: 600 }}>
                    {deliveryFee === 0 ? "Free 🎉" : `£${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between">
                    <span style={{ fontSize: "13px", color: "#bf7f4f" }}>TYNE10</span>
                    <span style={{ fontSize: "13px", color: "#bf7f4f", fontWeight: 700 }}>−£{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1" style={{ borderTop: "1px solid rgba(229,213,203,0.4)" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#492e23" }}>Total</span>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#492e23" }}>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment row */}
        <div className="px-5 pt-4">
          <button onClick={() => setStep("address")}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ border: "1px solid rgba(229,213,203,0.4)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#f6f6f4" }}>
              <CreditCard size={17} color="#bf7f4f" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>Apple Pay</p>
              <p style={{ fontSize: "11.5px", color: "#a0938a", marginTop: "1px" }}>Touch ID to pay</p>
            </div>
            <ChevronRight size={14} color="#a0938a" />
          </button>
        </div>
      </div>

      {/* Preview sheet */}
      <PreviewSheet />

      {/* Sticky order bar */}
      {cart.length > 0 && !preview && (
        <div className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ borderTop: "1px solid rgba(229,213,203,0.5)", padding: "14px 20px 28px", boxShadow: "0 -8px 32px rgba(73,46,35,0.10)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: "10px", color: "#a0938a", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Order Total
              </p>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                £{total.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#f6f6f4" }}>
              <Bike size={13} color="#bf7f4f" strokeWidth={2} />
              <span style={{ fontSize: "12px", color: "#6e6d68", fontWeight: 600 }}>
                {deliverySlots.find(s => s.id === selectedSlot)?.sublabel}
              </span>
            </div>
          </div>
          <button onClick={() => setStep("address")}
            className="w-full rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#492e23", padding: "16px 20px" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "white" }}>{totalItems}</span>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                Proceed to Delivery
              </span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#c79e77", letterSpacing: "-0.3px" }}>
              £{total.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}