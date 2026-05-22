import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, MapPin, Clock, Minus, Plus, Trash2, ChevronRight, Check, ShoppingBag, X, Star } from "lucide-react";

const sourdoughImg = "https://images.unsplash.com/photo-1654524069610-31e8242a25c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBicmVhZCUyMGFydGlzYW4lMjBsb2FmfGVufDF8fHx8MTc3ODAwODk0N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const croissantImg = "https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjcm9pc3NhbnQlMjBmbGFreSUyMHBhc3RyeXxlbnwxfHx8fDE3NzgwMDg5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080";
const cinnamonImg  = "https://images.unsplash.com/photo-1639695855253-0c23c9c60fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHJvbGwlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc4MDA4OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  rating: number;
  badge?: string;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Sourdough Loaf",   description: "Classic long ferment, sea salt crust", price: 6.50, quantity: 1, image: sourdoughImg, rating: 4.9, badge: "Bestseller" },
  { id: 2, name: "Butter Croissant", description: "French-style, laminated dough",         price: 3.20, quantity: 2, image: croissantImg, rating: 4.8 },
  { id: 3, name: "Cinnamon Roll",    description: "Cardamom spiced, cream cheese glaze",   price: 4.00, quantity: 1, image: cinnamonImg,  rating: 4.7 },
];

const timeSlots = [
  { id: "now",  label: "Ready in 20 mins", sublabel: "Est. 10:45 AM", highlight: true },
  { id: "1045", label: "10:45 AM",         sublabel: "~20 minutes",   highlight: false },
  { id: "1115", label: "11:15 AM",         sublabel: "~50 minutes",   highlight: false },
  { id: "1145", label: "11:45 AM",         sublabel: "~80 minutes",   highlight: false },
];

interface Props { onBack?: () => void; }

export function ClickCollectPage({ onBack }: Props) {
  const [cart, setCart]               = useState<CartItem[]>(initialCart);
  const [selectedTime, setSelectedTime] = useState("now");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [preview, setPreview]         = useState<CartItem | null>(null);

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
          .filter(i => i.quantity > 0)
    );
    setPreview(prev => prev && prev.id === id
      ? prev.quantity + delta <= 0 ? null : { ...prev, quantity: prev.quantity + delta }
      : prev
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
    setPreview(p => (p?.id === id ? null : p));
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  // ── Order Confirmed ──────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f6f6f4] px-8 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg,#bf7f4f,#83533d)" }}>
          <Check size={32} color="white" strokeWidth={2.5} />
        </div>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#bf7f4f", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "6px" }}>
          Order Confirmed
        </p>
        <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.6px", lineHeight: 1.15 }}>
          See you soon!
        </h2>
        <p style={{ fontSize: "14px", color: "#a0938a", lineHeight: 1.7, marginTop: "8px", marginBottom: "32px" }}>
          Your order is being prepared.<br />
          Collect in <span style={{ color: "#bf7f4f", fontWeight: 600 }}>20 minutes</span>.
        </p>
        <div className="w-full bg-white rounded-3xl overflow-hidden mb-5 border border-[#e5d5cb]/50"
          style={{ boxShadow: "0 4px 24px rgba(73,46,35,0.08)" }}>
          <div className="flex items-center gap-3 p-4 border-b border-[#e5d5cb]/40">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f6f6f4" }}>
              <MapPin size={16} color="#bf7f4f" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#a0938a", fontWeight: 500 }}>Collection point</p>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>Tyne Artisan Bakery</p>
              <p style={{ fontSize: "12px", color: "#a0938a" }}>12 Quayside, Newcastle NE1 3DX</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f6f6f4" }}>
              <Clock size={16} color="#bf7f4f" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#a0938a", fontWeight: 500 }}>Ready at</p>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>10:45 AM · Ready in 20 mins</p>
            </div>
          </div>
        </div>
        <button onClick={() => { setOrderPlaced(false); setCart(initialCart); }}
          className="w-full rounded-2xl py-4 text-white"
          style={{ backgroundColor: "#492e23", fontSize: "15px", fontWeight: 700 }}>
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f6f6f4] relative" style={{ paddingTop: "54px" }}>

      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-4" style={{ borderBottom: "1px solid rgba(229,213,203,0.5)" }}>
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "#f6f6f4" }}>
              <ArrowLeft size={15} color="#492e23" strokeWidth={2} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin size={11} color="#bf7f4f" strokeWidth={2.5} />
              <span style={{ fontSize: "10px", color: "#bf7f4f", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                Tyne Artisan Bakery
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Click &amp; Collect
            </h1>
          </div>
          {totalItems > 0 && (
            <div className="relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#492e23" }}>
                <ShoppingBag size={17} color="white" strokeWidth={2} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#bf7f4f" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "white" }}>{totalItems}</span>
              </div>
            </div>
          )}
        </div>
        <button className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: "#f6f6f4" }}>
          <MapPin size={12} color="#a0938a" strokeWidth={2} />
          <span style={{ fontSize: "12px", color: "#6e6d68", flex: 1, textAlign: "left" }}>12 Quayside, Newcastle NE1 3DX</span>
          <ChevronRight size={12} color="#a0938a" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "130px" }}>

        {/* Pickup time */}
        <div className="px-5 pt-5 pb-1">
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Pickup Time
          </p>
          <div className="flex gap-2.5 overflow-x-auto" style={{ paddingBottom: "4px", scrollbarWidth: "none" }}>
            {timeSlots.map(slot => (
              <button key={slot.id} onClick={() => setSelectedTime(slot.id)}
                className="flex-shrink-0 rounded-2xl px-4 py-3 text-left transition-all"
                style={{
                  minWidth: "136px",
                  backgroundColor: selectedTime === slot.id ? "#492e23" : "white",
                  border: `1.5px solid ${selectedTime === slot.id ? "#492e23" : "#e5d5cb"}`,
                }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} color={selectedTime === slot.id ? "#c79e77" : "#bf7f4f"} strokeWidth={2.5} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: selectedTime === slot.id ? "white" : "#492e23", letterSpacing: "-0.2px" }}>
                    {slot.label}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: selectedTime === slot.id ? "#c79e77" : "#a0938a" }}>
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
            <button style={{ fontSize: "12px", color: "#bf7f4f", fontWeight: 700 }}>
              + Add More
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {cart.map(item => (
              /* Using div instead of button to avoid nested <button> DOM error */
              <div
                key={item.id}
                onClick={() => setPreview(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="bg-white rounded-2xl overflow-hidden flex"
                  style={{ border: "1px solid rgba(229,213,203,0.4)", boxShadow: "0 2px 12px rgba(73,46,35,0.06)" }}>

                  {/* Large product image */}
                  <div style={{ width: "96px", height: "96px", flexShrink: 0, position: "relative" }}>
                    <ImageWithFallback
                      src={item.image}
                      alt={`${item.name} — ${item.description}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
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
                        {/* Primary — product name */}
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                          {item.name}
                        </p>
                        {/* Secondary — description */}
                        <p style={{ fontSize: "11.5px", color: "#a0938a", lineHeight: 1.45, marginTop: "2px" }} className="truncate">
                          {item.description}
                        </p>
                        {/* Tertiary — rating */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star size={10} color="#bf7f4f" fill="#bf7f4f" />
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#bf7f4f" }}>{item.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#f6f6f4" }}>
                        <Trash2 size={11} color="#a0938a" strokeWidth={2} />
                      </button>
                    </div>

                    {/* Price + qty */}
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.4px" }}>
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1.5px solid #e5d5cb", backgroundColor: item.quantity === 1 ? "#fdf8f5" : "white" }}>
                          <Minus size={11} color={item.quantity === 1 ? "#c79e77" : "#492e23"} strokeWidth={2.5} />
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#492e23", minWidth: "16px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
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

        {/* Order summary */}
        {cart.length > 0 && (
          <div className="px-5 pt-5">
            <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(229,213,203,0.4)" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#a0938a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                Order Summary
              </p>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-1.5">
                  <span style={{ fontSize: "13px", color: "#6e6d68" }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontSize: "13px", color: "#492e23", fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(229,213,203,0.5)", marginTop: "10px", paddingTop: "10px" }}
                className="flex justify-between">
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#492e23" }}>Total</span>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#492e23" }}>£{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <div className="px-5 pt-12 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f0e8e2" }}>
              <ShoppingBag size={28} color="#c79e77" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#492e23" }}>Your basket is empty</p>
            <p style={{ fontSize: "13px", color: "#a0938a", marginTop: "4px" }}>Add items from the menu</p>
          </div>
        )}
      </div>

      {/* Product Preview Sheet */}
      {preview && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ backgroundColor: "rgba(30,18,12,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setPreview(null)}>
          <div className="bg-white rounded-t-3xl overflow-hidden"
            style={{ boxShadow: "0 -8px 40px rgba(73,46,35,0.18)" }}
            onClick={e => e.stopPropagation()}>

            {/* Hero image */}
            <div style={{ width: "100%", height: "220px", position: "relative" }}>
              <ImageWithFallback
                src={preview.image}
                alt={`${preview.name} — ${preview.description}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
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
              {/* Description */}
              <p style={{ fontSize: "14px", color: "#6e6d68", lineHeight: 1.6 }}>{preview.description}</p>

              {/* Rating + price */}
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

              {/* Qty */}
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

              {/* Add to Basket CTA */}
              <button onClick={() => setPreview(null)}
                className="w-full rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "#492e23", padding: "16px 20px" }}>
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={18} color="white" strokeWidth={2} />
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                    Add to Basket
                  </span>
                </div>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#c79e77", letterSpacing: "-0.3px" }}>
                  £{(preview.price * preview.quantity).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Place Order Bar */}
      {cart.length > 0 && !preview && (
        <div className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ borderTop: "1px solid rgba(229,213,203,0.5)", padding: "14px 20px 28px", boxShadow: "0 -8px 32px rgba(73,46,35,0.10)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: "10px", color: "#a0938a", letterSpacing: "0.5px", fontWeight: 600, textTransform: "uppercase" }}>
                Order Total
              </p>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "#492e23", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                £{subtotal.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#f6f6f4" }}>
              <Clock size={13} color="#bf7f4f" strokeWidth={2} />
              <span style={{ fontSize: "12px", color: "#6e6d68", fontWeight: 600 }}>
                {timeSlots.find(t => t.id === selectedTime)?.label}
              </span>
            </div>
          </div>
          <button onClick={() => setOrderPlaced(true)}
            className="w-full rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#492e23", padding: "16px 20px" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "white" }}>{totalItems}</span>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                Place Order
              </span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#c79e77", letterSpacing: "-0.3px" }}>
              £{subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
