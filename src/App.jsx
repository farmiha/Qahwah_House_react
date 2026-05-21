 import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const C = {
  espresso: "#1a0a02", darkRoast: "#2d1505", mahogany: "#4a1a08",
  amber: "#c07b3a", gold: "#d4a853", cream: "#f5efe6",
  warmWhite: "#faf6f0", textSecondary: "#5c3a1e", textMuted: "#9b7355",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Cormorant Garamond', Georgia, serif; background: #faf6f0; color: #1a0a02; overflow-x: hidden; }
  img { max-width: 100%; display: block; }
  a { color: inherit; text-decoration: none; }
  ul { list-style: none; }
  em { font-style: italic; color: #c07b3a; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f5efe6; }
  ::-webkit-scrollbar-thumb { background: #c07b3a55; border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
  @keyframes grain {
    0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)}
    30%{transform:translate(3%,-15%)} 50%{transform:translate(12%,9%)}
    70%{transform:translate(-4%,20%)} 90%{transform:translate(-10%,5%)}
  }
  @keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
  @keyframes cartBounce { 0%{transform:scale(1)} 30%{transform:scale(1.35)} 60%{transform:scale(.9)} 100%{transform:scale(1)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .anim-fadeup { animation: fadeUp .9s ease both; }
  .anim-fadeup-d1 { animation: fadeUp .9s ease .15s both; }
  .anim-fadeup-d2 { animation: fadeUp .9s ease .3s both; }
  .anim-fadeup-d3 { animation: fadeUp .9s ease .45s both; }
  .section-label::before, .section-label::after { content:'—'; margin:0 8px; opacity:.45; }
  .hero-bg-img { position:absolute; inset:0; background: url('img67.jpg') center/cover no-repeat; }
  .hero-bg-overlay { position:absolute; inset:0; background: linear-gradient(160deg, rgba(26,10,2,.88) 0%, rgba(45,21,5,.75) 50%, rgba(74,26,8,.82) 100%); }
  .hero-grain { position:absolute; inset:-50%; width:200%; height:200%; opacity:.035;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size:200px 200px; animation: grain 8s steps(1) infinite; pointer-events:none; }
  .gallery-slider { display:flex; transition:transform .6s cubic-bezier(.4,0,.2,1); }
  .nav-link-item { position:relative; }
  .nav-link-item::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1px; background:#c07b3a; transition:width .3s; }
  .nav-link-item:hover::after, .nav-link-item.active::after { width:100%; }
  .mobile-nav { transition: right .38s cubic-bezier(.4,0,.2,1); }
  .add-pulse { animation: pulse .3s ease; }
  .stars { color:#d4a853; letter-spacing:2px; }
  .timeline-line { position:absolute; left:50%; top:0; bottom:0; width:1px; background:linear-gradient(to bottom, transparent, #c07b3a55, transparent); transform:translateX(-50%); }
  .scroll-line { width:1px; height:60px; background:linear-gradient(to bottom, #c07b3a, transparent); margin:8px auto 0; animation:scrollPulse 2s ease-in-out infinite; }
  .value-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,10,2,.12); }
  .value-card { transition:all .3s; }
  .feature-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,10,2,.1); }
  .feature-card { transition:all .3s; }
  .menu-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(26,10,2,.12); }
  .menu-card { transition:all .3s; }
  .menu-preview-card:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(26,10,2,.15); }
  .menu-preview-card { transition:all .3s; }
  .info-card:hover { border-color:#c07b3a88; }
  .info-card { transition:border-color .25s; }
  .qh-input:focus { outline:none; border-color:#c07b3a; box-shadow:0 0 0 3px rgba(192,123,58,.12); }
  .slider-arrow:hover { background: rgba(192,123,58,.2) !important; border-color: rgba(245,239,230,.8) !important; }
  @media (max-width:640px) {
    .stat-sep { border-right:none !important; border-bottom:1px solid rgba(192,123,58,.2) !important; }
    .timeline-line { left:20px; }
    .tl-item-left, .tl-item-right { padding-left:56px !important; padding-right:0 !important; justify-content:flex-start !important; }
    .tl-dot { left:20px !important; }
    .tl-content { max-width:100% !important; }
  }
  @media (max-width:768px) {
    .gallery-slide { min-width:85vw !important; }
    .menu-card-grid { grid-template-columns: repeat(2,1fr) !important; }
    .slider-info-bar { padding: 20px 32px 16px !important; }
    .slider-arrows-left { left: 12px !important; }
    .slider-arrows-right { right: 12px !important; }
  }
  @media (max-width:480px) {
    .menu-card-grid { grid-template-columns: 1fr !important; }
    .slider-info-bar { flex-direction: column !important; align-items: flex-start !important; }
  }
`;

const NAV_LINKS = [
  { label: "Home", page: "home" },
  { label: "Menu", page: "menu" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
];

const GALLERY_SLIDES = [
  { img: "img44.jpg", caption: "Yemeni Qahwah" },
  { img: "img6.jpg", caption: "Espresso Crafted" },
  { img: "img22.jpg", caption: "Premium Beans" },
  { img: "img5.jpg", caption: "Cozy Interior" },
  { img: "img33.jpg", caption: "Heritage Ambiance" },
  { img: "img3.jpg", caption: "Chai Service" },
];

const TESTIMONIALS = [
  { text: "The ORIGINAL spot where the current Yemeni Coffee revolution started. The espresso beans have such a unique flavor — strong yet blends beautifully. Right at the top of my list nationwide.", author: "Negin, Verified Guest" },
  { text: "From the moment I walked in, I was greeted with warmth. The cozy decor, coupled with the aroma of freshly brewed coffee, immediately put me at ease. The baristas are true artists.", author: "Verified Guest" },
  { text: "I'm now comfortable saying goodbye to Starbucks and Dunkin'. The high quality coffee is like no other. The world really owes it to Yemen for brewing the very first drinkable coffee!", author: "Verified Guest" },
];

const VALUES = [
  { num: "01", title: "Authenticity", desc: "We never compromise on the authentic Yemeni coffee experience. Every recipe, every blend, every tradition is preserved exactly as our ancestors intended." },
  { num: "02", title: "Sustainability", desc: "Our Al Hasbani Farms have been farmed organically for over eight generations. We believe the best coffee grows in harmony with nature, not against it." },
  { num: "03", title: "Community", desc: "Qahwah — coffee — has always been a reason to gather. Our cafes are spaces for community, conversation, and connection across all cultures." },
  { num: "04", title: "Fairness", desc: "We work directly with our own family farms, ensuring fair wages, sustainable practices, and that every farmer receives the recognition they deserve." },
];

const TIMELINE = [
  { year: "1800s", side: "left", title: "The First Harvest", desc: "Our ancestors planted the first Arabica coffee trees on the slopes of the Al Hasbani mountain range in Yemen. These ancient trees still bear fruit today." },
  { year: "1950s", side: "right", title: "Expanding the Farm", desc: "The fifth generation expanded operations, introducing sustainable farming practices and organic cultivation methods maintained to this day." },
  { year: "2000s", side: "left", title: "Coming to America", desc: "The seventh generation brought their family's legacy to the United States, opening the first Qahwah House in Dearborn, Michigan." },
  { year: "2010s", side: "right", title: "The Revolution Begins", desc: "Word spread fast. Qahwah House became the epicenter of the Yemeni coffee revolution in America, inspiring a new generation." },
  { year: "Today", side: "left", title: "30+ Locations & Growing", desc: "With over 30 locations across the United States, Qahwah House continues its mission: to share authentic Yemeni coffee culture with the world." },
];

const ADDONS = [
  ["Extra Shot Espresso", "+$1.50"], ["Oat / Almond / Coconut Milk", "+$0.75"],
  ["Cardamom Syrup", "+$0.75"], ["Date Caramel Drizzle", "+$0.75"],
  ["Cold Foam", "+$1.00"], ["Rose Water", "+$0.50"],
];

async function fetchMenu(category) {
  const url = category ? `${API_URL}/menu?category=${category}` : `${API_URL}/menu`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

async function postOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(192,123,58,.2)", borderTop: "3px solid #c07b3a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="section-label" style={{ display: "inline-block", fontFamily: "'Jost',sans-serif", fontSize: ".75rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: "#c07b3a", marginBottom: "14px" }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", style = {}, full = false, disabled = false }) {
  const base = { display: "inline-block", fontFamily: "'Jost',sans-serif", fontSize: ".78rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "14px 36px", borderRadius: "4px", cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all .3s", width: full ? "100%" : undefined, textAlign: "center", opacity: disabled ? 0.6 : 1 };
  const variants = {
    primary: { background: "#c07b3a", color: "#faf6f0" },
    outline: { background: "transparent", color: "#f5efe6", border: "1px solid rgba(245,239,230,.5)" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

function useCart() {
  const [cart, setCart] = useState([]);
  const sessionId = useRef("session-" + Math.random().toString(36).slice(2, 10)).current;

  // Load cart from MongoDB on mount
  useEffect(() => {
    fetch(`${API_URL}/cart/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setCart(
            data.items.map(i => ({
              _id: i.menuItemId,
              name: i.name,
              price: i.price,
              qty: i.qty,
            }))
          );
        }
      })
      .catch(() => {});
  }, [sessionId]);

  const add = (item) => {
    // Update local state immediately
    setCart(prev => {
      const ex = prev.find(i => i._id === item._id);
      return ex
        ? prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });

    // Always sync +1 to MongoDB (backend accumulates correctly)
    fetch(`${API_URL}/cart/${sessionId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        qty: 1,
      }),
    }).catch(() => {});
  };

  const remove = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    // Sync removal to MongoDB via clear-and-rebuild approach
    // We'll use the update endpoint to set qty to 0
    fetch(`${API_URL}/cart/${sessionId}/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId: id }),
    }).catch(() => {});
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

    // Sync quantity change to MongoDB
    if (delta > 0) {
      const item = cart.find(i => i._id === id);
      if (item) {
        fetch(`${API_URL}/cart/${sessionId}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menuItemId: id,
            name: item.name,
            price: item.price,
            qty: 1,
          }),
        }).catch(() => {});
      }
    } else {
      fetch(`${API_URL}/cart/${sessionId}/decrement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: id }),
      }).catch(() => {});
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const clear = () => {
    setCart([]);
    fetch(`${API_URL}/cart/${sessionId}/clear`, { method: "DELETE" }).catch(() => {});
  };

  return { cart, add, remove, changeQty, total, count, clear };
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#1a0a02", color: "#f5efe6", fontFamily: "'Jost',sans-serif", fontSize: ".75rem", letterSpacing: ".1em", padding: "11px 28px", borderRadius: "40px", border: "1px solid rgba(192,123,58,.4)", zIndex: 3000, whiteSpace: "nowrap", animation: "fadeUp .3s ease both" }}>
      {msg}
    </div>
  );
}

function Header({ page, setPage, cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const headerBg = page === "home" && !scrolled ? "transparent" : "rgba(26,10,2,.96)";
  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: headerBg, backdropFilter: scrolled || page !== "home" ? "blur(12px)" : "none", boxShadow: scrolled || page !== "home" ? "0 2px 24px rgba(0,0,0,.3)" : "none", transition: "all .35s" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, padding: "0 40px", maxWidth: 1400, margin: "0 auto" }}>
          <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, color: "#f5efe6" }}>
            ☕ Qahwah<span style={{ color: "#c07b3a" }}>House</span>
          </button>
          <ul style={{ display: "flex", gap: 40, alignItems: "center" }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <li key={l.page}>
                <button onClick={() => { setPage(l.page); window.scrollTo(0, 0); }} className={"nav-link-item " + (page === l.page ? "active" : "")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: ".8rem", letterSpacing: ".12em", textTransform: "uppercase", color: page === l.page ? "#f5efe6" : "rgba(245,239,230,.75)", transition: "color .3s" }}>
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={onCartOpen} style={{ background: "none", border: "1px solid rgba(192,123,58,.4)", borderRadius: 6, cursor: "pointer", color: "rgba(245,239,230,.85)", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Jost',sans-serif", fontSize: ".75rem", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 16px", transition: "all .25s" }}>
                🛒 Cart
                {cartCount > 0 && <span style={{ background: "#c07b3a", color: "#fff", fontFamily: "'Jost',sans-serif", fontSize: ".6rem", fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
              </button>
            </li>
          </ul>
          <button onClick={() => setMobileOpen(v => !v)} style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 }} id="hamburger-btn">
            <span style={{ display: "block", width: 24, height: 2, background: "#f5efe6", borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: "#f5efe6", borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: "#f5efe6", borderRadius: 2 }} />
          </button>
        </nav>
      </header>
      {mobileOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 1040 }} onClick={() => setMobileOpen(false)} />}
      <div className="mobile-nav" style={{ position: "fixed", top: 0, right: mobileOpen ? 0 : "-100%", bottom: 0, width: "min(300px,78vw)", background: "#1a0a02", zIndex: 1050, display: "flex", flexDirection: "column", justifyContent: "center", padding: "88px 40px 48px", borderLeft: "1px solid rgba(192,123,58,.25)", boxShadow: "-8px 0 40px rgba(0,0,0,.4)" }}>
        {NAV_LINKS.map(l => (
          <button key={l.page} onClick={() => { setPage(l.page); setMobileOpen(false); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", borderBottom: "1px solid rgba(192,123,58,.12)", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "1.1rem", letterSpacing: ".05em", textTransform: "uppercase", color: page === l.page ? "#c07b3a" : "rgba(245,239,230,.85)", display: "block", padding: "14px 0", textAlign: "left", width: "100%" }}>
            {l.label}
          </button>
        ))}
        <button onClick={() => { onCartOpen(); setMobileOpen(false); }} style={{ marginTop: 24, background: "#c07b3a", color: "#fff", border: "none", borderRadius: 4, padding: "12px 24px", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase" }}>
          🛒 Cart {cartCount > 0 ? "(" + cartCount + ")" : ""}
        </button>
      </div>
      <style>{"@media(max-width:768px){.desktop-nav{display:none!important;}#hamburger-btn{display:flex!important;}}"}</style>
    </>
  );
}

function CartDrawer({ open, onClose, cart, changeQty, remove, total, onCheckout }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1200 }} />}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px,100vw)", background: "#faf6f0", zIndex: 1300, display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .4s cubic-bezier(.4,0,.2,1)", boxShadow: "-8px 0 40px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid rgba(192,123,58,.2)", background: "#1a0a02" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#f5efe6", fontSize: "1.3rem" }}>Your Order</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,230,.6)", fontSize: "1.5rem" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9b7355", fontFamily: "'Jost',sans-serif", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>☕</div>Your cart is empty
            </div>
          ) : cart.map(item => (
            <div key={item._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#f5efe6", borderRadius: 8, border: "1px solid rgba(192,123,58,.2)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: ".95rem", color: "#1a0a02", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h4>
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", color: "#9b7355", textTransform: "uppercase", letterSpacing: ".08em" }}>${item.price.toFixed(2)} each</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: "#c07b3a" }}>${(item.price * item.qty).toFixed(2)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => changeQty(item._id, -1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(192,123,58,.4)", background: "none", cursor: "pointer", color: "#5c3a1e" }}>−</button>
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".85rem", fontWeight: 500, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => changeQty(item._id, 1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(192,123,58,.4)", background: "none", cursor: "pointer", color: "#5c3a1e" }}>+</button>
                  <button onClick={() => remove(item._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9b7355", fontSize: ".9rem", marginLeft: 4 }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(192,123,58,.2)", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#9b7355" }}>Total</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.7rem", fontWeight: 700, color: "#1a0a02" }}>${total.toFixed(2)}</span>
          </div>
          <Btn full onClick={onCheckout}>Checkout — ${total.toFixed(2)}</Btn>
        </div>
      </div>
    </>
  );
}

function CheckoutModal({ open, onClose, cart, total, onSuccess }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const orderTypeRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderData = {
        customer: { name: nameRef.current.value, email: emailRef.current.value, phone: phoneRef.current.value },
        orderType: orderTypeRef.current.value,
        items: cart.map(i => ({ menuItemId: i._id, name: i.name, price: i.price, qty: i.qty })),
        total,
      };
      await postOrder(orderData);
      setDone(true);
      setTimeout(() => { setDone(false); onSuccess(); onClose(); }, 3000);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#faf6f0", borderRadius: 12, maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.4)", animation: "fadeUp .35s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", background: "#1a0a02", borderRadius: "12px 12px 0 0" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#f5efe6", fontSize: "1.3rem" }}>Checkout</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,230,.6)", fontSize: "1.5rem" }}>×</button>
        </div>
        <div style={{ padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#1a0a02", marginBottom: 12 }}>Order Placed!</h3>
              <p style={{ color: "#5c3a1e" }}>Thank you for your order at Qahwah House.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#9b7355", marginBottom: 12 }}>Order Summary</p>
                {cart.map(i => (
                  <div key={i._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(192,123,58,.12)", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "#5c3a1e" }}>
                    <span>{i.name} ×{i.qty}</span>
                    <span style={{ color: "#c07b3a", fontWeight: 600 }}>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.2rem", color: "#1a0a02" }}>
                  <span>Total</span><span style={{ color: "#c07b3a" }}>${total.toFixed(2)}</span>
                </div>
              </div>
              {error && <p style={{ color: "#c0392b", fontFamily: "'Jost',sans-serif", fontSize: ".8rem", marginBottom: 16 }}>{error}</p>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 6 }}>Full Name</label>
                  <input ref={nameRef} type="text" placeholder="Jane Smith" required className="qh-input" style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 6 }}>Email</label>
                  <input ref={emailRef} type="email" placeholder="jane@example.com" required className="qh-input" style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 6 }}>Phone</label>
                  <input ref={phoneRef} type="tel" placeholder="+1 (555) 000-0000" className="qh-input" style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 6 }}>Order Type</label>
                  <select ref={orderTypeRef} required className="qh-input" style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }}>
                    <option value="">Select...</option><option>Dine In</option><option>Takeout</option>
                  </select>
                </div>
                <Btn full disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? "Placing Order..." : "Place Order — $" + total.toFixed(2)}
                </Btn>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PageHero({ label, title, subtitle }) {
  return (
    <section style={{ background: "linear-gradient(160deg,#1a0a02 0%,#2d1505 50%,#4a1a08 100%)", minHeight: 340, display: "flex", alignItems: "flex-end", padding: "80px 40px 56px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 70%,rgba(192,123,58,.15) 0%,transparent 60%)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <SectionLabel>{label}</SectionLabel>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: "#f5efe6", fontSize: "clamp(2.5rem,6vw,5rem)", marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: title }} />
        <p style={{ color: "rgba(245,239,230,.6)", fontSize: "1.1rem", maxWidth: 500 }}>{subtitle}</p>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#1a0a02" }}>
      <div style={{ padding: "64px 0 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 48 }}>
          <div>
            <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#f5efe6", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              ☕ Qahwah<span style={{ color: "#c07b3a" }}>House</span>
            </button>
            <p style={{ color: "rgba(245,239,230,.55)", fontSize: ".95rem", marginBottom: 20 }}>Eight generations of Yemeni coffee mastery.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#c07b3a", marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV_LINKS.map(l => (
                <li key={l.page}>
                  <button onClick={() => { setPage(l.page); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: ".85rem", color: "rgba(245,239,230,.55)" }}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#c07b3a", marginBottom: 20 }}>Hours</h4>
            {[["Mon–Thu", "7am–10pm"], ["Friday", "7am–11pm"], ["Saturday", "8am–11pm"], ["Sunday", "8am–9pm"]].map(([d, t]) => (
              <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(192,123,58,.1)", fontFamily: "'Jost',sans-serif", fontSize: ".78rem", color: "rgba(245,239,230,.55)" }}>
                <span>{d}</span><span>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#c07b3a", marginBottom: 20 }}>Contact</h4>
            <p style={{ color: "rgba(245,239,230,.55)", fontSize: ".9rem", lineHeight: 1.8 }}>162 Bedford Ave<br />Brooklyn, NY 11211</p>
            <a href="mailto:coffee@qahwahhouse.com" style={{ display: "block", color: "#c07b3a", fontFamily: "'Jost',sans-serif", fontSize: ".8rem", marginTop: 12 }}>coffee@qahwahhouse.com</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(192,123,58,.15)", marginTop: 48, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ color: "rgba(245,239,230,.3)", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".1em" }}>© 2026 Qahwah House. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

function MenuCard({ item, onAdd, added }) {
  return (
    <div className="menu-card" style={{ background: "#f5efe6", border: "1px solid rgba(192,123,58,.2)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
        <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ display: "inline-block", background: "#c07b3a", color: "#fff", fontFamily: "'Jost',sans-serif", fontSize: ".55rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", padding: "2px 10px", borderRadius: 20, width: "fit-content" }}>{item.badge}</span>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", color: "#1a0a02", lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontFamily: "'Jost',sans-serif", fontSize: ".82rem", color: "#9b7355", lineHeight: 1.5, flex: 1 }}>{item.desc}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, color: "#c07b3a" }}>${item.price.toFixed(2)}</div>
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: ".65rem", letterSpacing: ".08em", color: "#9b7355", textTransform: "uppercase" }}>{item.size}</div>
          </div>
          <button onClick={onAdd} className={added ? "add-pulse" : ""}
            style={{ background: added ? "#2d6a4f" : "#c07b3a", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'Jost',sans-serif", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 16px", cursor: "pointer", transition: "background .2s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
            {added ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuSlider({ items, onAdd, showToast }) {
  const [idx, setIdx] = useState(0);
  const [addedIds, setAddedIds] = useState({});
  const [fading, setFading] = useState(false);
  const go = (dir) => {
    setFading(true);
    setTimeout(() => { setIdx(i => (i + dir + items.length) % items.length); setFading(false); }, 200);
  };
  const goTo = (i) => {
    if (i === idx) return;
    setFading(true);
    setTimeout(() => { setIdx(i); setFading(false); }, 200);
  };
  const item = items[idx];
  const handleAdd = (it) => {
    onAdd(it);
    showToast(it.name + " added!");
    setAddedIds(v => ({ ...v, [it._id]: true }));
    setTimeout(() => setAddedIds(v => { const n = { ...v }; delete n[it._id]; return n; }), 1400);
  };
  if (!item) return null;
  return (
    <div style={{ background: "#1a0a02", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", height: "clamp(380px, 55vw, 560px)", display: "flex", alignItems: "stretch" }}>
        <div style={{ flex: 1, background: "rgba(10,4,1,.7)", minWidth: 0 }} />
        <div style={{ width: "clamp(280px, 36vw, 480px)", flexShrink: 0, overflow: "hidden", opacity: fading ? 0 : 1, transform: fading ? "scale(1.03)" : "scale(1)", transition: "opacity .2s ease, transform .2s ease" }}>
          <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1, background: "rgba(10,4,1,.7)", minWidth: 0 }} />
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "32%", background: "linear-gradient(to right, rgba(26,10,2,1) 0%, rgba(26,10,2,0) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "32%", background: "linear-gradient(to left, rgba(26,10,2,1) 0%, rgba(26,10,2,0) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(26,10,2,.9) 0%, transparent 100%)", pointerEvents: "none" }} />
        <button className="slider-arrow slider-arrows-left" onClick={() => go(-1)} style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(26,10,2,.4)", border: "1px solid rgba(245,239,230,.4)", color: "#f5efe6", fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all .2s", lineHeight: 1 }}>‹</button>
        <button className="slider-arrow slider-arrows-right" onClick={() => go(1)} style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(26,10,2,.4)", border: "1px solid rgba(245,239,230,.4)", color: "#f5efe6", fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all .2s", lineHeight: 1 }}>›</button>
      </div>
      <div className="slider-info-bar" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "24px 72px 20px", opacity: fading ? 0 : 1, transition: "opacity .2s ease", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{ display: "inline-block", background: "#c07b3a", color: "#fff", fontFamily: "'Jost',sans-serif", fontSize: ".58rem", fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", padding: "3px 14px", borderRadius: 20, marginBottom: 12 }}>{item.badge}</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, color: "#f5efe6", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.1, marginBottom: 10 }}>{item.name}</h2>
          <p style={{ color: "rgba(245,239,230,.6)", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", maxWidth: 400, lineHeight: 1.6 }}>{item.desc}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "#c07b3a", lineHeight: 1 }}>${item.price.toFixed(2)}</div>
          <div style={{ fontFamily: "'Jost',sans-serif", fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,239,230,.4)", marginBottom: 4 }}>{item.size}</div>
          <button onClick={() => handleAdd(item)} style={{ background: addedIds[item._id] ? "#2d6a4f" : "#c07b3a", color: "#fff", border: "none", borderRadius: 6, padding: "13px 32px", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap" }}>
            {addedIds[item._id] ? "✓ Added" : "+ Add to Cart"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 0 28px" }}>
        {items.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width: i === idx ? 28 : 8, height: 8, borderRadius: 4, background: i === idx ? "#c07b3a" : "rgba(192,123,58,.3)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

function CardGrid({ items, onAdd, showToast }) {
  const [addedIds, setAddedIds] = useState({});
  const handleAdd = (item) => {
    onAdd(item);
    showToast(item.name + " added!");
    setAddedIds(v => ({ ...v, [item._id]: true }));
    setTimeout(() => setAddedIds(v => { const n = { ...v }; delete n[item._id]; return n; }), 1400);
  };
  return (
    <div className="menu-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {items.map(item => (
        <MenuCard key={item._id} item={item} added={!!addedIds[item._id]} onAdd={() => handleAdd(item)} />
      ))}
    </div>
  );
}

function HomePage({ setPage, onAdd, showToast, drinks }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGalleryIdx(i => (i + 1) % GALLERY_SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);
  const previewItems = drinks.slice(0, 3);
  return (
    <>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div className="hero-bg-img" />
        <div className="hero-bg-overlay" />
        <div className="hero-grain" />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
          <p className="anim-fadeup" style={{ fontFamily: "'Jost',sans-serif", fontSize: ".75rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c07b3a", marginBottom: 24 }}>Eight Generations of Excellence</p>
          <h1 className="anim-fadeup-d1" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, color: "#f5efe6", lineHeight: .9, marginBottom: 32, fontSize: "clamp(4rem,12vw,9rem)" }}>
            Qahwah<br /><em style={{ color: "#c07b3a" }}>House</em>
          </h1>
          <p className="anim-fadeup-d2" style={{ color: "rgba(245,239,230,.65)", fontSize: "1.1rem", maxWidth: 500, margin: "0 auto 40px" }}>Authentic Yemeni Coffee Culture — From the highlands of Yemen to your cup</p>
          <div className="anim-fadeup-d3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => { setPage("menu"); window.scrollTo(0, 0); }}>View Our Menu</Btn>
            <Btn variant="outline" onClick={() => { setPage("about"); window.scrollTo(0, 0); }}>Our Story</Btn>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center", color: "rgba(245,239,230,.4)", fontFamily: "'Jost',sans-serif", fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase" }}>
          Scroll<div className="scroll-line" />
        </div>
      </section>
      <section style={{ padding: "100px 0", background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>Coffee Crafted with<br /><em>Heritage & Heart</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {[
              { icon: "🌿", title: "Grown Organically", desc: "Sourced from the renowned Al Hasbani Farms in Yemen's highlands — only the highest quality Arabica beans." },
              { icon: "🫘", title: "Farm to Cup", desc: "Grown on our eight-generation family farms, then roasted in small batches by our passionate team of artisans." },
              { icon: "✨", title: "Unique Flavors", desc: "A curated selection offering diverse flavor profiles, from spiced cardamom blends to single-origin pour-overs." },
              { icon: "🏆", title: "Industry Leader", desc: "Roasted to order, ensuring every bean arrives at the peak of its flavor. No stale coffee, ever." },
              { icon: "💎", title: "Unmatched Quality", desc: "Direct collaboration with farmers ensures fair compensation and environmentally friendly cultivation." },
              { icon: "🤝", title: "Building Community", desc: "Your satisfaction is prioritized above all else, with a dedicated team ready to share the Yemeni coffee experience." },
            ].map(f => (
              <div key={f.title} className="feature-card" style={{ padding: "40px 32px", background: "#fff", borderRadius: 8, border: "1px solid rgba(192,123,58,.15)" }}>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", color: "#1a0a02", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "#5c3a1e", fontSize: ".95rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{ background: "#1a0a02", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {[["8+", "Generations"], ["100%", "Organic Beans"], ["30+", "Locations"], ["100+", "Products"]].map(([n, l], i) => (
          <div key={l} className="stat-sep" style={{ borderRight: i < 3 ? "1px solid rgba(192,123,58,.2)" : "none", padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#c07b3a" }}>{n}</div>
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(245,239,230,.5)", marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>
      <section style={{ padding: "100px 0", background: "#faf6f0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Gallery</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>A Feast for<br /><em>the Senses</em></h2>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="gallery-slider" style={{ transform: "translateX(calc(-" + galleryIdx * 33.333 + "%))" }}>
            {GALLERY_SLIDES.map((s, i) => (
              <div key={i} style={{ minWidth: "33.333%", flexShrink: 0, padding: "0 8px" }} className="gallery-slide">
                <div style={{ position: "relative", overflow: "hidden", height: 340, borderRadius: 8 }}>
                  <img src={s.img} alt={s.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16, color: "#fff", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", textShadow: "0 2px 8px rgba(0,0,0,.6)" }}>{s.caption}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {GALLERY_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setGalleryIdx(i)} style={{ width: i === galleryIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === galleryIdx ? "#c07b3a" : "rgba(192,123,58,.3)", border: "none", cursor: "pointer", transition: "all .3s" }} />
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "100px 0", background: "#f5efe6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Our Menu</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>Signature<br /><em>Creations</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {previewItems.map((item, i) => (
              <div key={item._id} className="menu-preview-card" style={{ background: "#fff", borderRadius: 8, padding: "40px 32px", border: i === 1 ? "2px solid #c07b3a" : "1px solid rgba(192,123,58,.2)", position: "relative" }}>
                {i === 1 && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#c07b3a", color: "#fff", fontFamily: "'Jost',sans-serif", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", padding: "4px 16px", borderRadius: 20 }}>Most Popular</div>}
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>☕</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#1a0a02", marginBottom: 8 }}>{item.name}</h3>
                <p style={{ color: "#5c3a1e", fontSize: ".95rem", marginBottom: 20 }}>{item.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#c07b3a" }}>${item.price.toFixed(2)}</span>
                  <button onClick={() => { onAdd(item); showToast(item.name + " added!"); }} style={{ background: "#c07b3a", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Add</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Btn onClick={() => { setPage("menu"); window.scrollTo(0, 0); }}>Full Menu</Btn>
          </div>
        </div>
      </section>
      <section style={{ padding: "100px 0", background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Testimonials</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>What Our<br /><em>Guests Say</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "40px 32px", border: "1px solid rgba(192,123,58,.15)" }}>
                <div className="stars" style={{ marginBottom: 16 }}>★★★★★</div>
                <p style={{ color: "#5c3a1e", fontSize: "1rem", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#9b7355" }}>— {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MenuPage({ onAdd, showToast }) {
  const [activeTab, setActiveTab] = useState("drinks");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchMenu(activeTab)
      .then(setItems)
      .catch(() => setError("Failed to load menu. Please try again."))
      .finally(() => setLoading(false));
  }, [activeTab]);
  return (
    <>
      <PageHero label="Our Menu" title="Taste <em>Tradition</em>" subtitle="From spiced ancient brews to artisan pastries, every item is crafted with heritage." />
      <section style={{ background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(192,123,58,.2)", overflowX: "auto", paddingTop: 40 }}>
            {[["drinks", "Drinks & Coffee"], ["pastries", "Pastries & Sweets"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ fontFamily: "'Jost',sans-serif", fontSize: ".8rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", padding: "16px 32px", border: "none", background: "transparent", cursor: "pointer", transition: "all .3s", whiteSpace: "nowrap", borderBottom: "2px solid " + (activeTab === key ? "#c07b3a" : "transparent"), marginBottom: -1, color: activeTab === key ? "#c07b3a" : "#9b7355" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Spinner /> : error ? (
          <p style={{ textAlign: "center", padding: "40px 0", color: "#c0392b", fontFamily: "'Jost',sans-serif" }}>{error}</p>
        ) : (
          <>
            <MenuSlider items={items} onAdd={onAdd} showToast={showToast} />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 0" }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".7rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#9b7355", marginBottom: 24 }}>
                All {activeTab === "drinks" ? "Drinks" : "Pastries"}
              </p>
              <CardGrid items={items} onAdd={onAdd} showToast={showToast} />
            </div>
          </>
        )}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 80px" }}>
          <div style={{ padding: 40, background: "#f5efe6", borderRadius: 8, border: "1px solid rgba(192,123,58,.2)" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#1a0a02", marginBottom: 24, fontSize: "1.4rem" }}>Add-Ons & Customizations</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
              {ADDONS.map(([name, price]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(192,123,58,.15)", fontFamily: "'Cormorant Garamond',serif", fontSize: ".95rem", color: "#5c3a1e" }}>
                  <span>{name}</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, color: "#c07b3a" }}>{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero label="Est. 1800s" title="Our <em>Story</em>" subtitle="Eight generations of coffee mastery, from Yemen to the world" />
      <section style={{ padding: "100px 0", background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <SectionLabel>The Beginning</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02", marginBottom: 24 }}>Where Coffee<br /><em>Was Born</em></h2>
              <p style={{ color: "#5c3a1e", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>Long before coffee became the world's most beloved beverage, it was a Yemeni secret — cultivated on terraced mountain farms, brewed in family homes, and shared as a symbol of hospitality and community.</p>
              <p style={{ color: "#5c3a1e", lineHeight: 1.8, marginBottom: 16 }}>Qahwah House traces its roots to the ancient coffee-growing highlands of Yemen, where our family has cultivated premium Arabica coffee beans for over eight generations.</p>
              <p style={{ color: "#5c3a1e", lineHeight: 1.8 }}>The word "Qahwah" (قهوة) is the original Arabic word that gave rise to "coffee" in every language on earth. Yemen didn't just grow coffee — Yemen invented coffee culture.</p>
            </div>
            <div style={{ position: "relative" }}>
              <img src="img33.jpg" alt="Qahwah House" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ position: "absolute", bottom: -24, left: -24, background: "#1a0a02", padding: "24px 28px", borderRadius: 8, maxWidth: 280, border: "1px solid rgba(192,123,58,.3)" }}>
                <p style={{ color: "#f5efe6", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.6 }}>"Coffee was born in Yemen. Qahwah House brings that birthright to every cup."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "100px 0", background: "#f5efe6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Our Journey</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>Eight Generations,<br /><em>One Mission</em></h2>
          </div>
          <div style={{ position: "relative" }}>
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <div key={i} className={"tl-item-" + item.side} style={{ display: "flex", justifyContent: item.side === "left" ? "flex-end" : "flex-start", paddingRight: item.side === "left" ? "calc(50% + 40px)" : 0, paddingLeft: item.side === "right" ? "calc(50% + 40px)" : 0, marginBottom: 48, position: "relative" }}>
                <div className="tl-dot" style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#c07b3a", border: "4px solid #f5efe6", boxShadow: "0 0 0 2px #c07b3a" }} />
                <div className="tl-content" style={{ maxWidth: 420 }}>
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".75rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#c07b3a", display: "block", marginBottom: 8 }}>{item.year}</span>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", color: "#1a0a02", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: "#5c3a1e", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "100px 0", background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1a0a02" }}>Our Mission<br /><em>& Values</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.num} className="value-card" style={{ padding: "40px 32px", background: "#fff", borderRadius: 8, border: "1px solid rgba(192,123,58,.15)" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", fontWeight: 900, color: "rgba(192,123,58,.15)", lineHeight: 1, marginBottom: 16 }}>{v.num}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#1a0a02", marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: "#5c3a1e", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage({ showToast }) {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast("Message sent! We'll reply within 24 hours.");
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <>
      <PageHero label="Get in Touch" title="Contact <em>Us</em>" subtitle="We'd love to hear from you — visit us or send a message" />
      <section style={{ padding: "100px 0", background: "#faf6f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>Send a Message</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#1a0a02", marginBottom: 16 }}>Let's <em>Connect</em></h2>
              <p style={{ color: "#5c3a1e", marginBottom: 36 }}>Have a question, catering inquiry, or just want to say hello? We'll get back to you within 24 hours.</p>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#1a0a02", marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: "#5c3a1e" }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[{ label: "Full Name", type: "text", placeholder: "Your full name" }, { label: "Email Address", type: "email", placeholder: "you@example.com" }].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} required className="qh-input" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 8 }}>Subject</label>
                    <select className="qh-input" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02" }}>
                      <option value="">Select a subject...</option>
                      <option>General Inquiry</option><option>Catering & Events</option>
                      <option>Franchise Info</option><option>Feedback</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#9b7355", marginBottom: 8 }}>Message</label>
                    <textarea rows={6} placeholder="Tell us how we can help..." required className="qh-input" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(192,123,58,.3)", borderRadius: 6, fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", background: "#fff", color: "#1a0a02", resize: "vertical" }} />
                  </div>
                  <Btn full>Send Message</Btn>
                </form>
              )}
            </div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                {[
                  { icon: "📍", title: "Visit Us", content: "162 Bedford Ave\nBrooklyn, NY 11211" },
                  { icon: "✉️", title: "Email Us", content: "coffee@qahwahhouse.com" },
                  { icon: "📞", title: "Call Us", content: "(313) 555-1234" },
                  { icon: "🕐", title: "Hours", content: "Mon–Thu: 7am–10pm\nFri: 7am–11pm\nSat: 8am–11pm\nSun: 8am–9pm" },
                ].map(card => (
                  <div key={card.title} className="info-card" style={{ padding: "24px 20px", background: "#fff", borderRadius: 8, border: "1px solid rgba(192,123,58,.2)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{card.icon}</div>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#1a0a02", fontSize: "1rem", marginBottom: 6 }}>{card.title}</h4>
                    <p style={{ color: "#5c3a1e", fontSize: ".88rem", whiteSpace: "pre-line", lineHeight: 1.7 }}>{card.content}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(192,123,58,.2)" }}>
                <iframe title="Qahwah House Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.1!2d-73.9573!3d40.7182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25986a73a7f07%3A0x5cc0f8e5b1e4a1b0!2s162%20Bedford%20Ave%2C%20Brooklyn%2C%20NY%2011211!5e0!3m2!1sen!2sus!4v1709850000000!5m2!1sen!2sus"
                  width="100%" height="320" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [drinks, setDrinks] = useState([]);
  const { cart, add, remove, changeQty, total, count, clear } = useCart();
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchMenu("drinks").then(setDrinks).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const handleAdd = (item) => { add(item); };

  const handleCheckout = () => {
    if (cart.length === 0) { showToast("Your cart is empty!"); return; }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header page={page} setPage={setPage} cartCount={count} onCartOpen={() => setCartOpen(true)} />
      <main style={{ flex: 1, paddingTop: page === "home" ? 0 : 72 }}>
        {page === "home" && <HomePage setPage={setPage} onAdd={handleAdd} showToast={showToast} drinks={drinks} />}
        {page === "menu" && <MenuPage onAdd={handleAdd} showToast={showToast} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage showToast={showToast} />}
      </main>
      <Footer setPage={setPage} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} changeQty={changeQty} remove={remove} total={total} onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} total={total} onSuccess={() => { clear(); showToast("Order placed! See you soon ☕"); }} />
      <Toast msg={toast} />
    </div>
  );
}