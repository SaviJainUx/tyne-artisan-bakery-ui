import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Check, ChevronRight, Leaf, Clock, Star, Gift, Truck, RefreshCw } from "lucide-react";

const heroImg = "https://images.unsplash.com/photo-1775591648306-9d1889c0b019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBhcnRpc2FuJTIwYnJlYWQlMjBsb2FmJTIwcnVzdGljfGVufDF8fHx8MTc3ODAwOTE1Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const breadBasketImg = "https://images.unsplash.com/photo-1732565729552-994c6af761e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwYmFrZXJ5JTIwd2Vla2x5JTIwc3Vic2NyaXB0aW9ufGVufDF8fHx8MTc3ODAwOTE1Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const pastryImg = "https://images.unsplash.com/photo-1762310981399-58458ab768c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwcGFzdHJ5JTIwY3JvaXNzYW50JTIwbW9ybmluZyUyMGJhc2tldHxlbnwxfHx8fDE3NzgwMDkxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080";

const plans = [
  {
    id: "weekly",
    label: "Weekly",
    frequency: "Every week",
    price: 12.5,
    originalPrice: 15.0,
    saving: "17% off",
    description: "Fresh sourdough loaf every week, baked the morning of collection.",
    badge: "Most Popular",
    highlight: true,
  },
  {
    id: "biweekly",
    label: "Bi-weekly",
    frequency: "Every 2 weeks",
    price: 13.0,
    originalPrice: 15.0,
    saving: "13% off",
    description: "A sourdough loaf every fortnight — perfect for smaller households.",
    badge: null,
    highlight: false,
  },
];

const benefits = [
  { icon: Leaf, title: "Always Fresh", desc: "Baked the morning of your pickup or delivery" },
  { icon: Star, title: "Priority Pickup", desc: "Skip the queue — your order is reserved for you" },
  { icon: Gift, title: "Subscriber Savings", desc: "Members save up to 17% on every order" },
  { icon: Clock, title: "Flexible Schedule", desc: "Pause, skip, or cancel anytime" },
];

interface Props {
  onBack?: () => void;
}

export function SubscriptionPage({ onBack }: Props) {
  const [selectedPlan, setSelectedPlan] = useState("weekly");
  const [subscribed, setSubscribed] = useState(false);
  const [collectOrDeliver, setCollectOrDeliver] = useState<"collect" | "deliver">("collect");

  const plan = plans.find(p => p.id === selectedPlan)!;

  if (subscribed) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f6f6f4] px-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #bf7f4f 0%, #83533d 100%)" }}
        >
          <Check size={32} color="white" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.4px", lineHeight: 1.3 }}>
          You're subscribed!
        </h2>
        <p className="mt-2 mb-8" style={{ fontSize: "14px", color: "#a0938a", lineHeight: 1.7 }}>
          Welcome to the Tyne family.<br />
          Your first <span style={{ color: "#bf7f4f", fontWeight: 600 }}>{plan.label.toLowerCase()} sourdough</span> is confirmed.
        </p>
        <div className="w-full bg-white rounded-2xl overflow-hidden mb-6 shadow-sm border border-[#e5d5cb]/50">
          <div className="h-32 overflow-hidden">
            <ImageWithFallback src={heroImg} alt="Sourdough" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#492e23" }}>Signature Sourdough</p>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: "11px", fontWeight: 600, backgroundColor: "#e5d5cb", color: "#72422c" }}
              >
                {plan.label}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#a0938a" }}>
              £{plan.price.toFixed(2)} per {plan.id === "weekly" ? "week" : "fortnight"} · {collectOrDeliver === "collect" ? "Collection" : "Delivery"}
            </p>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#e5d5cb]/40">
              <RefreshCw size={12} color="#bf7f4f" strokeWidth={2} />
              <span style={{ fontSize: "12px", color: "#6e6d68" }}>Renews automatically · Cancel anytime</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSubscribed(false)}
          className="w-full rounded-2xl py-4 text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: "#492e23", fontSize: "15px", fontWeight: 700 }}
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f6f6f4] relative">
      {/* Hero Header */}
      <div className="relative">
        <div className="h-[220px] overflow-hidden">
          <ImageWithFallback src={heroImg} alt="Artisan sourdough" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(73,46,35,0.3) 0%, rgba(73,46,35,0.0) 40%, rgba(73,46,35,0.65) 100%)" }}
          />
        </div>

        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-12 left-5 w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            <ArrowLeft size={16} color="white" strokeWidth={2} />
          </button>
        )}

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
            style={{ backgroundColor: "rgba(191,127,79,0.9)", backdropFilter: "blur(4px)" }}
          >
            <Leaf size={10} color="white" strokeWidth={2.5} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.6px", textTransform: "uppercase" }}>
              Artisan Subscription
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "white", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            Never miss your<br />morning loaf.
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-36">

        {/* Collect / Deliver toggle */}
        <div className="px-5 pt-5 pb-1">
          <div className="flex gap-2 bg-white rounded-2xl p-1 border border-[#e5d5cb]/40">
            {(["collect", "deliver"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setCollectOrDeliver(opt)}
                className="flex-1 rounded-xl py-2.5 transition-all"
                style={{
                  backgroundColor: collectOrDeliver === opt ? "#492e23" : "transparent",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: collectOrDeliver === opt ? "white" : "#a0938a",
                  letterSpacing: "-0.1px",
                }}
              >
                {opt === "collect" ? "Click & Collect" : "Home Delivery"}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="px-5 pt-5">
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#a0938a", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
            Choose Your Plan
          </p>
          <div className="flex flex-col gap-3">
            {plans.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className="text-left w-full transition-all"
              >
                <div
                  className="rounded-2xl p-4 border-2 transition-all"
                  style={{
                    borderColor: selectedPlan === p.id ? "#492e23" : "#e5d5cb",
                    backgroundColor: selectedPlan === p.id ? "#fff9f6" : "white",
                  }}
                >
                  {/* Plan header row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          borderColor: selectedPlan === p.id ? "#492e23" : "#c79e77",
                          backgroundColor: selectedPlan === p.id ? "#492e23" : "transparent",
                        }}
                      >
                        {selectedPlan === p.id && <Check size={11} color="white" strokeWidth={3} />}
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.3px" }}>{p.label}</p>
                        <p style={{ fontSize: "11px", color: "#a0938a" }}>{p.frequency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span style={{ fontSize: "20px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.4px" }}>
                          £{p.price.toFixed(2)}
                        </span>
                        <span style={{ fontSize: "12px", color: "#a0938a", textDecoration: "line-through" }}>
                          £{p.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <span
                        className="inline-block px-2 py-0.5 rounded-full mt-0.5"
                        style={{ fontSize: "10px", fontWeight: 700, backgroundColor: "#e5d5cb", color: "#72422c", letterSpacing: "0.2px" }}
                      >
                        {p.saving}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#6e6d68", lineHeight: 1.5, marginLeft: "28px" }}>{p.description}</p>
                  {p.badge && (
                    <div
                      className="mt-3 ml-7 inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#492e23" }}
                    >
                      <Star size={9} color="#c79e77" fill="#c79e77" />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.3px" }}>
                        {p.badge}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="px-5 pt-6">
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#a0938a", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
            What's Included
          </p>
          <div className="bg-white rounded-2xl overflow-hidden border border-[#e5d5cb]/40">
            {/* Product preview strip */}
            <div className="flex gap-2 p-3 border-b border-[#e5d5cb]/40">
              <div className="w-[72px] h-[56px] rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback src={heroImg} alt="Sourdough" className="w-full h-full object-cover" />
              </div>
              <div className="w-[72px] h-[56px] rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback src={breadBasketImg} alt="Bread basket" className="w-full h-full object-cover" />
              </div>
              <div className="w-[72px] h-[56px] rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback src={pastryImg} alt="Pastries" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center pl-1">
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#492e23" }}>Signature Sourdough</p>
                <p style={{ fontSize: "11px", color: "#a0938a", marginTop: "1px" }}>+ seasonal extras</p>
                <div className="flex items-center gap-1 mt-1">
                  <ChevronRight size={11} color="#bf7f4f" />
                  <span style={{ fontSize: "10.5px", color: "#bf7f4f", fontWeight: 600 }}>View full box</span>
                </div>
              </div>
            </div>

            {/* Item list */}
            <div className="divide-y divide-[#e5d5cb]/30">
              {[
                { name: "Long Ferment Sourdough", note: "Classic sea salt crust" },
                { name: "Baker's Note Card", note: "Weekly tasting & pairing tips" },
                { name: "Seasonal Add-on", note: "Rotates monthly" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#e5d5cb" }}
                  >
                    <Check size={10} color="#72422c" strokeWidth={3} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#492e23" }}>{item.name}</p>
                    <p style={{ fontSize: "11px", color: "#a0938a" }}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-5 pt-6">
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#a0938a", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
            Member Benefits
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-[#e5d5cb]/40"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#f6f6f4" }}
                >
                  <b.icon size={16} color="#bf7f4f" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.2px" }}>{b.title}</p>
                <p className="mt-0.5" style={{ fontSize: "11px", color: "#a0938a", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup info */}
        <div className="px-5 pt-5">
          <div className="bg-[#492e23] rounded-2xl p-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              {collectOrDeliver === "collect" ? (
                <Clock size={18} color="#c79e77" strokeWidth={2} />
              ) : (
                <Truck size={18} color="#c79e77" strokeWidth={2} />
              )}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                {collectOrDeliver === "collect" ? "Priority Collection Slot" : "Morning Delivery"}
              </p>
              <p style={{ fontSize: "11.5px", color: "#c79e77", lineHeight: 1.5, marginTop: "1px" }}>
                {collectOrDeliver === "collect"
                  ? "Your loaf is reserved — collect any time from 7:30 AM"
                  : "Delivered before 10 AM on your chosen day"}
              </p>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div className="px-5 pt-4 pb-2">
          <p style={{ fontSize: "11px", color: "#a0938a", textAlign: "center", lineHeight: 1.7 }}>
            Cancel or pause anytime before your next bake date.<br />
            No lock-in. No hidden fees.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#e5d5cb]/50 px-5 pt-4 pb-8 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ fontSize: "11px", color: "#a0938a", letterSpacing: "0.3px" }}>
              {plan.label} · {collectOrDeliver === "collect" ? "Collection" : "Delivery"}
            </p>
            <div className="flex items-baseline gap-2">
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#492e23", letterSpacing: "-0.4px", lineHeight: 1.1 }}>
                £{plan.price.toFixed(2)}
              </p>
              <span style={{ fontSize: "12px", color: "#a0938a" }}>/{plan.id === "weekly" ? "wk" : "2wks"}</span>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: "#e5d5cb" }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#72422c" }}>{plan.saving}</span>
          </div>
        </div>
        <button
          onClick={() => setSubscribed(true)}
          className="w-full rounded-2xl py-4 text-white transition-all active:scale-[0.98] active:opacity-90"
          style={{ backgroundColor: "#492e23", fontSize: "15px", fontWeight: 700, letterSpacing: "-0.2px" }}
        >
          Start Subscription
        </button>
      </div>
    </div>
  );
}
