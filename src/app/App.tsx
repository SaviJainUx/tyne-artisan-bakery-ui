import { useState } from "react";
import { ClickCollectPage } from "./components/ClickCollectPage";
import { SubscriptionPage } from "./components/SubscriptionPage";
import { DeliveryPage } from "./components/DeliveryPage";
import { ShoppingBag, RefreshCw, Bike } from "lucide-react";

type Screen = "collect" | "delivery" | "subscription";

const screens: { id: Screen; label: string; icon: typeof ShoppingBag }[] = [
  { id: "collect",      label: "Click & Collect", icon: ShoppingBag },
  { id: "delivery",     label: "Delivery",         icon: Bike        },
  { id: "subscription", label: "Subscription",     icon: RefreshCw   },
];

// ── iPhone 16 exact spec ────────────────────────────────────────
// Logical resolution : 393 × 852 pt
// Physical           : 1179 × 2556 px  @3×
// Dynamic Island     : 126 × 37 pt pill, 11 pt from top edge of glass
// Frame corner radius: ~50 pt outer / ~43 pt inner (screen)
// Bezel thickness    : ~10 pt
const PH_W = 393;   // screen logical width
const PH_H = 852;   // screen logical height
const BEZ  = 10;    // frame bezel thickness
const OR   = 50;    // outer corner radius
const IR   = 43;    // inner (screen) corner radius

// Full shell dimensions (screen + bezel on each side)
const FULL_W = PH_W + BEZ * 2;  // 413
const FULL_H = PH_H + BEZ * 2;  // 872

// ── Dynamic Island ──────────────────────────────────────────────
function DynamicIsland() {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      style={{ top: "11px" }}
    >
      <div
        style={{
          width: "126px", height: "37px",
          borderRadius: "20px",
          backgroundColor: "#000",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.05), inset 0 1px 2px rgba(0,0,0,0.8)",
        }}
      >
        {/* Selfie camera ring */}
        <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: "#0d0d0d", border: "1.5px solid #1a1a1a", position: "relative" }}>
          <div style={{ position: "absolute", top: "2px", left: "2.5px", width: "3.5px", height: "3.5px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.09)" }} />
        </div>
        {/* Face ID proximity sensor */}
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#0a0a0a", border: "1px solid #181818" }} />
      </div>
    </div>
  );
}

// ── iOS Status Bar ──────────────────────────────────────────────
function StatusBar({ onDark = false }: { onDark?: boolean }) {
  const c = onDark ? "white" : "#492e23";
  const o = onDark ? 0.75 : 0.45;
  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-between z-20 pointer-events-none"
      style={{ height: "54px", padding: "0 28px 0 30px" }}
    >
      <span style={{ fontSize: "15px", fontWeight: 700, color: c, letterSpacing: "-0.4px" }}>9:41</span>
      <div className="flex items-center gap-[5px]">
        {/* Cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0,1,2,3].map(i => (
            <rect key={i} x={i*4.5} y={12-(i+1)*3} width="3.2" height={(i+1)*3} rx="0.7"
              fill={c} opacity={i === 3 ? o : 1} />
          ))}
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <circle cx="8" cy="11" r="1.3" fill={c} />
          <path d="M4.8 7.8a4.5 4.5 0 0 1 6.4 0"  stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M2 5.3a7.6 7.6 0 0 1 12 0"     stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity={o+0.2} />
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div style={{ width: "25px", height: "12px", borderRadius: "3.5px", border: `1.5px solid ${c}`, padding: "1.5px", display: "flex" }}>
            <div style={{ width: "75%", height: "100%", borderRadius: "1.5px", backgroundColor: c }} />
          </div>
          <div style={{ width: "2px", height: "5px", marginLeft: "1px", borderRadius: "0 1px 1px 0", backgroundColor: c, opacity: o + 0.2 }} />
        </div>
      </div>
    </div>
  );
}

// ── Home Indicator ──────────────────────────────────────────────
function HomeIndicator({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div style={{
        width: "134px", height: "5px", borderRadius: "3px",
        backgroundColor: onDark ? "rgba(255,255,255,0.28)" : "rgba(73,46,35,0.20)",
      }} />
    </div>
  );
}

// ── Phone Shell (renders at FULL_W × FULL_H, scaled to fit) ────
function PhoneShell({
  children, label, active, onClick, icon: Icon, scale,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  icon: typeof ShoppingBag;
  scale: number;
}) {
  const dispW = Math.round(FULL_W * scale);
  const dispH = Math.round(FULL_H * scale);

  return (
    <div className="flex flex-col items-center" style={{ gap: "18px" }}>
      {/* Label chip */}
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "8px 16px", borderRadius: "999px",
          backgroundColor: active ? "#492e23" : "rgba(255,255,255,0.65)",
          color: active ? "white" : "#7b7260",
          fontSize: "12px", fontWeight: 600, letterSpacing: "0.1px",
          border: active ? "none" : "1px solid rgba(229,213,203,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: active ? "0 4px 18px rgba(73,46,35,0.30)" : "0 2px 8px rgba(0,0,0,0.06)",
          cursor: "pointer", transition: "all 0.2s ease",
        }}
      >
        <Icon size={13} strokeWidth={2.5} />
        {label}
      </button>

      {/* Clipping wrapper — visible area = scaled phone size */}
      <div style={{ width: dispW, height: dispH, flexShrink: 0, position: "relative" }}>
        {/* Inner phone rendered at FULL size, then scaled down */}
        <div
          style={{
            width: FULL_W, height: FULL_H,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {/* Aluminium frame */}
          <div
            style={{
              position: "relative",
              width: FULL_W, height: FULL_H,
              borderRadius: OR,
              background: active
                ? "linear-gradient(160deg,#3d2518 0%,#2a1a10 45%,#402518 100%)"
                : "linear-gradient(160deg,#5e5854 0%,#423e3a 45%,#555049 100%)",
              padding: BEZ,
              boxShadow: active
                ? `0 48px 100px rgba(73,46,35,0.50), 0 0 0 0.5px rgba(210,185,160,0.22), inset 0 1.5px 0 rgba(255,255,255,0.10)`
                : `0 28px 64px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(180,170,160,0.18), inset 0 1px 0 rgba(255,255,255,0.07)`,
              transition: "box-shadow 0.3s ease",
            }}
          >
            {/* Volume buttons (left) */}
            {[{ t: 130, h: 34 }, { t: 178, h: 64 }, { t: 256, h: 64 }].map((b, i) => (
              <div key={i} style={{
                position: "absolute", left: -(BEZ - 1),
                top: b.t, width: BEZ - 1, height: b.h,
                borderRadius: "3px 0 0 3px",
                background: active
                  ? "linear-gradient(90deg,#3a2418,#4a3028)"
                  : "linear-gradient(90deg,#4e4a46,#5c5854)",
              }} />
            ))}
            {/* Power button (right) */}
            <div style={{
              position: "absolute", right: -(BEZ - 1),
              top: 162, width: BEZ - 1, height: 80,
              borderRadius: "0 3px 3px 0",
              background: active
                ? "linear-gradient(270deg,#3a2418,#4a3028)"
                : "linear-gradient(270deg,#4e4a46,#5c5854)",
            }} />

            {/* Glass screen */}
            <div
              style={{
                position: "relative",
                width: "100%", height: "100%",
                borderRadius: IR,
                backgroundColor: "#f6f6f4",
                overflow: "hidden",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.10)",
              }}
            >
              {/* Screen glare */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 40,
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%)",
                borderRadius: IR, pointerEvents: "none",
              }} />

              <DynamicIsland />
              <StatusBar onDark={false} />
              <HomeIndicator onDark={false} />

              {/* Page content */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("collect");

  // Desktop 3-up: each phone displayed at 78% of full size → 322 × 680 px visible
  const DESK_SCALE = 0.78;
  // Single phone (tablet / mobile): 90% scale
  const SOLO_SCALE = 0.90;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(150deg,#f0ebe4 0%,#e6dad0 35%,#dccfc3 70%,#d3c4b4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "44px",
        paddingBottom: "60px",
      }}
    >
      {/* ── Wordmark ── */}
      <div style={{ marginBottom: "36px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "4px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg,#72422c 0%,#492e23 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(73,46,35,0.35)",
          }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🌾</span>
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "#492e23", letterSpacing: "2.5px", textTransform: "uppercase", lineHeight: 1 }}>
              Tyne Artisan Bakery
            </p>
            <p style={{ fontSize: "10px", color: "#a0938a", letterSpacing: "1.8px", textTransform: "uppercase", marginTop: "3px" }}>
              iPhone 16 · Mobile App Preview
            </p>
          </div>
        </div>
      </div>

      {/* ── Small-screen tab bar ── */}
      <div
        className="2xl:hidden"
        style={{ display: "flex", gap: "8px", marginBottom: "28px" }}
      >
        {screens.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveScreen(id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "999px",
              backgroundColor: activeScreen === id ? "#492e23" : "rgba(255,255,255,0.7)",
              color: activeScreen === id ? "white" : "#7b7260",
              fontSize: "12px", fontWeight: 600,
              border: "1px solid rgba(229,213,203,0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: activeScreen === id ? "0 4px 16px rgba(73,46,35,0.28)" : "none",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <Icon size={13} strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Desktop 3-up (≥1536px) ── */}
      <div
        className="hidden 2xl:flex"
        style={{ gap: "36px", alignItems: "flex-start" }}
      >
        {screens.map(({ id, label, icon }) => (
          <PhoneShell
            key={id}
            label={label}
            icon={icon}
            active={activeScreen === id}
            onClick={() => setActiveScreen(id)}
            scale={DESK_SCALE}
          >
            {id === "collect"      && <ClickCollectPage />}
            {id === "delivery"     && <DeliveryPage />}
            {id === "subscription" && <SubscriptionPage />}
          </PhoneShell>
        ))}
      </div>

      {/* ── Single phone (below 2xl) ── */}
      <div className="2xl:hidden" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {/* Clipping wrapper at SOLO_SCALE */}
        <div style={{
          width:  Math.round(FULL_W * SOLO_SCALE),
          height: Math.round(FULL_H * SOLO_SCALE),
          position: "relative",
        }}>
          <div style={{
            width: FULL_W, height: FULL_H,
            transformOrigin: "top left",
            transform: `scale(${SOLO_SCALE})`,
          }}>
            {/* Aluminium frame */}
            <div style={{
              position: "relative",
              width: FULL_W, height: FULL_H,
              borderRadius: OR,
              background: "linear-gradient(160deg,#3d2518 0%,#2a1a10 45%,#402518 100%)",
              padding: BEZ,
              boxShadow: "0 40px 90px rgba(73,46,35,0.45), 0 0 0 0.5px rgba(210,185,160,0.22), inset 0 1.5px 0 rgba(255,255,255,0.10)",
            }}>
              {/* Volume buttons */}
              {[{ t: 130, h: 34 }, { t: 178, h: 64 }, { t: 256, h: 64 }].map((b, i) => (
                <div key={i} style={{
                  position: "absolute", left: -(BEZ - 1),
                  top: b.t, width: BEZ - 1, height: b.h,
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(90deg,#3a2418,#4a3028)",
                }} />
              ))}
              {/* Power button */}
              <div style={{
                position: "absolute", right: -(BEZ - 1),
                top: 162, width: BEZ - 1, height: 80,
                borderRadius: "0 3px 3px 0",
                background: "linear-gradient(270deg,#3a2418,#4a3028)",
              }} />
              {/* Screen */}
              <div style={{
                position: "relative",
                width: "100%", height: "100%",
                borderRadius: IR,
                backgroundColor: "#f6f6f4",
                overflow: "hidden",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.10)",
              }}>
                <div style={{
                  position: "absolute", inset: 0, zIndex: 40,
                  background: "linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 45%)",
                  borderRadius: IR, pointerEvents: "none",
                }} />
                <DynamicIsland />
                <StatusBar onDark={false} />
                <HomeIndicator onDark={false} />
                <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                  {activeScreen === "collect"      && <ClickCollectPage />}
                  {activeScreen === "delivery"     && <DeliveryPage />}
                  {activeScreen === "subscription" && <SubscriptionPage />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: "40px", textAlign: "center",
        fontSize: "10px", color: "#b5a49a",
        letterSpacing: "1.2px", textTransform: "uppercase",
      }}>
        Tyne Artisan Bakery · Newcastle upon Tyne · Est. 2019
      </p>
    </div>
  );
}
