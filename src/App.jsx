import { useState, useEffect } from "react";
import { login, register, getProducts, placeOrder, getOrders, validateCoupon } from "./api";
import AdminPage from "./pages/AdminPage";
import AddProduct from "./pages/add_product";


const C = {
  bg: "#0A0A0F", surface: "#12121A", card: "#1A1A26", border: "#2A2A3E",
  accent: "#6C63FF", cyan: "#00D4FF", green: "#00E5A0", amber: "#FFB800",
  red: "#FF4D6A", text: "#F0F0FF", textSec: "#8888AA", textMuted: "#55557A",
  accentGlow: "rgba(108,99,255,0.15)",
};
const F = { display: "'Syne', sans-serif", body: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" };

// ─── ELECTRONIC SUBCATEGORIES ────────────────────────────────────────────────
const ELEC_CATS = [
  { id:"phones",    label:"Phones",        icon:"📱", color:"#6C63FF", img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80" },
  { id:"laptops",   label:"Laptops",       icon:"💻", color:"#00D4FF", img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
  { id:"machines",  label:"Machines",      icon:"🖨️", color:"#00E5A0", img:"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80" },
  { id:"mouse",     label:"Mouse & Input", icon:"🖱️", color:"#FFB800", img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id:"printers",  label:"Printers",      icon:"🖨️", color:"#FF6B35", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id:"aircon",    label:"Air Condition",  icon:"❄️", color:"#0EA5E9", img:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80" },
  { id:"other",     label:"Other Devices",  icon:"📺", color:"#9B59B6", img:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80" },
];

const electronics = [
  // ── PHONES ──
  { id:1,  cat:"electronics", subcat:"phones",   name:"Samsung Galaxy S24 Ultra", brand:"Samsung", price:1299, orig:1399, rating:4.9, reviews:2341, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    specs:["200MP camera","Snapdragon 8 Gen 3","12GB RAM","5000mAh battery"], desc:"The pinnacle of Android smartphones with an integrated S-Pen, massive camera array, and AI-powered features for productivity and creativity.", stock:18 },
  { id:2,  cat:"electronics", subcat:"phones",   name:"iPhone 15 Pro Max", brand:"Apple", price:1199, orig:1199, rating:4.8, reviews:5120, badge:"New",
    img:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    specs:["A17 Pro chip","48MP ProRAW","Titanium frame","USB-C 3.0"], desc:"Apple's most powerful iPhone ever, with a titanium body, Action button, and the most advanced camera system in iPhone history.", stock:25 },
  { id:3,  cat:"electronics", subcat:"phones",   name:"Google Pixel 8 Pro", brand:"Google", price:999, orig:1099, rating:4.7, reviews:876, badge:"Sale",
    img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
    specs:["Tensor G3 chip","50MP camera","7yr Android updates","Temperature sensor"], desc:"The smartest phone on the market with Google's own Tensor chip and industry-leading AI photography tools.", stock:14 },
  { id:4,  cat:"electronics", subcat:"phones",   name:"OnePlus 12 Pro", brand:"OnePlus", price:799, orig:899, rating:4.6, reviews:432, badge:null,
    img:"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80",
    specs:["Snapdragon 8 Gen 3","100W fast charge","Hasselblad camera","6.82\" QHD+"], desc:"Flagship performance at a competitive price, with Hasselblad-tuned cameras and the fastest charging on any phone.", stock:20 },

  // ── LAPTOPS ──
  { id:5,  cat:"electronics", subcat:"laptops",  name:"MacBook Pro 16\" M3 Pro", brand:"Apple", price:2499, orig:2999, rating:4.9, reviews:1840, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    specs:["Apple M3 Pro","36GB unified RAM","1TB SSD","22hr battery"], desc:"The ultimate pro laptop — blazing performance, a stunning Liquid Retina XDR display, and all-day battery life in a beautiful aluminum chassis.", stock:12 },
  { id:6,  cat:"electronics", subcat:"laptops",  name:"Dell XPS 15 OLED", brand:"Dell", price:1799, orig:2099, rating:4.7, reviews:654, badge:"Sale",
    img:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80",
    specs:["Intel Core i9-13900H","32GB DDR5","RTX 4060","15.6\" 3.5K OLED"], desc:"A premium Windows laptop with a jaw-dropping OLED display and desktop-class performance for creators and engineers.", stock:8 },
  { id:7,  cat:"electronics", subcat:"laptops",  name:"ASUS ROG Zephyrus G16", brand:"ASUS", price:1999, orig:2299, rating:4.8, reviews:389, badge:"New",
    img:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    specs:["AMD Ryzen 9 7945HX","RTX 4080","32GB RAM","QHD+ 240Hz"], desc:"A powerhouse gaming laptop that doubles as a creative workstation — thin, fast, and built for extreme performance.", stock:6 },
  { id:8,  cat:"electronics", subcat:"laptops",  name:"Lenovo ThinkPad X1 Carbon", brand:"Lenovo", price:1349, orig:1599, rating:4.6, reviews:721, badge:"Sale",
    img:"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    specs:["Intel Core i7-1365U","16GB LPDDR5","512GB SSD","14\" IPS 2.8K"], desc:"The legendary business laptop — ultra-light, military-grade durable, with a best-in-class keyboard and all-day battery.", stock:15 },

  // ── MACHINES ──
  { id:9,  cat:"electronics", subcat:"machines", name:"Apple Mac Studio M2 Ultra", brand:"Apple", price:3999, orig:4499, rating:4.9, reviews:234, badge:"Top Pick",
    img:"https://images.unsplash.com/photo-1655721530791-59b0a593bc5b?w=500&q=80",
    specs:["M2 Ultra chip","192GB unified RAM","4TB SSD","8K display support"], desc:"A desktop powerhouse for video editors, 3D artists, and developers who need workstation performance in a compact form.", stock:5 },
  { id:10, cat:"electronics", subcat:"machines", name:"Dell Precision 7960 Tower", brand:"Dell", price:4999, orig:5999, rating:4.7, reviews:98, badge:"Sale",
    img:"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80",
    specs:["Intel Xeon W9","RTX A6000","256GB ECC RAM","8TB NVMe RAID"], desc:"Enterprise-grade workstation built for CAD, simulation, and AI/ML workloads. Certifiied by leading ISVs.", stock:3 },
  { id:11, cat:"electronics", subcat:"machines", name:"Raspberry Pi 5 Kit", brand:"Raspberry Pi", price:129, orig:149, rating:4.8, reviews:1203, badge:"Popular",
    img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
    specs:["BCM2712 quad-core","8GB LPDDR4X","PCIe 2.0","Dual 4K HDMI"], desc:"The latest and most powerful Raspberry Pi — perfect for hobbyists, educators, and embedded developers.", stock:60 },

  // ── MOUSE & INPUT ──
  { id:12, cat:"electronics", subcat:"mouse",    name:"Logitech MX Master 3S", brand:"Logitech", price:99, orig:129, rating:4.9, reviews:3421, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    specs:["8000 DPI sensor","MagSpeed scroll","7 buttons","70-day battery"], desc:"The world's most advanced productivity mouse with ultra-fast electromagnetic scrolling and whisper-quiet clicks.", stock:40 },
  { id:13, cat:"electronics", subcat:"mouse",    name:"Razer DeathAdder V3 Pro", brand:"Razer", price:149, orig:169, rating:4.8, reviews:987, badge:"New",
    img:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    specs:["Focus Pro 30K sensor","90hr battery","HyperSpeed wireless","58g ultra-light"], desc:"An iconic gaming mouse reinvented — featherlight, ultra-precise, and with best-in-class wireless performance.", stock:22 },
  { id:14, cat:"electronics", subcat:"mouse",    name:"Apple Magic Keyboard + Mouse", brand:"Apple", price:199, orig:228, rating:4.7, reviews:1102, badge:"Sale",
    img:"https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80",
    specs:["Touch ID","Wireless Bluetooth","Scissor mechanism","USB-C charging"], desc:"Apple's premium wireless combo — slim, rechargeable, and perfectly integrated with macOS for effortless productivity.", stock:30 },

  // ── PRINTERS ──
  { id:15, cat:"electronics", subcat:"printers", name:"HP LaserJet Pro M404dn", brand:"HP", price:299, orig:379, rating:4.6, reviews:542, badge:"Sale",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    specs:["40ppm speed","Duplex printing","Ethernet + USB","250-sheet tray"], desc:"A fast, reliable monochrome laser printer for busy offices — sharp text, low cost-per-page, and easy network sharing.", stock:18 },
  { id:16, cat:"electronics", subcat:"printers", name:"Epson EcoTank ET-8550", brand:"Epson", price:699, orig:849, rating:4.8, reviews:317, badge:"Best Value",
    img:"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&q=80",
    specs:["6-color inkjet","A3+ format","Wi-Fi + Ethernet","2yr ink supply"], desc:"Professional photo and document printer with cartridge-free ink tanks — print thousands of pages with ultra-low running costs.", stock:10 },
  { id:17, cat:"electronics", subcat:"printers", name:"Canon PIXMA TR8620a", brand:"Canon", price:179, orig:219, rating:4.5, reviews:889, badge:null,
    img:"https://images.unsplash.com/photo-1600267185393-1b3f91e1a6da?w=500&q=80",
    specs:["All-in-one","Auto duplex","AirPrint + Mopria","5-ink system"], desc:"A versatile all-in-one for home and home office — print, scan, copy, and fax with excellent photo and document quality.", stock:25 },

  // ── AIR CONDITION ──
  { id:18, cat:"electronics", subcat:"aircon",   name:"Daikin FTXB35C Split AC", brand:"Daikin", price:899, orig:1099, rating:4.8, reviews:412, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
    specs:["12000 BTU","Inverter technology","A++ energy rating","Wi-Fi control"], desc:"A whisper-quiet, energy-efficient split air conditioner with smart home integration and fast cooling for rooms up to 35m².", stock:7 },
  { id:19, cat:"electronics", subcat:"aircon",   name:"LG Dual Cool Portable 12K", brand:"LG", price:549, orig:649, rating:4.5, reviews:218, badge:"Sale",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    specs:["12000 BTU","Dual Inverter","No-drain design","Auto cooling"], desc:"A portable air conditioner that needs no permanent installation — move it room to room with its dual-inverter compressor for maximum efficiency.", stock:12 },
  { id:20, cat:"electronics", subcat:"aircon",   name:"Mitsubishi Heavy SRK25ZS-S", brand:"Mitsubishi", price:1199, orig:1399, rating:4.9, reviews:178, badge:"New",
    img:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
    specs:["9000 BTU","-15°C heating","Plasma filter","Ultra-quiet 19dB"], desc:"Premium split AC with ultra-silent operation, a built-in plasma air purifier, and reliable heating down to -15°C.", stock:5 },

  // ── OTHER DEVICES ──
  { id:21, cat:"electronics", subcat:"other",    name:"Sony 65\" OLED Bravia XR", brand:"Sony", price:2299, orig:2799, rating:4.9, reviews:521, badge:"Sale",
    img:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
    specs:["4K 120Hz OLED","Cognitive Processor XR","HDMI 2.1 x4","Dolby Atmos"], desc:"Sony's most lifelike TV — with cognitive intelligence that processes picture and sound the way humans perceive the world.", stock:4 },
  { id:22, cat:"electronics", subcat:"other",    name:"Bose QuietComfort 45", brand:"Bose", price:279, orig:329, rating:4.8, reviews:1870, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    specs:["World-class ANC","24hr battery","Aware Mode","Foldable design"], desc:"The gold standard in noise-cancelling headphones — unmatched quiet, lifelike audio, and all-day comfort.", stock:28 },
  { id:23, cat:"electronics", subcat:"other",    name:"GoPro HERO12 Black", brand:"GoPro", price:399, orig:449, rating:4.7, reviews:643, badge:"New",
    img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80",
    specs:["5.3K60 video","HyperSmooth 6.0","HDR photo","27m waterproof"], desc:"The world's most versatile action camera — shoot incredible footage in any condition, from underwater to mountain peaks.", stock:16 },
];

const services = [
  { id:101, cat:"services", name:"Custom Web Development", brand:"TechMart Dev Studio", price:499, orig:799, rating:4.9, reviews:214, badge:"Popular", img:"🌐", tagline:"Full-stack websites built for performance", duration:"7–14 days", delivery:"Remote", team:"2 developers",
    desc:"We design and build modern, responsive websites and web applications tailored to your business. From landing pages to full e-commerce platforms, we cover it all.",
    includes:["UI/UX Design","Frontend (React/Next.js)","Backend (Node/Django)","Database setup","Deployment & hosting","30-day free support"],
    process:[{step:"Discovery",desc:"We discuss your goals and project scope in a free 30-min call."},{step:"Design",desc:"Wireframes and mockups created for your approval before any coding."},{step:"Development",desc:"Clean, scalable code with regular progress updates throughout."},{step:"Launch",desc:"We deploy, test, and hand over full ownership with documentation."}],
    faqs:[{q:"Do I own the code?",a:"Yes, full source code and ownership is transferred to you on completion."},{q:"Can I request changes after delivery?",a:"Yes, 30 days of free revisions are included after launch."}]
  },
  { id:102, cat:"services", name:"IT Support & Maintenance", brand:"TechMart Support", price:99, orig:149, rating:4.8, reviews:560, badge:"Best Value", img:"🛠️", tagline:"On-demand tech help for individuals & businesses", duration:"Same day", delivery:"Remote / On-site", team:"Certified technician",
    desc:"Fast, reliable IT support for hardware issues, software problems, network setup, and routine system maintenance. Available for individuals and small businesses.",
    includes:["Hardware diagnostics","OS installation & repair","Network configuration","Virus & malware removal","Data backup setup","Monthly health report"],
    process:[{step:"Submit Request",desc:"Describe your issue — we respond within 1 hour."},{step:"Assessment",desc:"A technician reviews and schedules your session."},{step:"Resolution",desc:"We fix the problem remotely or on-site with full walkthrough."},{step:"Follow-up",desc:"We check back 48 hours later to confirm everything runs smoothly."}],
    faqs:[{q:"Is on-site available everywhere?",a:"On-site in major cities; remote support is available worldwide."},{q:"What if the issue isn't resolved?",a:"Full refund if we cannot resolve your issue."}]
  },
  { id:103, cat:"services", name:"Cybersecurity Audit", brand:"TechMart SecureLab", price:349, orig:599, rating:4.9, reviews:98, badge:"Critical", img:"🔐", tagline:"Protect your business from digital threats", duration:"3–5 business days", delivery:"Remote", team:"Security specialist",
    desc:"A comprehensive security audit of your systems, networks, and applications. We identify vulnerabilities before attackers do and deliver a clear remediation roadmap.",
    includes:["Network vulnerability scan","Web app penetration test","Password & access audit","Firewall config review","Detailed risk report","Remediation roadmap"],
    process:[{step:"Scoping",desc:"Define audit boundaries and gather access credentials securely."},{step:"Scanning",desc:"Automated and manual scans across your infrastructure and apps."},{step:"Analysis",desc:"Findings classified and ranked by severity level."},{step:"Report",desc:"Full report delivered with prioritized, actionable items."}],
    faqs:[{q:"Is my data safe during the audit?",a:"All access is under a signed NDA; no data is stored on our systems."},{q:"Do you fix the vulnerabilities too?",a:"Yes, remediation is available as an add-on service."}]
  },
  { id:104, cat:"services", name:"Mobile App Development", brand:"TechMart Dev Studio", price:799, orig:1299, rating:4.8, reviews:134, badge:"New", img:"📲", tagline:"iOS & Android apps that users love", duration:"3–6 weeks", delivery:"Remote", team:"3 developers",
    desc:"Cross-platform mobile apps for iOS and Android using React Native and Flutter. From MVPs to enterprise-grade applications, we deliver scalable mobile solutions.",
    includes:["UX/UI Design","React Native / Flutter","API integration","Push notifications","App Store submission","60-day support"],
    process:[{step:"Strategy",desc:"Map user flows, features, and tech stack to your needs and budget."},{step:"Prototype",desc:"Interactive Figma prototype built for stakeholder sign-off."},{step:"Build",desc:"Agile development with weekly demo calls and sprint reviews."},{step:"Publish",desc:"We handle App Store and Google Play submission and approval."}],
    faqs:[{q:"Which platforms do you support?",a:"iOS, Android, or both simultaneously via cross-platform frameworks."},{q:"Can you work with my existing backend?",a:"Yes, we integrate with any REST or GraphQL API."}]
  },
  { id:105, cat:"services", name:"Cloud Infrastructure Setup", brand:"TechMart CloudOps", price:599, orig:899, rating:4.7, reviews:77, badge:null, img:"☁️", tagline:"Scalable architecture on AWS, GCP or Azure", duration:"5–10 business days", delivery:"Remote", team:"Cloud architect",
    desc:"Design, deploy, and optimize cloud infrastructure for startups and enterprises. Whether migrating or starting fresh, we ensure reliability, security, and cost efficiency.",
    includes:["Architecture design","CI/CD pipeline setup","Container orchestration (K8s)","Auto-scaling config","Cost optimization review","Monitoring & alerting"],
    process:[{step:"Audit",desc:"Review current infrastructure or requirements for a greenfield setup."},{step:"Design",desc:"Architecture diagram and cost estimate presented for approval."},{step:"Deploy",desc:"Infrastructure provisioned using Terraform and IaC best practices."},{step:"Handover",desc:"Full documentation and team training session included."}],
    faqs:[{q:"Which cloud providers do you support?",a:"AWS, GCP, and Azure. Multi-cloud setups available."},{q:"Will you help reduce our cloud bill?",a:"Yes — cost optimization is always included; typical savings of 20–40%."}]
  },
  { id:106, cat:"services", name:"UI/UX Design Sprint", brand:"TechMart Design Co.", price:299, orig:449, rating:4.8, reviews:189, badge:"Sale", img:"🎨", tagline:"Beautiful, user-tested designs in 5 days", duration:"5 days", delivery:"Remote", team:"Senior designer",
    desc:"A focused 5-day sprint delivering a complete UI/UX solution: user research, wireframes, high-fidelity mockups, and a clickable prototype ready for development.",
    includes:["User research & personas","Information architecture","Wireframes (all screens)","High-fidelity mockups","Clickable Figma prototype","Design system handoff"],
    process:[{step:"Understand",desc:"Day 1: User research, competitor analysis, defining the core problem."},{step:"Sketch",desc:"Day 2: Rapid wireframing of all key screens and user flows."},{step:"Design",desc:"Days 3–4: High-fidelity mockups with your brand identity applied."},{step:"Prototype",desc:"Day 5: Interactive Figma prototype delivered with full handoff assets."}],
    faqs:[{q:"Do I get the Figma source files?",a:"Yes, full Figma source files are included in the delivery."},{q:"Can you match our existing brand?",a:"Absolutely — share your brand guide and we align everything to it."}]
  },
];

const allItems = [...electronics, ...services];
const CATS = [{ id:"all", label:"All", icon:"✦" }, { id:"electronics", label:"Electronics", icon:"⚡" }, { id:"services", label:"Tech Services", icon:"🛠️" }];

// ─── ELECTRONICS CATEGORY PAGE ───────────────────────────────────────────────
function ElectronicsPage({ onAddToCart, onView, cart, wishlist=[], onWishlist }) {
  const [subcat, setSubcat] = useState(null); // null = show categories grid
  const [sort, setSort]     = useState("featured");
  const [search, setSearch] = useState("");

  const catInfo = ELEC_CATS.find(c => c.id === subcat);
  let products = electronics.filter(p =>
    (!subcat || p.subcat === subcat) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "price-asc")  products = [...products].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a,b) => b.price - a.price);
  if (sort === "rating")     products = [...products].sort((a,b) => b.rating - a.rating);

  return (
    <div style={{ paddingTop:32, paddingBottom:60, animation:"slideIn 0.35s ease" }}>

      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          {subcat && (
            <button onClick={() => { setSubcat(null); setSearch(""); }} style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.textSec, borderRadius:7, padding:"5px 12px", fontSize:12, cursor:"pointer", fontFamily:F.body }}>
              ← All Categories
            </button>
          )}
        </div>
        <h1 style={{ fontSize:32, fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:6 }}>
          {subcat ? `${catInfo?.icon} ${catInfo?.label}` : "⚡ Electronics"}
        </h1>
        <p style={{ fontSize:14, color:C.textSec }}>
          {subcat ? `${products.length} product${products.length !== 1 ? "s" : ""} in ${catInfo?.label}` : "Browse by category"}
        </p>
      </div>

      {/* ── Category grid (landing) ── */}
      {!subcat && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16, marginBottom:40 }}>
            {ELEC_CATS.map(cat => {
              const count = electronics.filter(p => p.subcat === cat.id).length;
              return (
                <button key={cat.id} onClick={() => setSubcat(cat.id)}
                  style={{ background:"transparent", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>
                  <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}`, transition:"all 0.25s", position:"relative" }}
                    onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${cat.color}`; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 36px rgba(0,0,0,0.4)`; }}
                    onMouseLeave={e => { e.currentTarget.style.border=`1px solid ${C.border}`; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                    {/* Image */}
                    <div style={{ height:140, overflow:"hidden", position:"relative" }}>
                      <img src={cat.img} alt={cat.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display="none"; }} />
                      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, rgba(10,10,15,0.85) 0%, transparent 60%)` }} />
                      <div style={{ position:"absolute", top:10, right:10, background:`${cat.color}22`, border:`1px solid ${cat.color}44`, borderRadius:6, padding:"2px 8px" }}>
                        <span style={{ fontSize:10, color:cat.color, fontFamily:F.mono, fontWeight:700 }}>{count} items</span>
                      </div>
                    </div>
                    {/* Label */}
                    <div style={{ padding:"14px 16px", background:C.card }}>
                      <p style={{ margin:0, fontSize:15, fontWeight:700, fontFamily:F.display, color:C.text }}>{cat.label}</p>
                      <p style={{ margin:"4px 0 0", fontSize:12, color:C.textMuted }}>View all {cat.label.toLowerCase()} →</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* All products below the grid */}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:32, marginBottom:24 }}>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:F.display, color:C.text, marginBottom:4 }}>All Electronics</h2>
            <p style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>{electronics.length} products across all categories</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:18 }}>
              {electronics.map(p => <ElecCard key={p.id} product={p} onAddToCart={onAddToCart} onView={onView} cart={cart} wishlist={wishlist} onWishlist={onWishlist}/>)}
            </div>
          </div>
        </>
      )}

      {/* ── Subcategory products ── */}
      {subcat && (
        <>
          {/* Category hero banner */}
          <div style={{ borderRadius:16, overflow:"hidden", marginBottom:28, position:"relative", height:160 }}>
            <img src={catInfo?.img} alt={catInfo?.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"rgba(10,10,15,0.65)", display:"flex", alignItems:"center", padding:"0 28px" }}>
              <div>
                <p style={{ margin:"0 0 4px", fontSize:11, color:catInfo?.color, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.1em" }}>Electronics · {catInfo?.label}</p>
                <h2 style={{ margin:0, fontSize:28, fontWeight:800, fontFamily:F.display, color:C.text }}>{catInfo?.label}</h2>
              </div>
            </div>
          </div>

          {/* Sub-category chip filter */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            {ELEC_CATS.map(c => (
              <button key={c.id} onClick={() => setSubcat(c.id)}
                style={{ background:subcat===c.id?c.color:"transparent", color:subcat===c.id?"#fff":C.textSec, border:`1px solid ${subcat===c.id?c.color:C.border}`, borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s" }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.textMuted, fontSize:13 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${catInfo?.label}...`} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px 8px 30px", color:C.text, fontSize:13, width:220, fontFamily:F.body, outline:"none" }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:12, color:C.textMuted }}><span style={{ color:catInfo?.color }}>{products.length}</span> results · Sort:</span>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 10px", color:C.text, fontSize:13, cursor:"pointer", outline:"none" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:18 }}>
            {products.length === 0
              ? <p style={{ color:C.textMuted, gridColumn:"1/-1", textAlign:"center", padding:40 }}>No products found.</p>
              : products.map(p => <ElecCard key={p.id} product={p} onAddToCart={onAddToCart} onView={onView} cart={cart} wishlist={wishlist} onWishlist={onWishlist}/>)
            }
          </div>
        </>
      )}
    </div>
  );
}

// ─── ELECTRONICS PRODUCT CARD (with real images) ─────────────────────────────
function ElecCard({ product:p, onAddToCart, onView, cart, wishlist=[], onWishlist }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const id = p._id || p.id; // ✅ FIX: normalize ID once

  const inCart = cart.some(i => i.id === id);
  const inWish = wishlist.some(i => i.id === id);

  const disc = Math.round((1 - p.price / p.origPrice) * 100); // also fix orig → origPrice

  const catColor = ELEC_CATS.find(c => c.id === p.subcat)?.color || C.accent;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onView(p)}
      style={{ background:hov?"#1E1E2E":C.card, border:`1px solid ${hov?catColor:C.border}`, borderRadius:16, cursor:"pointer", transition:"all 0.25s", transform:hov?"translateY(-4px)":"none", boxShadow:hov?`0 12px 40px rgba(0,0,0,0.35)`:"none", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Image */}
      <div style={{ height:180, overflow:"hidden", position:"relative", background:C.surface, flexShrink:0 }}>
        {!imgErr ? (
          <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s", transform:hov?"scale(1.07)":"scale(1)" }} />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:56 }}>
            {ELEC_CATS.find(c=>c.id===p.subcat)?.icon || "📦"}
          </div>
        )}
        <div style={{ position:"absolute", inset:0, background:hov?"rgba(0,0,0,0.1)":"transparent", transition:"background 0.3s" }} />
        <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:6, flexWrap:"wrap" }}>
          {p.badge && <Bdg text={p.badge} />}
        </div>
        {disc > 0 && (
          <div style={{ position:"absolute", top:10, right:10, background:C.red, color:"#fff", fontSize:11, fontWeight:800, padding:"3px 8px", borderRadius:4, fontFamily:F.mono }}>−{disc}%</div>
        )}
        {onWishlist && <button onClick={e=>{e.stopPropagation();onWishlist(p);}} style={{position:"absolute",top:10,right:disc>0?55:10,background:"rgba(0,0,0,0.55)",border:"none",borderRadius:"50%",width:28,height:28,color:inWish?C.red:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>{inWish?"❤️":"🤍"}</button>}
        <div style={{ position:"absolute", bottom:10, left:10, background:`${catColor}22`, border:`1px solid ${catColor}44`, borderRadius:4, padding:"2px 8px" }}>
          <span style={{ fontSize:10, color:catColor, fontFamily:F.mono, fontWeight:600, textTransform:"uppercase" }}>{ELEC_CATS.find(c=>c.id===p.subcat)?.label}</span>
        </div>
      </div>
      {/* Info */}
      <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:8, flex:1 }}>
        <div>
          <p style={{ fontSize:11, color:C.textMuted, fontFamily:F.mono, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>{p.brand}</p>
          <h3 style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:F.display, lineHeight:1.3, margin:0 }}>{p.name}</h3>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {[1,2,3,4,5].map(i=><span key={i} style={{ color:i<=Math.round(p.rating)?C.amber:C.textMuted, fontSize:11 }}>★</span>)}
          <span style={{ fontSize:11, color:C.accent, fontFamily:F.mono, marginLeft:2 }}>{p.rating}</span>
          <span style={{ fontSize:10, color:C.textMuted }}>({p.reviews?.toLocaleString()})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto", paddingTop:4 }}>
          <div>
            <span style={{ fontSize:18, fontWeight:800, color:C.text, fontFamily:F.mono }}>${p.price}</span>
            {p.origPrice > p.price && <span style={{ fontSize:11, color:C.textMuted, textDecoration:"line-through", marginLeft:5 }}>${p.origPrice}</span>}
          </div>
          <button onClick={e => { e.stopPropagation(); onAddToCart(p); }}
            style={{ background:inCart?C.green:catColor, color:inCart?"#000":"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s", flexShrink:0 }}>
            {inCart ? "✓" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Bdg({ text }) {
  const m = { "Best Seller":{bg:C.accent,col:"#fff"}, Popular:{bg:C.accent,col:"#fff"}, "Best Value":{bg:C.green,col:"#000"}, New:{bg:C.cyan,col:"#000"}, Sale:{bg:C.red,col:"#fff"}, Critical:{bg:C.red,col:"#fff"} };
  const s = m[text] || { bg:C.amber, col:"#000" };
  return <span style={{ background:s.bg, color:s.col, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4, letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:F.mono }}>{text}</span>;
}

function Stars({ rating, reviews }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=Math.round(rating)?C.amber:C.textMuted, fontSize:12 }}>★</span>)}
      <span style={{ fontSize:12, color:C.accent, fontFamily:F.mono }}>{rating}</span>
      <span style={{ fontSize:11, color:C.textMuted }}>({reviews?.toLocaleString()})</span>
    </div>
  );
}

function ServiceDetail({ svc, onBack }) {
  const [tab, setTab] = useState("overview");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", date:"", message:"" });
  const [done, setDone] = useState(false);
  const disc = Math.round((1 - svc.price / svc.origPrice) * 100);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));
  const ok = form.name && form.email && form.date;

  return (
    <div style={{ animation:"slideIn 0.35s ease", paddingTop:28, paddingBottom:60 }}>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:`1px solid ${C.border}`, color:C.textSec, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontFamily:F.body, marginBottom:28 }}>← Back to Services</button>

      {/* Hero card */}
      <div style={{ background:`linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,212,255,0.05))`, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 40px", marginBottom:28, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, fontSize:150, opacity:0.05, pointerEvents:"none" }}>{svc.img}</div>
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          {svc.badge && <Bdg text={svc.badge} />}
          <span style={{ background:"rgba(0,229,160,0.12)", color:C.green, fontSize:11, padding:"3px 10px", borderRadius:4, fontFamily:F.mono }}>⏱ {svc.duration}</span>
          <span style={{ background:"rgba(0,212,255,0.1)", color:C.cyan, fontSize:11, padding:"3px 10px", borderRadius:4, fontFamily:F.mono }}>📡 {svc.delivery}</span>
          <span style={{ background:"rgba(108,99,255,0.1)", color:C.accent, fontSize:11, padding:"3px 10px", borderRadius:4, fontFamily:F.mono }}>👥 {svc.team}</span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:24, flexWrap:"wrap" }}>
          <div style={{ fontSize:60 }}>{svc.img}</div>
          <div style={{ flex:1 }}>
            <p style={{ margin:"0 0 4px", fontSize:11, color:C.textMuted, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.1em" }}>{svc.brand}</p>
            <h1 style={{ margin:"0 0 8px", fontSize:28, fontWeight:800, fontFamily:F.display, color:C.text }}>{svc.name}</h1>
            <p style={{ margin:"0 0 10px", fontSize:14, color:C.textSec }}>{svc.tagline}</p>
            <Stars rating={svc.rating} reviews={svc.reviews} />
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:11, color:C.textMuted, marginBottom:4, fontFamily:F.mono }}>Starting from</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.text, fontFamily:F.mono, lineHeight:1 }}>${svc.price}</div>
            {disc>0 && <div style={{ fontSize:12, color:C.textMuted, textDecoration:"line-through", marginTop:3 }}>${svc.orig} <span style={{ color:C.red, textDecoration:"none" }}>−{disc}%</span></div>}
            <button onClick={() => setOpen(true)} style={{ marginTop:14, background:`linear-gradient(135deg,${C.accent},#9B59B6)`, color:"#fff", border:"none", borderRadius:12, padding:"12px 26px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.display, boxShadow:`0 4px 20px ${C.accentGlow}`, whiteSpace:"nowrap" }}>Book Now →</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, borderBottom:`1px solid ${C.border}`, marginBottom:28 }}>
        {[["overview","Overview"],["process","How It Works"],["faqs","FAQs"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background:"transparent", border:"none", borderBottom:`2px solid ${tab===id?C.accent:"transparent"}`, color:tab===id?C.accent:C.textSec, padding:"10px 20px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s", marginBottom:-1 }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:F.display, marginBottom:12, color:C.text }}>About This Service</h2>
            <p style={{ fontSize:14, color:C.textSec, lineHeight:1.8, marginBottom:24 }}>{svc.desc}</p>
            <h3 style={{ fontSize:16, fontWeight:700, fontFamily:F.display, marginBottom:12, color:C.text }}>What's Included</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {svc.includes.map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:C.surface, borderRadius:10, padding:"10px 14px", border:`1px solid ${C.border}` }}>
                  <span style={{ color:C.green, fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13, color:C.text }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:22 }}>
            <h3 style={{ fontSize:16, fontWeight:700, fontFamily:F.display, marginBottom:16, color:C.text }}>Summary</h3>
            {[["Duration",svc.duration],["Delivery",svc.delivery],["Team",svc.team],["Price",`$${svc.price}`],["Support","Included"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.textMuted }}>{k}</span>
                <span style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setOpen(true)} style={{ width:"100%", marginTop:18, background:`linear-gradient(135deg,${C.accent},#9B59B6)`, color:"#fff", border:"none", borderRadius:10, padding:13, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>Book Now →</button>
          </div>
        </div>
      )}

      {tab === "process" && (
        <div style={{ maxWidth:600 }}>
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:F.display, marginBottom:24, color:C.text }}>How It Works</h2>
          {svc.process.map((p,i) => (
            <div key={i} style={{ display:"flex", gap:18, marginBottom:20 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},#9B59B6)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, fontFamily:F.mono, flexShrink:0 }}>{i+1}</div>
                {i<svc.process.length-1 && <div style={{ width:2, flex:1, background:C.border, marginTop:6 }} />}
              </div>
              <div style={{ paddingBottom:12 }}>
                <h3 style={{ margin:"6px 0 5px", fontSize:15, fontWeight:700, fontFamily:F.display, color:C.text }}>{p.step}</h3>
                <p style={{ margin:0, fontSize:13, color:C.textSec, lineHeight:1.7 }}>{p.desc}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setOpen(true)} style={{ marginTop:8, background:`linear-gradient(135deg,${C.accent},#9B59B6)`, color:"#fff", border:"none", borderRadius:10, padding:"12px 26px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>Book This Service →</button>
        </div>
      )}

      {tab === "faqs" && (
        <div style={{ maxWidth:600 }}>
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:F.display, marginBottom:22, color:C.text }}>Frequently Asked Questions</h2>
          {svc.faqs.map((f,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:12 }}>
              <p style={{ margin:"0 0 8px", fontSize:15, fontWeight:700, color:C.text, fontFamily:F.display }}>Q: {f.q}</p>
              <p style={{ margin:0, fontSize:13, color:C.textSec, lineHeight:1.7 }}>A: {f.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {open && (
        <>
          <div onClick={() => { setOpen(false); setDone(false); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", zIndex:200, backdropFilter:"blur(6px)" }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:32, zIndex:201, width:"min(480px,92vw)", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,0.7)" }}>
            {done ? (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:60, marginBottom:14 }}>✅</div>
                <h2 style={{ fontSize:22, fontFamily:F.display, color:C.text, marginBottom:8 }}>Booking Confirmed!</h2>
                <p style={{ color:C.textSec, fontSize:14, lineHeight:1.7 }}>Thank you, <strong style={{ color:C.text }}>{form.name}</strong>! We've received your request for <strong style={{ color:C.accent }}>{svc.name}</strong>. Our team will contact you at <strong style={{ color:C.text }}>{form.email}</strong> within 1 business hour.</p>
                <button onClick={() => { setOpen(false); setDone(false); }} style={{ marginTop:22, background:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"11px 26px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                  <div>
                    <h2 style={{ margin:0, fontSize:19, fontFamily:F.display, color:C.text }}>Book Service</h2>
                    <p style={{ margin:"3px 0 0", fontSize:12, color:C.textMuted }}>{svc.name}</p>
                  </div>
                  <button onClick={() => setOpen(false)} style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.textSec, cursor:"pointer", borderRadius:8, width:32, height:32, fontSize:16 }}>✕</button>
                </div>
                {[{l:"Full Name *",k:"name",t:"text",ph:"John Doe"},{l:"Email Address *",k:"email",t:"email",ph:"john@example.com"},{l:"Phone Number",k:"phone",t:"tel",ph:"+1 234 567 8900"},{l:"Preferred Start Date *",k:"date",t:"date",ph:""}].map(f => (
                  <div key={f.k} style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, color:C.textMuted, marginBottom:5, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.l}</label>
                    <input type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e => set(f.k, e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 13px", color:C.text, fontSize:14, fontFamily:F.body, outline:"none" }} />
                  </div>
                ))}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:"block", fontSize:11, color:C.textMuted, marginBottom:5, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" }}>Project Details</label>
                  <textarea rows={3} placeholder="Tell us about your project or what you need..." value={form.message} onChange={e => set("message",e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 13px", color:C.text, fontSize:14, fontFamily:F.body, outline:"none", resize:"vertical" }} />
                </div>
                <div style={{ background:C.surface, borderRadius:10, padding:"11px 14px", marginBottom:18, display:"flex", justifyContent:"space-between", border:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13, color:C.textSec }}>Service Total</span>
                  <span style={{ fontSize:16, fontWeight:800, color:C.text, fontFamily:F.mono }}>${svc.price}</span>
                </div>
                <button onClick={() => ok && setDone(true)} style={{ width:"100%", background:ok?`linear-gradient(135deg,${C.accent},#9B59B6)`:C.border, color:ok?"#fff":C.textMuted, border:"none", borderRadius:12, padding:14, fontSize:15, fontWeight:700, cursor:ok?"pointer":"not-allowed", fontFamily:F.display, transition:"all 0.2s" }}>Confirm Booking</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard({ product:p, onAddToCart, onView, cart }) {
  const [hov, setHov] = useState(false);
  const inCart = cart.some(i => i.id === p.id);
  const disc = Math.round((1 - p.price / p.orig) * 100);
  const isSvc = p.cat === "services";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onView(p)}
      style={{ background:hov?"#1E1E2E":C.card, border:`1px solid ${hov?C.accent:C.border}`, borderRadius:16, padding:20, cursor:"pointer", transition:"all 0.25s", transform:hov?"translateY(-4px)":"none", boxShadow:hov?`0 12px 40px ${C.accentGlow}`:"none", display:"flex", flexDirection:"column", gap:12, position:"relative", overflow:"hidden" }}>
      {hov && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%,${C.accentGlow},transparent 70%)`, pointerEvents:"none" }} />}
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        {p.badge ? <Bdg text={p.badge} /> : <span />}
        {disc>0 && <span style={{ background:"rgba(255,77,106,0.15)", color:C.red, fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:4, fontFamily:F.mono }}>−{disc}%</span>}
      </div>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:80, fontSize:52 }}>{p.img}</div>
      <div>
        <p style={{ fontSize:11, color:C.textMuted, fontFamily:F.mono, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>{p.brand}</p>
        <h3 style={{ fontSize:15, fontWeight:600, color:C.text, fontFamily:F.display, lineHeight:1.3, margin:0 }}>{p.name}</h3>
        {isSvc && <p style={{ fontSize:12, color:C.textSec, marginTop:4, marginBottom:0 }}>{p.tagline}</p>}
      </div>
      {isSvc && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, background:"rgba(0,229,160,0.1)", color:C.green, padding:"2px 8px", borderRadius:4, fontFamily:F.mono }}>⏱ {p.duration}</span>
          <span style={{ fontSize:11, background:"rgba(0,212,255,0.1)", color:C.cyan, padding:"2px 8px", borderRadius:4, fontFamily:F.mono }}>📡 {p.delivery}</span>
        </div>
      )}
      <Stars rating={p.rating} reviews={p.reviews} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto" }}>
        <div>
          <span style={{ fontSize:20, fontWeight:700, color:C.text, fontFamily:F.mono }}>${p.price}</span>
          {p.orig>p.price && <span style={{ fontSize:12, color:C.textMuted, textDecoration:"line-through", marginLeft:6 }}>${p.orig}</span>}
        </div>
        <button onClick={e => { e.stopPropagation(); isSvc ? onView(p) : onAddToCart(p); }}
          style={{ background:isSvc?"transparent":inCart?C.green:C.accent, color:isSvc?C.accent:inCart?"#000":"#fff", border:isSvc?`1px solid ${C.accent}`:"none", borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s" }}>
          {isSvc ? "Book Now →" : inCart ? "✓ Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function CartDrawer({ open, cart, onClose, onRemove, onQty, onClearCart }) {
  const [step, setStep] = useState("cart"); // cart | shipping | payment | confirm | success
  const [payMethod, setPayMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [shipping, setShipping] = useState({ name:"", address:"", city:"", country:"", zip:"", email:"" });
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [momo, setMomo] = useState({ provider:"MTN", phone:"", name:"" });
  const [paypal, setPaypal] = useState({ email:"" });

  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const COUPONS = { BUNDLE10: 0.10, SAVE10: 0.10, NEWUSER: 20 };
  const discountAmt = couponApplied
    ? (typeof COUPONS[couponApplied] === "number" && COUPONS[couponApplied] < 1
        ? subtotal * COUPONS[couponApplied]
        : COUPONS[couponApplied] || 0)
    : 0;
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discountAmt + shippingFee;

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (COUPONS[code] !== undefined) { setCouponApplied(code); }
    else { setCouponApplied("INVALID"); }
  };

  const setShip = (k,v) => setShipping(p=>({...p,[k]:v}));
  const setCardF = (k,v) => setCard(p=>({...p,[k]:v}));
  const setMomoF = (k,v) => setMomo(p=>({...p,[k]:v}));

  const shipOk = shipping.name && shipping.address && shipping.city && shipping.country && shipping.email;
  const payOk = payMethod === "card"
    ? card.number.replace(/\s/g,"").length===16 && card.name && card.expiry && card.cvv.length>=3
    : payMethod === "momo"
    ? momo.phone.length>=9 && momo.name
    : payMethod === "paypal"
    ? paypal.email.includes("@")
    : true;

  const handleClose = () => { onClose(); setTimeout(() => setStep("cart"), 400); };
  const handleSuccess = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await placeOrder({
        items: cart.map(i => ({ productId: i.id, qty: i.qty })),
        shipping,
        paymentMethod,
        couponCode: couponApplied !== "INVALID" ? couponApplied : null,
      });
    }
    setStep("success");
  } catch (err) {
    setStep("success"); // still show success on frontend even if API fails
  }
};
  const handleDone = () => { onClearCart(); handleClose(); setStep("cart"); setCoupon(""); setCouponApplied(null); setCard({ number:"",name:"",expiry:"",cvv:"" }); setMomo({ provider:"MTN",phone:"",name:"" }); setPaypal({ email:"" }); setShipping({ name:"",address:"",city:"",country:"",zip:"",email:"" }); };

  const STEPS = ["cart","shipping","payment","confirm"];
  const stepIdx = STEPS.indexOf(step);

  const inputStyle = { width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 13px", color:C.text, fontSize:13, fontFamily:F.body, outline:"none" };
  const labelStyle = { display:"block", fontSize:11, color:C.textMuted, marginBottom:5, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" };

  const PAYMENT_METHODS = [
    { id:"card", label:"Credit / Debit Card", icon:"💳", desc:"Visa, Mastercard, Amex" },
    { id:"momo", label:"Mobile Money", icon:"📱", desc:"MTN, Airtel, Orange Money" },
    { id:"paypal", label:"PayPal", icon:"🅿️", desc:"Pay via PayPal account" },
    { id:"bank", label:"Bank Transfer", icon:"🏦", desc:"Direct bank transfer" },
    { id:"crypto", label:"Crypto", icon:"₿", desc:"Bitcoin, Ethereum, USDT" },
  ];

  const handlePayment = async () => {
    console.log("CART =", cart);
  try {
    const res = await fetch("https://techmart-hngi.onrender.com/api/payment", {
      method: "POST",
     headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
      body: JSON.stringify({
        paymentMethod: payMethod,
        name: shipping.name,
        email: shipping.email,
        amount: total,
        phone: momo.phone,

        // ✅ IMPORTANT: send full product structure
  items: cart.map(i => ({
  productId: i._id ,  // ✅ FIXED
  name: i.name,
  qty: i.qty,
  price: i.price,
}))
      }),
    });

    const data = await res.json();
    console.log(data);

    if (data.success) {
      setStep("success");
    }
  } catch (err) {
    console.error(err);
  }
};

   
const handleOrder = async () => {
  if (!payOk) return;

  try {
    const res = await fetch("https://techmart-hngi.onrender.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // IMPORTANT for your middleware
      },
      body: JSON.stringify({
        items: cart.map(item => ({
          productId: item.id,
          qty: item.qty,
        })),
        shipping,
        paymentMethod: payMethod,
        couponCode: coupon || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Order failed:", data);
      return;
    }

    console.log("ORDER SAVED:", data);

    // clear cart
    setCart([]);

    // success screen
    setStep("success");

  } catch (err) {
    console.error("Order error:", err);
  }
};
  return (
    <>
      {open && <div onClick={handleClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:90, backdropFilter:"blur(5px)" }} />}
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:420, background:C.surface, borderLeft:`1px solid ${C.border}`, transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)", zIndex:100, display:"flex", flexDirection:"column", boxShadow:"-20px 0 60px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {step !== "cart" && step !== "success" && (
              <button onClick={() => setStep(STEPS[stepIdx-1])} style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.textSec, cursor:"pointer", borderRadius:7, width:28, height:28, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
            )}
            <div>
              <h2 style={{ margin:0, fontSize:17, fontFamily:F.display, color:C.text }}>
                {step==="cart"?"Shopping Cart":step==="shipping"?"Shipping Info":step==="payment"?"Payment":step==="confirm"?"Review Order":"Order Placed!"}
              </h2>
              {step!=="success" && <p style={{ margin:0, fontSize:11, color:C.textMuted, fontFamily:F.mono }}>{cart.length} item{cart.length!==1?"s":""} · ${total.toFixed(2)}</p>}
            </div>
          </div>
          <button onClick={handleClose} style={{ background:"transparent", border:"none", color:C.textSec, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        {/* Step progress bar (not on success) */}
        {step !== "success" && (
          <div style={{ display:"flex", padding:"12px 22px", gap:6, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            {["Cart","Shipping","Payment","Review"].map((s,i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:done?C.green:active?C.accent:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:done||active?"#fff":C.textMuted, fontFamily:F.mono, transition:"all 0.3s" }}>
                      {done ? "✓" : i+1}
                    </div>
                    <span style={{ fontSize:10, color:active?C.accent:done?C.green:C.textMuted, marginTop:3, fontFamily:F.mono, fontWeight:active?700:400 }}>{s}</span>
                  </div>
                  {i<3 && <div style={{ height:1, width:16, background:done?C.green:C.border, marginBottom:14, transition:"background 0.3s" }} />}
                </div>
              );
            })}
          </div>
        )}

        {/* ── STEP: CART ── */}
        {step==="cart" && (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"14px 22px", display:"flex", flexDirection:"column", gap:10 }}>
              {cart.length===0 ? (
                <div style={{ textAlign:"center", paddingTop:60 }}>
                  <div style={{ fontSize:46, marginBottom:14 }}>🛒</div>
                  <p style={{ color:C.textMuted }}>Your cart is empty</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{ background:C.card, borderRadius:12, padding:13, border:`1px solid ${C.border}`, display:"flex", gap:11, alignItems:"center" }}>
                  <div style={{ fontSize:28 }}>{item.img}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.text, fontFamily:F.display }}>{item.name}</p>
                    <p style={{ margin:"2px 0 7px", fontSize:11, color:C.textMuted }}>{item.brand}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:3, background:C.surface, borderRadius:6, padding:"2px 4px", border:`1px solid ${C.border}` }}>
                        <button onClick={() => onQty(item.id,item.qty-1)} style={{ background:"transparent", border:"none", color:C.textSec, cursor:"pointer", width:20, height:20, fontSize:14 }}>−</button>
                        <span style={{ fontSize:12, fontFamily:F.mono, color:C.text, minWidth:16, textAlign:"center" }}>{item.qty}</span>
                        <button onClick={() => onQty(item.id,item.qty+1)} style={{ background:"transparent", border:"none", color:C.textSec, cursor:"pointer", width:20, height:20, fontSize:14 }}>+</button>
                      </div>
                      <span style={{ fontSize:14, fontWeight:700, color:C.accent, fontFamily:F.mono }}>${(item.price*item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} style={{ background:"transparent", border:"none", color:C.red, cursor:"pointer", fontSize:15, opacity:0.7 }}>✕</button>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
                {/* Coupon */}
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" style={{ ...inputStyle, flex:1 }} />
                  <button onClick={applyCoupon} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"0 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F.body, flexShrink:0 }}>Apply</button>
                </div>
                {couponApplied === "INVALID" && <p style={{ fontSize:12, color:C.red, marginBottom:10, fontFamily:F.mono }}>✕ Invalid coupon code</p>}
                {couponApplied && couponApplied !== "INVALID" && <p style={{ fontSize:12, color:C.green, marginBottom:10, fontFamily:F.mono }}>✓ Coupon {couponApplied} applied!</p>}
                {/* Totals */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, color:C.textSec }}>Subtotal</span>
                  <span style={{ fontSize:13, color:C.text, fontFamily:F.mono }}>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmt > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:C.green }}>Discount</span>
                    <span style={{ fontSize:13, color:C.green, fontFamily:F.mono }}>−${discountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{ fontSize:13, color:C.textSec }}>Shipping</span>
                  <span style={{ fontSize:13, color:shippingFee===0?C.green:C.text, fontFamily:F.mono }}>{shippingFee===0?"FREE":`$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Total</span>
                  <span style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:F.mono }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={() => setStep("shipping")} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},#9B59B6)`, color:"#fff", border:"none", borderRadius:10, padding:13, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:F.display, boxShadow:`0 4px 18px ${C.accentGlow}` }}>
                  Continue to Shipping →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: SHIPPING ── */}
        {step==="shipping" && (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", display:"flex", flexDirection:"column", gap:13 }}>
              <h3 style={{ margin:0, fontSize:15, fontFamily:F.display, color:C.text }}>Delivery Information</h3>
              {[
                {l:"Full Name *",k:"name",t:"text",ph:"John Doe"},
                {l:"Email Address *",k:"email",t:"email",ph:"john@example.com"},
                {l:"Street Address *",k:"address",t:"text",ph:"123 Main Street"},
                {l:"City *",k:"city",t:"text",ph:"Kigali"},
                {l:"Country *",k:"country",t:"text",ph:"Rwanda"},
                {l:"ZIP / Postal Code",k:"zip",t:"text",ph:"00100"},
              ].map(f => (
                <div key={f.k}>
                  <label style={labelStyle}>{f.l}</label>
                  <input type={f.t} placeholder={f.ph} value={shipping[f.k]} onChange={e=>setShip(f.k,e.target.value)} style={inputStyle} />
                </div>
              ))}
              <div style={{ background:C.card, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}` }}>
                <p style={{ margin:0, fontSize:12, color:C.textSec }}>🚚 <strong style={{ color:C.green }}>Free shipping</strong> on orders over $100. Estimated delivery: 3–7 business days.</p>
              </div>
            </div>
            <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
              <button onClick={() => shipOk && setStep("payment")} style={{ width:"100%", background:shipOk?`linear-gradient(135deg,${C.accent},#9B59B6)`:C.border, color:shipOk?"#fff":C.textMuted, border:"none", borderRadius:10, padding:13, fontSize:15, fontWeight:700, cursor:shipOk?"pointer":"not-allowed", fontFamily:F.display, transition:"all 0.2s" }}>
                Continue to Payment →
              </button>
            </div>
          </>
        )}

        {/* ── STEP: PAYMENT ── */}
        {step==="payment" && (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", display:"flex", flexDirection:"column", gap:14 }}>
              <h3 style={{ margin:0, fontSize:15, fontFamily:F.display, color:C.text }}>Choose Payment Method</h3>

              {/* Method selector */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} style={{ display:"flex", alignItems:"center", gap:13, padding:"12px 14px", background:payMethod===m.id?"rgba(108,99,255,0.1)":C.card, border:`1.5px solid ${payMethod===m.id?C.accent:C.border}`, borderRadius:11, cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                    <span style={{ fontSize:22, width:30, textAlign:"center" }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:payMethod===m.id?C.accent:C.text, fontFamily:F.display }}>{m.label}</p>
                      <p style={{ margin:0, fontSize:11, color:C.textMuted }}>{m.desc}</p>
                    </div>
                    <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${payMethod===m.id?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {payMethod===m.id && <div style={{ width:8, height:8, borderRadius:"50%", background:C.accent }} />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Card fields */}
              {payMethod==="card" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12, background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                  <div>
                    <label style={labelStyle}>Card Number</label>
                    <input maxLength={19} placeholder="1234 5678 9012 3456" value={card.number} onChange={e => { let v=e.target.value.replace(/\D/g,"").slice(0,16); v=v.replace(/(.{4})/g,"$1 ").trim(); setCardF("number",v); }} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Cardholder Name</label>
                    <input placeholder="John Doe" value={card.name} onChange={e=>setCardF("name",e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div>
                      <label style={labelStyle}>Expiry (MM/YY)</label>
                      <input maxLength={5} placeholder="MM/YY" value={card.expiry} onChange={e => { let v=e.target.value.replace(/\D/g,""); if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2,4); setCardF("expiry",v); }} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <input maxLength={4} placeholder="•••" type="password" value={card.cvv} onChange={e=>setCardF("cvv",e.target.value.replace(/\D/g,"").slice(0,4))} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", background:C.surface, borderRadius:8, padding:"8px 12px" }}>
                    <span style={{ fontSize:14 }}>🔒</span>
                    <span style={{ fontSize:11, color:C.textMuted }}>Your card info is encrypted with 256-bit SSL</span>
                  </div>
                </div>
              )}

              {/* Mobile Money fields */}
              {payMethod==="momo" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12, background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                  <div>
                    <label style={labelStyle}>Provider</label>
                    <div style={{ display:"flex", gap:8 }}>
                      {["MTN","Airtel","Orange"].map(p => (
                        <button key={p} onClick={() => setMomoF("provider",p)} style={{ flex:1, padding:"9px 6px", background:momo.provider===p?C.accent:"transparent", border:`1px solid ${momo.provider===p?C.accent:C.border}`, borderRadius:8, color:momo.provider===p?"#fff":C.textSec, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s" }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Mobile Number</label>
                    <input placeholder="+250 7XX XXX XXX" value={momo.phone} onChange={e=>setMomoF("phone",e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Account Name</label>
                    <input placeholder="Registered name" value={momo.name} onChange={e=>setMomoF("name",e.target.value)} style={inputStyle} />
                  </div>
                  <p style={{ margin:0, fontSize:12, color:C.textMuted, background:C.surface, borderRadius:8, padding:"8px 12px" }}>📲 You will receive a push notification on your phone to confirm the payment.</p>
                </div>
              )}

              {/* PayPal */}
              {payMethod==="paypal" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12, background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                  <div>
                    <label style={labelStyle}>PayPal Email</label>
                    <input type="email" placeholder="you@paypal.com" value={paypal.email} onChange={e=>setPaypal({email:e.target.value})} style={inputStyle} />
                  </div>
                  <p style={{ margin:0, fontSize:12, color:C.textMuted, background:C.surface, borderRadius:8, padding:"8px 12px" }}>🅿️ You'll be redirected to PayPal to complete the payment securely.</p>
                </div>
              )}

              {/* Bank Transfer */}
              {payMethod==="bank" && (
                <div style={{ background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:8 }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text, fontFamily:F.display }}>Bank Details</p>
                  {[["Bank","Equity Bank Rwanda"],["Account Name","TechMart Ltd"],["Account No","100-200-300-4"],["SWIFT","EQBLRWRW"]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:12, color:C.textMuted }}>{k}</span>
                      <span style={{ fontSize:12, color:C.text, fontWeight:600, fontFamily:F.mono }}>{v}</span>
                    </div>
                  ))}
                  <p style={{ margin:"4px 0 0", fontSize:12, color:C.amber }}>⚠ Orders are processed after payment confirmation (1–2 business days).</p>
                </div>
              )}

              {/* Crypto */}
              {payMethod==="crypto" && (
                <div style={{ background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:10 }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text, fontFamily:F.display }}>Crypto Wallet Address</p>
                  {[["BTC","bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"],["ETH","0x742d35Cc6634C0532925a3b8D4C9E1234AB5678"],["USDT (TRC20)","TQn9Y2khEsLJW1ChVWFMSMeRDow5SZNZP"]].map(([coin,addr]) => (
                    <div key={coin} style={{ padding:"8px 10px", background:C.surface, borderRadius:8, border:`1px solid ${C.border}` }}>
                      <p style={{ margin:"0 0 3px", fontSize:11, color:C.accent, fontFamily:F.mono, fontWeight:700 }}>{coin}</p>
                      <p style={{ margin:0, fontSize:10, color:C.textMuted, fontFamily:F.mono, wordBreak:"break-all" }}>{addr}</p>
                    </div>
                  ))}
                  <p style={{ margin:0, fontSize:12, color:C.amber }}>⚠ Send exact amount. Orders confirmed after 1 network confirmation.</p>
                </div>
              )}
            </div>
            <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
              <button onClick={() => payOk && setStep("confirm")} style={{ width:"100%", background:payOk?`linear-gradient(135deg,${C.accent},#9B59B6)`:C.border, color:payOk?"#fff":C.textMuted, border:"none", borderRadius:10, padding:13, fontSize:15, fontWeight:700, cursor:payOk?"pointer":"not-allowed", fontFamily:F.display, transition:"all 0.2s" }}>
                Review Order →
              </button>
            </div>
          </>
        )}

        {/* ── STEP: CONFIRM ── */}
        {step==="confirm" && (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", display:"flex", flexDirection:"column", gap:14 }}>
              <h3 style={{ margin:0, fontSize:15, fontFamily:F.display, color:C.text }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:24 }}>{item.img}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.text }}>{item.name}</p>
                    <p style={{ margin:0, fontSize:11, color:C.textMuted }}>Qty: {item.qty}</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:F.mono }}>${(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ background:C.card, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
                <p style={{ margin:"0 0 10px", fontSize:12, fontWeight:700, color:C.text, fontFamily:F.display }}>📍 Shipping To</p>
                <p style={{ margin:0, fontSize:12, color:C.textSec, lineHeight:1.7 }}>{shipping.name}<br/>{shipping.address}, {shipping.city}<br/>{shipping.country} {shipping.zip}<br/>{shipping.email}</p>
              </div>

              <div style={{ background:C.card, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
                <p style={{ margin:"0 0 10px", fontSize:12, fontWeight:700, color:C.text, fontFamily:F.display }}>💳 Payment Method</p>
                <p style={{ margin:0, fontSize:13, color:C.textSec }}>{PAYMENT_METHODS.find(m=>m.id===payMethod)?.icon} {PAYMENT_METHODS.find(m=>m.id===payMethod)?.label}</p>
                {payMethod==="card" && card.number && <p style={{ margin:"4px 0 0", fontSize:12, color:C.textMuted, fontFamily:F.mono }}>•••• •••• •••• {card.number.replace(/\s/g,"").slice(-4)}</p>}
                {payMethod==="momo" && <p style={{ margin:"4px 0 0", fontSize:12, color:C.textMuted, fontFamily:F.mono }}>{momo.provider} · {momo.phone}</p>}
              </div>

              <div style={{ background:C.surface, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
                {[["Subtotal",`$${subtotal.toFixed(2)}`],discountAmt>0?["Discount",`−$${discountAmt.toFixed(2)}`]:null,["Shipping",shippingFee===0?"FREE":`$${shippingFee.toFixed(2)}`]].filter(Boolean).map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                    <span style={{ fontSize:13, color:C.textSec }}>{k}</span>
                    <span style={{ fontSize:13, color:k==="Discount"?C.green:C.text, fontFamily:F.mono }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${C.border}`, marginTop:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Total</span>
                  <span style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:F.mono }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
              <button onClick={handlePayment} style={{ width:"100%", background:`linear-gradient(135deg,${C.green},#00B080)`, color:"#000", border:"none", borderRadius:10, padding:14, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:F.display, boxShadow:"0 4px 20px rgba(0,229,160,0.25)" }}>
                ✓ Place Order · ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step==="success" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(0,229,160,0.12)", border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, marginBottom:20 }}>✅</div>
            <h2 style={{ fontSize:22, fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:8 }}>Order Confirmed!</h2>
            <p style={{ fontSize:14, color:C.textSec, lineHeight:1.7, maxWidth:300, marginBottom:6 }}>
              Thank you, <strong style={{ color:C.text }}>{shipping.name}</strong>! Your order of <strong style={{ color:C.accent }}>${total.toFixed(2)}</strong> has been placed.
            </p>
            <p style={{ fontSize:13, color:C.textMuted, marginBottom:28 }}>A confirmation email will be sent to <strong style={{ color:C.text }}>{shipping.email}</strong>.</p>
            <div style={{ background:C.card, borderRadius:12, padding:16, border:`1px solid ${C.border}`, width:"100%", marginBottom:22 }}>
              {[["Order ID",`#TM-${Math.floor(Math.random()*900000+100000)}`],["Payment",PAYMENT_METHODS.find(m=>m.id===payMethod)?.label],["Delivery","3–7 business days"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>{k}</span>
                  <span style={{ fontSize:12, color:C.text, fontWeight:600, fontFamily:F.mono }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={handleDone} style={{ width:"100%", background:C.accent, color:"#fff", border:"none", borderRadius:10, padding:13, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}

function ElecModal({ p, onClose, onAdd, cart, wishlist=[], onWishlist }) {
  const [imgErr, setImgErr] = useState(false);
  const inCart = cart.some(i => i.id === p.id);
  const inWish = wishlist.some(i => i.id === p.id);
  const disc = Math.round((1 - p.price / p.orig) * 100);
  const catColor = ELEC_CATS.find(c => c.id === p.subcat)?.color || C.accent;
  const catLabel = ELEC_CATS.find(c => c.id === p.subcat)?.label || "Electronics";
  const catIcon  = ELEC_CATS.find(c => c.id === p.subcat)?.icon  || "📦";
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:200, backdropFilter:"blur(8px)" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:C.card, border:`1px solid ${C.border}`, borderRadius:22, zIndex:201, width:"min(640px,95vw)", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,0.8)", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* ── Hero image banner ── */}
        <div style={{ position:"relative", height:240, flexShrink:0, background:C.surface }}>
          {!imgErr ? (
            <img src={p.img} alt={p.name} onError={() => setImgErr(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          ) : (
            <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:80 }}>{catIcon}</div>
          )}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(26,26,38,1) 0%, rgba(26,26,38,0.3) 50%, transparent 100%)" }} />
          {/* Close */}
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.5)", border:`1px solid rgba(255,255,255,0.15)`, color:"#fff", cursor:"pointer", borderRadius:8, width:34, height:34, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>✕</button>
          {/* Badges */}
          <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:6 }}>
            {p.badge && <Bdg text={p.badge} />}
            {disc>0 && <span style={{ background:C.red, color:"#fff", fontSize:11, fontWeight:800, padding:"3px 8px", borderRadius:4, fontFamily:F.mono }}>−{disc}%</span>}
          </div>
          {/* Category chip bottom-left */}
          <div style={{ position:"absolute", bottom:14, left:14, background:`${catColor}22`, border:`1px solid ${catColor}55`, borderRadius:6, padding:"3px 10px" }}>
            <span style={{ fontSize:11, color:catColor, fontFamily:F.mono, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{catIcon} {catLabel}</span>
          </div>
          {/* Stock bottom-right */}
          <div style={{ position:"absolute", bottom:14, right:14 }}>
            <span style={{ fontSize:11, color:p.stock>10?C.green:p.stock>0?C.amber:C.red, background:"rgba(0,0,0,0.5)", padding:"3px 9px", borderRadius:6, fontFamily:F.mono, backdropFilter:"blur(4px)" }}>
              {p.stock>10?"● In Stock":p.stock>0?`● ${p.stock} left`:"● Out of Stock"}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding:"22px 26px 26px", overflowY:"auto" }}>
          <p style={{ fontSize:11, color:C.textMuted, fontFamily:F.mono, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.1em" }}>{p.brand}</p>
          <h2 style={{ fontSize:24, fontWeight:800, color:C.text, fontFamily:F.display, margin:"0 0 10px", lineHeight:1.2 }}>{p.name}</h2>
          <Stars rating={p.rating} reviews={p.reviews} />

          <p style={{ fontSize:14, color:C.textSec, lineHeight:1.8, margin:"16px 0" }}>{p.desc}</p>

          {/* Specs grid */}
          <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:20, border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:11, color:C.textMuted, fontFamily:F.mono, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>Key Specifications</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {p.specs.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:C.card, borderRadius:8, padding:"8px 12px" }}>
                  <span style={{ color:catColor, fontSize:12, flexShrink:0 }}>◆</span>
                  <span style={{ fontSize:13, color:C.text }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <span style={{ fontSize:30, fontWeight:900, color:C.text, fontFamily:F.mono }}>${p.price}</span>
              {p.orig>p.price && (
                <>
                  <span style={{ fontSize:15, color:C.textMuted, textDecoration:"line-through", marginLeft:10 }}>${p.orig}</span>
                  <span style={{ fontSize:13, color:C.green, marginLeft:8, fontWeight:600 }}>Save ${p.orig-p.price}</span>
                </>
              )}
            </div>
            <button onClick={() => { onAdd(p); onClose(); }}
              style={{ background:inCart?C.green:`linear-gradient(135deg,${catColor},${C.accent})`, color:inCart?"#000":"#fff", border:"none", borderRadius:12, padding:"13px 28px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:F.display, boxShadow:`0 4px 20px ${catColor}33`, transition:"all 0.2s" }}>
              {inCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            {onWishlist && <button onClick={()=>onWishlist(p)} style={{background:inWish?"rgba(255,77,106,0.15)":C.surface,color:inWish?C.red:C.textSec,border:`1px solid ${inWish?C.red:C.border}`,borderRadius:12,padding:"13px 16px",fontSize:18,cursor:"pointer"}}>{inWish?"❤️":"🤍"}</button>}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── AUTH PAGE (Login + Register) ────────────────────────────────────────────
function AuthPage({ onAuth, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [err, setErr] = useState("");

  const set = (k,v) => setForm(p => ({ ...p, [k]: v }));

  // ✅ PUT THIS FIRST
  const handleAuth = async (data) => {
    try {
      const url = data.isLogin
        ? "https://techmart-hngi.onrender.com/api/auth/login"
        : "https://techmart-hngi.onrender.com/api/auth/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await res.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.log("NOT JSON RESPONSE:", text);
        throw new Error("Server returned HTML instead of JSON");
      }

      if (!res.ok) {
        throw new Error(result.error || "Auth failed");
      }

      console.log("AUTH SUCCESS:", result);
      setErr("");
      return result;

    } catch (err) {
      console.error("AUTH ERROR:", err.message);
      setErr(err.message);
    }
  };

  const submit = () => {
    if (!form.email || !form.password) {
      setErr("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!form.name) return setErr("Name is required.");
      if (form.password !== form.confirm) return setErr("Passwords do not match.");
      if (form.password.length < 6) return setErr("Min 6 characters for password.");
    }

    handleAuth({
      name: form.name,
      email: form.email,
      password: form.password,
      isLogin: mode === "login"
    });
  };
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:300, backdropFilter:"blur(8px)" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:"36px 32px", zIndex:301, width:"min(440px,94vw)", boxShadow:"0 40px 100px rgba(0,0,0,0.8)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, background:`linear-gradient(135deg,${C.accent},${C.cyan})`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 14px" }}>⚡</div>
          <h2 style={{ margin:0, fontSize:22, fontWeight:800, fontFamily:F.display, color:C.text }}>{mode==="login"?"Welcome Back":"Create Account"}</h2>
          <p style={{ margin:"6px 0 0", fontSize:13, color:C.textMuted }}>TechMart Rwanda</p>
        </div>
        <div style={{ display:"flex", background:C.surface, borderRadius:10, padding:4, marginBottom:24, border:`1px solid ${C.border}` }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex:1, background:mode===m?C.accent:"transparent", color:mode===m?"#fff":C.textSec, border:"none", borderRadius:7, padding:"9px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F.body, transition:"all 0.2s" }}>{m==="login"?"Sign In":"Sign Up"}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {mode==="register" && <div><label style={lbl}>Full Name *</label><input placeholder="John Doe" value={form.name} onChange={e=>set("name",e.target.value)} style={inp} /></div>}
          <div><label style={lbl}>Email *</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Password *</label><input type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} style={inp} /></div>
          {mode==="register" && <div><label style={lbl}>Confirm Password *</label><input type="password" placeholder="••••••••" value={form.confirm} onChange={e=>set("confirm",e.target.value)} style={inp} /></div>}
        </div>
        {err && <p style={{ margin:"12px 0 0", fontSize:13, color:C.red, background:"rgba(255,77,106,0.1)", padding:"8px 12px", borderRadius:8 }}>⚠ {err}</p>}
        <button onClick={submit} style={{ width:"100%", marginTop:20, background:`linear-gradient(135deg,${C.accent},#9B59B6)`, color:"#fff", border:"none", borderRadius:12, padding:14, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </button>
        {mode==="login" && <p style={{ textAlign:"center", marginTop:12, fontSize:12, color:C.textMuted }}>Demo: any email + any password works</p>}
        <button onClick={onClose} style={{ width:"100%", marginTop:8, background:"transparent", color:C.textSec, border:"none", padding:"8px", fontSize:13, cursor:"pointer", fontFamily:F.body }}>Cancel</button>
      </div>
    </>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
function DashboardPage({ user, wishlist, onRemoveWish, onGoElec }) {
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://techmart-hngi.onrender.com/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     const data = await res.json();
console.log("ORDERS RESPONSE:", data);
      if (res.ok) {
        setOrders(data.orders || data || []);
      }
    } catch (err) {
      console.error("Orders error:", err);
      setOrders([]);
    }
  };

  const statusColor = {
    Delivered: C.green,
    "In Transit": C.amber,
    Processing: C.cyan,
    PAID: C.green,
    PENDING: C.amber,
  };

  const safeOrders = orders || [];

  const totalSpent = safeOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  return (
    <div style={{ paddingTop: 32, paddingBottom: 60, animation: "slideIn 0.35s ease" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32, flexWrap: "wrap" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            fontFamily: F.display,
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: F.display, color: C.text }}>
            Welcome, {user.name}!
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textMuted }}>
            {user.email} · S&VMart Rwanda Member
          </p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Orders", value: safeOrders.length, icon: "📦", color: C.accent },
          { label: "Wishlist Items", value: wishlist.length, icon: "❤️", color: C.red },
          { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: "💰", color: C.green },
          { label: "Member Since", value: "Jun 2025", icon: "🎯", color: C.cyan },
        ].map((s) => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: F.mono }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        {[
          ["overview", "📊 Overview"],
          ["orders", "📦 My Orders"],
          ["wishlist", "❤️ Wishlist"],
          ["profile", "👤 Profile"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`,
              color: tab === id ? C.accent : C.textSec,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: F.body,
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontFamily: F.display, color: C.text }}>
              Recent Orders
            </h3>

            {safeOrders.slice(0, 2).map((o) => (
              <div key={o.id} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{o.orderNumber}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{o.status}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
                  {(o.items || []).length} items
                </p>
                <p style={{ margin: 0, fontSize: 13, color: C.accent }}>${o.total}</p>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Quick Actions</h3>

            <button onClick={onGoElec} style={{ width: "100%" }}>🛒 Browse Electronics →</button>
            <button onClick={() => setTab("wishlist")} style={{ width: "100%" }}>❤️ Wishlist →</button>
            <button onClick={() => setTab("orders")} style={{ width: "100%" }}>📦 Orders →</button>
            <button onClick={() => setTab("profile")} style={{ width: "100%" }}>👤 Profile →</button>
          </div>
        </div>
      )}

      {/* ORDERS */}
     {/* ORDERS */}
{tab === "orders" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

    <h2
      style={{
        color: C.text,
        fontFamily: F.display,
        marginBottom: 10,
      }}
    >
      My Orders
    </h2>

    {safeOrders.length === 0 ? (
      <div
        style={{
          background: C.card,
          padding: 30,
          borderRadius: 16,
          textAlign: "center",
          color: C.textMuted,
        }}
      >
        No orders yet.
      </div>
    ) : (
      safeOrders.map((o) => (
        <div
          key={o.id}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: 22,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: C.text,
                }}
              >
                {o.orderNumber || o.id}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                }}
              >
                {new Date(o.createdAt).toLocaleString()}
              </div>
            </div>

            <div
              style={{
                background:
                  o.status === "PAID"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(250,204,21,0.15)",

                color:
                  o.status === "PAID"
                    ? C.green
                    : C.amber,

                padding: "6px 14px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {o.status}
            </div>
          </div>

          {/* Payment */}
          <div
            style={{
              fontSize: 13,
              color: C.textMuted,
              marginBottom: 16,
            }}
          >
            Payment: {o.paymentMethod}
          </div>

          {/* Items */}
          <div style={{ marginBottom: 20 }}>

            {(o.items || []).map((i, idx) => (

              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div>

                  <div
                    style={{
                      color: C.text,
                      fontWeight: 600,
                    }}
                  >
                    🛒 {i.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    Qty: {i.qty}
                  </div>

                </div>

                <div
                  style={{
                    color: C.accent,
                    fontWeight: 700,
                  }}
                >
                  ${i.price}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 14,
            }}
          >
            <div>
              Subtotal: ${o.subtotal}
            </div>

            <div>
              Discount: ${o.discount}
            </div>

            <div>
              Shipping: ${o.shippingFee}
            </div>

            <div>
              Tax: ${o.tax}
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: C.green,
                marginTop: 8,
              }}
            >
              Total: ${o.total}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}

      {/* WISHLIST */}
{tab === "wishlist" && (
  <div>
    <h2
      style={{
        marginBottom: 20,
        color: C.text,
        fontFamily: F.display,
      }}
    >
      ❤️ Wishlist ({wishlist.length})
    </h2>

    {wishlist.length === 0 ? (
      <div
        style={{
          background: C.card,
          padding: 30,
          borderRadius: 16,
          textAlign: "center",
          border: `1px solid ${C.border}`,
        }}
      >
        <p style={{ color: C.textMuted }}>
          Your wishlist is empty.
        </p>
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        {wishlist.map((p) => (
          <div
            key={p.id}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 18,
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 10,
                color: C.text,
                fontSize: 16,
              }}
            >
              {p.name}
            </h3>

            <p
              style={{
                color: C.accent,
                fontWeight: 700,
                marginBottom: 15,
              }}
            >
              ${p.price}
            </p>

            <button
              onClick={() => onRemoveWish(p.id)}
              style={{
                background: C.red,
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* PROFILE */}
   {tab === "profile" && (
  <div>
    <h2>Profile</h2>

    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}
      style={{
        marginTop: 20,
        padding: "10px 20px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </div>
)}
    </div>
  );
}

// ─── ANALYTICS DASHBOARD ──────────────────────────────────────────────────────
function AnalyticsPage() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://techmart-hngi.onrender.com/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("ORDERS RESPONSE:", data);

        // ✅ SAFE EXTRACTION (handles all backend formats)
        const safeOrders =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setOrders(safeOrders);
      } catch (err) {
        console.error("Analytics error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🛡 SAFE CALCULATIONS
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total) || 0),
    0
  );

  const totalOrders = orders.length;

  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  // 📊 SAFE MONTHLY SPLIT
  const revenueByMonth = months.map((_, i) => {
    const chunk = orders.slice(i * 2, i * 2 + 2);
    return chunk.reduce((s, o) => s + (Number(o.total) || 0), 0);
  });

  const maxRev = Math.max(...revenueByMonth, 1);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div style={{ padding: 40, color: C.text }}>
        Loading analytics...
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 32, paddingBottom: 60 }}>

      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text }}>
        📊 Analytics Dashboard
      </h1>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>

        <div style={{ background: C.card, padding: 16, border: `1px solid ${C.border}` }}>
          💰 <b>${totalRevenue.toFixed(2)}</b>
          <div>Total Revenue</div>
        </div>

        <div style={{ background: C.card, padding: 16, border: `1px solid ${C.border}` }}>
          📦 <b>{totalOrders}</b>
          <div>Total Orders</div>
        </div>

        <div style={{ background: C.card, padding: 16, border: `1px solid ${C.border}` }}>
          📈 <b>${avgOrder.toFixed(2)}</b>
          <div>Avg Order</div>
        </div>

      </div>

      {/* CHART */}
      <div style={{ marginTop: 30, background: C.card, padding: 20, border: `1px solid ${C.border}` }}>
        <h3>Monthly Revenue</h3>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {revenueByMonth.map((v, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: `${(v / maxRev) * 120}px`,
                  background: C.accent,
                  borderRadius: 6,
                }}
              />
              <div style={{ fontSize: 10 }}>{months[i]}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
// ─── AI RECOMMENDATIONS ───────────────────────────────────────────────────────
function AIRecommendations({ cart, wishlist, onAddToCart, onView }) {
  const viewed = [...cart, ...wishlist];
  const subcats = [...new Set(viewed.map(p=>p.subcat).filter(Boolean))];
  let recs = electronics.filter(p => subcats.includes(p.subcat) && !viewed.find(v=>v.id===p.id)).slice(0,4);
  if (recs.length < 4) recs = [...recs, ...electronics.filter(p=>!viewed.find(v=>v.id===p.id) && !recs.find(r=>r.id===p.id))].slice(0,4);
  if (recs.length === 0) return null;
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🤖</span>
        <div>
          <h3 style={{ margin:0, fontSize:17, fontWeight:700, fontFamily:F.display, color:C.text }}>AI-Powered Recommendations</h3>
          <p style={{ margin:0, fontSize:12, color:C.textMuted }}>Based on your cart and wishlist activity</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14 }}>
        {recs.map(p=>(
          <div key={p.id} onClick={()=>onView(p)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"all 0.25s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{ height:110, overflow:"hidden", background:C.surface }}>
              <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
            </div>
            <div style={{ padding:"10px 12px" }}>
              <p style={{ margin:0, fontSize:12, fontWeight:700, color:C.text, lineHeight:1.3 }}>{p.name}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:7 }}>
                <span style={{ fontSize:14, fontWeight:800, color:C.accent, fontFamily:F.mono }}>${p.price}</span>
                <button onClick={e=>{e.stopPropagation(); onAddToCart(p);}} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ORDER TRACKING PAGE ──────────────────────────────────────────────────────
function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);

  const track = async () => {
    try {
      const clean = orderId.replace(/[#\s]/g, "").toUpperCase();

      const res = await fetch(
        `https://techmart-hngi.onrender.com/api/orders/track/${clean}`
      );

      const data = await res.json();

      if (!res.ok) {
        setResult("notfound");
        return;
      }

      // IMPORTANT: backend returns { order: {...} }
      setResult(data.order);
    } catch (err) {
      console.error(err);
      setResult("notfound");
    }
  };

  // SAFE STEPS (NO CRASH EVER)
  const steps = [
    { label: "Order Placed", done: true },
    { label: "Paid", done: result?.status !== "PENDING" },
    { label: "Processing", done: result?.status === "PAID" },
    { label: "Delivered", done: result?.status === "DELIVERED" },
  ];

  return (
    <div
      style={{
        paddingTop: 40,
        paddingBottom: 60,
        animation: "slideIn 0.35s ease",
        maxWidth: 580,
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🚚</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: F.display,
            color: C.text,
            marginBottom: 8,
          }}
        >
          Track Your Order
        </h1>
        <p style={{ fontSize: 14, color: C.textSec }}>
          Enter your order ID (e.g. ORD-1781563222566)
        </p>
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && track()}
          placeholder="e.g. ORD-1781563222566"
          style={{
            flex: 1,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "12px 16px",
            color: C.text,
            fontSize: 14,
            fontFamily: F.body,
            outline: "none",
          }}
        />

        <button
          onClick={track}
          style={{
            background: `linear-gradient(135deg,${C.accent},#9B59B6)`,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: F.display,
          }}
        >
          Track →
        </button>
      </div>

      {/* NOT FOUND */}
      {result === "notfound" && (
        <p
          style={{
            color: C.red,
            textAlign: "center",
            padding: 20,
            background: "rgba(255,77,106,0.08)",
            borderRadius: 12,
          }}
        >
          ⚠ Order not found. Please check your order number.
        </p>
      )}

      {/* RESULT */}
      {result && result !== "notfound" && (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: 24,
          }}
        >
          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: C.textMuted,
                  fontFamily: F.mono,
                }}
              >
                ORDER
              </p>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                  fontFamily: F.mono,
                }}
              >
                {result.orderNumber}
              </p>
            </div>

            <span
              style={{
                fontSize: 12,
                color: result.status === "DELIVERED" ? C.green : C.amber,
                background:
                  result.status === "DELIVERED"
                    ? "rgba(0,229,160,0.12)"
                    : "rgba(255,184,0,0.12)",
                padding: "5px 14px",
                borderRadius: 8,
                fontFamily: F.mono,
                fontWeight: 700,
              }}
            >
              {result.status}
            </span>
          </div>

          {/* ITEMS (SAFE) */}
          <div
            style={{
              marginBottom: 10,
              fontSize: 13,
              color: C.textSec,
            }}
          >
            <ul>
              {(result?.items || []).map((item) => (
                <li key={item.id}>
                  Qty: {item.qty} | Price: ${item.price}
                </li>
              ))}
            </ul>
          </div>

          {/* DATE */}
          <p
            style={{
              margin: "0 0 22px",
              fontSize: 12,
              color: C.textMuted,
            }}
          >
            Ordered {new Date(result.createdAt).toLocaleString()} · $
            {result.total ?? 0}
          </p>

          {/* STEPS */}
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 24,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: s.done ? C.green : C.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: s.done ? "#000" : "transparent",
                  }}
                >
                  {s.done ? "✓" : ""}
                </div>

                {/* SAFE LINE FIX */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 20,
                      background: s.done ? C.green : C.border,
                      margin: "3px 0",
                    }}
                  />
                )}
              </div>

              <div style={{ paddingBottom: 14 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: s.done ? C.text : C.textMuted,
                  }}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ paddingTop:40, paddingBottom:60, animation:"slideIn 0.35s ease" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(108,99,255,0.12)", border:`1px solid rgba(108,99,255,0.3)`, borderRadius:20, padding:"6px 16px", marginBottom:20 }}>
          <span style={{ fontSize:12, color:C.accent, fontFamily:F.mono, letterSpacing:"0.1em" }}>WHO WE ARE</span>
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:16, lineHeight:1.1 }}>
          Built for the <span style={{ background:`linear-gradient(135deg,${C.accent},${C.cyan})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Tech-First</span> Generation
        </h1>
        <p style={{ fontSize:16, color:C.textSec, maxWidth:560, margin:"0 auto", lineHeight:1.8 }}>
          TechMart is your one-stop destination for premium electronics and expert tech services. We connect people with the tools and talent they need to build, create, and grow.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:48 }}>
        {[
          { icon:"⚡", title:"Founded 2021", desc:"Started with a mission to make technology more accessible to everyone, everywhere." },
          { icon:"🌍", title:"Global Reach", desc:"Serving customers and clients across 40+ countries with fast shipping and remote services." },
          { icon:"🛠️", title:"Expert Team", desc:"Our certified engineers, designers and developers bring decades of combined experience." },
          { icon:"⭐", title:"4.8 Average Rating", desc:"Thousands of happy customers who trust us for devices and professional tech services." },
        ].map((item,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>{item.icon}</div>
            <h3 style={{ fontSize:16, fontWeight:700, fontFamily:F.display, color:C.text, marginBottom:8 }}>{item.title}</h3>
            <p style={{ fontSize:13, color:C.textSec, lineHeight:1.7 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background:`linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,212,255,0.05))`, border:`1px solid rgba(108,99,255,0.25)`, borderRadius:20, padding:"36px 40px", marginBottom:40 }}>
        <h2 style={{ fontSize:22, fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:12 }}>Our Mission</h2>
        <p style={{ fontSize:15, color:C.textSec, lineHeight:1.8, maxWidth:700 }}>
          We believe everyone deserves access to great technology — whether that's a high-performance laptop, a secure network, or a beautifully built website. TechMart bridges the gap between cutting-edge hardware and the expert services needed to get the most out of it.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
        {[
          { name:"Amara Nwosu", role:"CEO & Founder", emoji:"👩‍💼" },
          { name:"Kai Tanaka", role:"Head of Engineering", emoji:"👨‍💻" },
          { name:"Sofia Martins", role:"Lead Designer", emoji:"👩‍🎨" },
          { name:"James Okafor", role:"Security Lead", emoji:"👨‍🔒" },
        ].map((m,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20, textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:10 }}>{m.emoji}</div>
            <p style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:F.display, marginBottom:4 }}>{m.name}</p>
            <p style={{ fontSize:12, color:C.textMuted, fontFamily:F.mono }}>{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEALS PAGE ───────────────────────────────────────────────────────────────
function DealsPage({ onAddToCart, onView, cart }) {
  const deals = allItems.filter(p => p.badge === "Sale" || p.orig - p.price >= 100).sort((a,b) => (b.orig-b.price)-(a.orig-a.price));
  return (
    <div style={{ paddingTop:40, paddingBottom:60, animation:"slideIn 0.35s ease" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,77,106,0.12)", border:`1px solid rgba(255,77,106,0.3)`, borderRadius:20, padding:"6px 16px", marginBottom:20 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:C.red, display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:12, color:C.red, fontFamily:F.mono, letterSpacing:"0.1em" }}>LIMITED TIME DEALS</span>
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:14, lineHeight:1.1 }}>
          Today's Best <span style={{ background:`linear-gradient(135deg,${C.red},${C.amber})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Offers</span>
        </h1>
        <p style={{ fontSize:15, color:C.textSec, maxWidth:480, margin:"0 auto" }}>Hand-picked deals with the biggest savings — updated daily. Don't miss out.</p>
      </div>

      {/* Coupon strip */}
      <div style={{ display:"flex", gap:14, marginBottom:36, flexWrap:"wrap" }}>
        {[
          { code:"SAVE10", desc:"10% off electronics", color:C.accent },
          { code:"BUNDLE10", desc:"Device + Service bundle", color:C.cyan },
          { code:"NEWUSER", desc:"$20 off first order", color:C.green },
        ].map(c => (
          <div key={c.code} style={{ background:C.card, border:`1px dashed ${c.color}`, borderRadius:12, padding:"12px 20px", display:"flex", alignItems:"center", gap:14, flex:1, minWidth:200 }}>
            <span style={{ fontSize:22 }}>🏷️</span>
            <div>
              <p style={{ margin:0, fontSize:14, fontWeight:800, fontFamily:F.mono, color:c.color }}>{c.code}</p>
              <p style={{ margin:0, fontSize:12, color:C.textMuted }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:18, fontWeight:700, fontFamily:F.display, color:C.text, marginBottom:18 }}>🔥 Best Savings Right Now</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:18 }}>
        {deals.map(p => p.cat==="electronics"
          ? <ElecCard key={p.id} product={p} onAddToCart={onAddToCart} onView={onView} cart={cart} />
          : <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onView={onView} cart={cart} />
        )}
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));
  const ok = form.name && form.email && form.message;

const handleSubmit = async () => {
  if (!ok) return;

  try {
    const response = await fetch("https://techmart-hngi.onrender.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      setSent(true);
    }
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div style={{ paddingTop:40, paddingBottom:60, animation:"slideIn 0.35s ease" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,229,160,0.1)", border:`1px solid rgba(0,229,160,0.3)`, borderRadius:20, padding:"6px 16px", marginBottom:20 }}>
          <span style={{ fontSize:12, color:C.green, fontFamily:F.mono, letterSpacing:"0.1em" }}>GET IN TOUCH</span>
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:800, fontFamily:F.display, color:C.text, marginBottom:14 }}>
          We're Here to <span style={{ background:`linear-gradient(135deg,${C.green},${C.cyan})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Help</span>
        </h1>
        <p style={{ fontSize:15, color:C.textSec, maxWidth:460, margin:"0 auto" }}>Have a question, need a quote, or just want to say hi? We respond within 1 business hour.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:28, alignItems:"start" }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:32 }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
              <h2 style={{ fontSize:20, fontFamily:F.display, color:C.text, marginBottom:8 }}>Message Sent!</h2>
              <p style={{ color:C.textSec, fontSize:14 }}>Thanks {form.name}! We'll get back to you at {form.email} shortly.</p>
              <button onClick={() => { setSent(false); setForm({ name:"",email:"",subject:"",message:"" }); }} style={{ marginTop:20, background:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.display }}>Send Another</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18, fontWeight:700, fontFamily:F.display, color:C.text, marginBottom:22 }}>Send a Message</h2>
              {[{l:"Full Name *",k:"name",t:"text",ph:"John Doe"},{l:"Email *",k:"email",t:"email",ph:"john@example.com"},{l:"Subject",k:"subject",t:"text",ph:"How can we help?"}].map(f => (
                <div key={f.k} style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:11, color:C.textMuted, marginBottom:5, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.l}</label>
                  <input type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 13px", color:C.text, fontSize:14, fontFamily:F.body, outline:"none" }} />
                </div>
              ))}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, color:C.textMuted, marginBottom:5, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" }}>Message *</label>
                <textarea rows={4} placeholder="Tell us what's on your mind..." value={form.message} onChange={e=>set("message",e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 13px", color:C.text, fontSize:14, fontFamily:F.body, outline:"none", resize:"vertical" }} />
              </div>
              <button onClick={handleSubmit} style={{ width:"100%", background:ok?`linear-gradient(135deg,${C.accent},#9B59B6)`:C.border, color:ok?"#fff":C.textMuted, border:"none", borderRadius:12, padding:14, fontSize:15, fontWeight:700, cursor:ok?"pointer":"not-allowed", fontFamily:F.display }}>Send Message →</button>
            </>
          )}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { icon:"📧", label:"Email", value:"dianeumulisa056@gmail.com" },
            { icon:"💬", label:"Live Chat", value:"Available 9am–6pm Mon–Fri" },
            { icon:"📞", label:"Phone", value:"+250 795 910 963" },
            { icon:"📍", label:"HQ", value:"Kigali, Rwanda" },
          ].map((item,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:26 }}>{item.icon}</span>
              <div>
                <p style={{ margin:0, fontSize:11, color:C.textMuted, fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.06em" }}>{item.label}</p>
                <p style={{ margin:"3px 0 0", fontSize:14, color:C.text, fontWeight:600 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cat, setCat] = useState("all");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [modal, setModal] = useState(null);
  const [svcDetail, setSvcDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 

useEffect(() => {
  getProducts({ limit: 50 })
    .then(data => {
      if (data.products && data.products.length > 0) {
        console.log(`✅ Loaded ${data.products.length} products from API`);
      }
    })
    .catch(err => console.log("Using local products:", err.message));
}, []);
  
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(() => setToast(null), 2800); };

  const addToCart = p => {
    setCart(prev => { const e = prev.find(i=>i.id===p.id); return e ? prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i) : [...prev,{...p,qty:1}]; });
    showToast(`${p.name} added to cart!`);
  };
  const removeFromCart = id => setCart(p => p.filter(i=>i.id!==id));
  const updateQty = (id,qty) => { if(qty<=0) removeFromCart(id); else setCart(p=>p.map(i=>i.id===id?{...i,qty}:i)); };
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const toggleWishlist = p => {
    const has = wishlist.find(i=>i.id===p.id);
    if (has) { setWishlist(prev=>prev.filter(i=>i.id!==p.id)); showToast(`Removed from wishlist`,"info"); }
    else { setWishlist(prev=>[...prev,p]); showToast(`❤️ Added to wishlist!`); }
  };
  const removeWish = id => setWishlist(prev=>prev.filter(i=>i.id!==id));

  const goTo = (pg, newCat) => { setPage(pg); if(newCat) setCat(newCat); setSvcDetail(null); setSearch(""); setMobileMenuOpen(false); window.scrollTo(0,0); };
  const handleView = p => { if(p.cat==="services") { setSvcDetail(p); setPage("services"); } else setModal(p); };
  const handleAuth = async ({ name, email, password, isLogin }) => {
  try {
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user)); 
    setUser(result.user);
    setAuthOpen(false);
    showToast(`Welcome, ${result.user.name}! 🎉`);
  } catch (err) {
    showToast(err.message, "error");
  }
};
  let items = allItems.filter(p => (cat==="all"||p.cat===cat) && (search===""||p.name.toLowerCase().includes(search.toLowerCase())||p.brand.toLowerCase().includes(search.toLowerCase())));
  if(sort==="price-asc") items=[...items].sort((a,b)=>a.price-b.price);
  else if(sort==="price-desc") items=[...items].sort((a,b)=>b.price-a.price);
  else if(sort==="rating") items=[...items].sort((a,b)=>b.rating-a.rating);

  const NAV = [
    { id:"home",       label:"Home" },
    { id:"electronics",label:"Electronics" },
    { id:"services",   label:"Tech Services" },
    { id:"deals",      label:"Deals 🔥" },
    { id:"tracking",   label:"Track Order" },
    { id:"analytics",  label:"Analytics" },
    { id:"about",      label:"About" },
    { id:"contact",    label:"Contact" },
    { id:"admin",      label:"Admin" },
  ];


  return (

    
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F.body, color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0A0A0F}::-webkit-scrollbar-thumb{background:#2A2A3E;border-radius:3px}
        @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes toastIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6)}
@media(max-width:780px){.navlinks{display:none!important}.dsearch{display:none!important}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(10,10,15,0.95)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"0 20px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div onClick={()=>goTo("home","all")} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0}}>
            <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.accent},${C.cyan})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
            <div><span style={{fontSize:17,fontWeight:800,fontFamily:F.display}}>S&VMart</span><span style={{fontSize:10,color:C.textMuted,fontFamily:F.mono,marginLeft:4}}>🇷🇼 Rwanda</span></div>
          </div>
          <div className="navlinks" style={{display:"flex",gap:1,flexWrap:"nowrap",overflow:"hidden"}}>
            {NAV.map(n=>{
              const active=page===n.id&&!svcDetail;
              return <button key={n.id} onClick={()=>{if(n.id==="electronics")goTo("electronics");else if(n.id==="services"){goTo("home","services");setCat("services");}else goTo(n.id);}} style={{background:active?"rgba(108,99,255,0.15)":"transparent",color:active?C.accent:C.textSec,border:"none",borderBottom:`2px solid ${active?C.accent:"transparent"}`,borderRadius:"8px 8px 0 0",padding:"6px 10px",fontSize:12,fontWeight:active?700:400,cursor:"pointer",fontFamily:F.body,height:62,transition:"all 0.2s",whiteSpace:"nowrap"}}>{n.label}</button>;
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div className="dsearch" style={{position:"relative",display:"flex"}}>
              <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:13}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px 7px 28px",color:C.text,fontSize:12,width:130,fontFamily:F.body,outline:"none"}}/>
            </div>
            <button onClick={()=>user?goTo("dashboard"):setAuthOpen(true)} title="Wishlist" style={{position:"relative",background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"7px 11px",color:C.text,cursor:"pointer",fontSize:13}}>
              ❤️{wishlist.length>0&&<span style={{position:"absolute",top:-5,right:-5,background:C.red,color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlist.length}</span>}
            </button>
            <button onClick={()=>setCartOpen(true)} style={{position:"relative",background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"7px 11px",color:C.text,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:4}}>
              🛒{cartCount>0&&<span style={{position:"absolute",top:-5,right:-5,background:C.accent,color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono}}>{cartCount}</span>}
            </button>
            {user
              ?<button onClick={()=>goTo("dashboard")} style={{background:`linear-gradient(135deg,${C.accent},#9B59B6)`,color:"#fff",border:"none",borderRadius:9,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F.body,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(" ")[0]}
                </button>
              :<button onClick={()=>setAuthOpen(true)} style={{background:`linear-gradient(135deg,${C.accent},#9B59B6)`,color:"#fff",border:"none",borderRadius:9,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F.body}}>Sign In</button>
            }
            <button className="hamburger" onClick={()=>setMobileMenuOpen(o=>!o)} style={{display:"flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,cursor:"pointer",fontSize:18,alignItems:"center",justifyContent:"center"}}>☰</button>
          </div>
        </div>
        {mobileMenuOpen&&(
          <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 20px 16px",display:"flex",flexDirection:"column",gap:4,background:"rgba(10,10,15,0.98)"}}>
            <div style={{position:"relative",marginBottom:8}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:13}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px 9px 30px",color:C.text,fontSize:13,fontFamily:F.body,outline:"none"}}/>
            </div>
            {NAV.map(n=><button key={n.id} onClick={()=>{if(n.id==="electronics")goTo("electronics");else if(n.id==="services"){goTo("home","services");setCat("services");}else goTo(n.id);}} style={{background:page===n.id?"rgba(108,99,255,0.15)":"transparent",color:page===n.id?C.accent:C.textSec,border:"none",borderRadius:8,padding:"11px 14px",fontSize:14,fontWeight:page===n.id?700:400,cursor:"pointer",fontFamily:F.body,textAlign:"left"}}>{n.label}</button>)}
          </div>
        )}
      </nav>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px"}}>

        {page==="about"      && <AboutPage />}
        {page==="deals"      && <DealsPage onAddToCart={addToCart} onView={handleView} cart={cart} />}
        {page==="contact"    && <ContactPage />}
       {page==="tracking" && <OrderTrackingPage />}
        {page==="analytics"  && <AnalyticsPage />}
        {page==="dashboard"  && user && <DashboardPage user={user} wishlist={wishlist} onRemoveWish={removeWish} onGoElec={()=>goTo("electronics")} />}
        {page==="electronics"&& <ElectronicsPage onAddToCart={addToCart} onView={p=>setModal(p)} cart={cart} wishlist={wishlist} onWishlist={toggleWishlist} />}
        {page==="services"   && svcDetail && <ServiceDetail svc={svcDetail} onBack={()=>setSvcDetail(null)} />}
          {page === "admin" && (
  <AdminPage
    C={C}
    F={F}
    setPage={setPage}
  />
)}
           {page === "add-product" && <AddProduct />}

        {(page==="home"||(page==="services"&&!svcDetail))&&(
          <>
            {page==="home"&&(
              <div style={{padding:"64px 0 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 50% at 50% 0%,rgba(108,99,255,0.1),transparent 70%)`,pointerEvents:"none"}}/>
                <div style={{position:"relative"}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(108,99,255,0.12)",border:`1px solid rgba(108,99,255,0.3)`,borderRadius:20,padding:"6px 16px",marginBottom:20}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2s infinite"}}/>
                    <span style={{fontSize:12,color:C.accent,fontFamily:F.mono,letterSpacing:"0.1em"}}>S&VMART RWANDA — OPEN FOR BUSINESS</span>
                  </div>
                  <h1 style={{fontSize:"clamp(28px,5.5vw,64px)",fontWeight:800,color:C.text,fontFamily:F.display,lineHeight:1.1,marginBottom:16}}>
                    Devices. Services.<br/>
                    <span style={{background:`linear-gradient(135deg,${C.accent},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Everything Tech.</span>
                  </h1>
                  <p style={{fontSize:16,color:C.textSec,maxWidth:480,margin:"0 auto 28px",lineHeight:1.7}}>Rwanda's premier online store for premium electronics and expert tech services — web dev, IT support, cloud, cybersecurity & more.</p>
                  <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                    <button onClick={()=>goTo("electronics")} style={{background:`linear-gradient(135deg,${C.accent},#9B59B6)`,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F.display}}>Shop Electronics ⚡</button>
                    <button onClick={()=>{setCat("services");setPage("services");}} style={{background:"transparent",color:C.text,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F.display}}>Book a Service 🛠️</button>
                    <button onClick={()=>setAuthOpen(true)} style={{background:"transparent",color:C.cyan,border:`1px solid ${C.cyan}`,borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F.display}}>Create Account →</button>
                  </div>
                  <div style={{display:"flex",gap:24,justifyContent:"center",marginTop:36,flexWrap:"wrap"}}>
                    {[["23+","Products"],["6","Services"],["4.8★","Rating"],["500+","Customers"],["🇷🇼","Kigali"]].map(([v,l])=>(
                      <div key={l} style={{textAlign:"center"}}>
                        <div style={{fontSize:18,fontWeight:800,color:C.text,fontFamily:F.mono}}>{v}</div>
                        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page==="home"&&(cart.length>0||wishlist.length>0)&&(
              <AIRecommendations cart={cart} wishlist={wishlist} onAddToCart={addToCart} onView={p=>setModal(p)}/>
            )}

            {page==="services"&&!svcDetail&&(
              <div style={{paddingTop:36,paddingBottom:24}}>
                <h1 style={{fontSize:30,fontWeight:800,fontFamily:F.display,color:C.text,marginBottom:6}}>🛠️ Tech Services</h1>
                <p style={{fontSize:14,color:C.textSec}}>Expert tech services — book directly online, delivered remotely or on-site in Kigali.</p>
              </div>
            )}

            {page==="home"&&(
              <div style={{display:"flex",gap:6,marginBottom:16,padding:4,background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,width:"fit-content"}}>
                {[{id:"all",icon:"✦",label:"All"},{id:"electronics",icon:"⚡",label:"Electronics"},{id:"services",icon:"🛠️",label:"Services"}].map(c=>(
                  <button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?C.accent:"transparent",color:cat===c.id?"#fff":C.textSec,border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F.body,transition:"all 0.2s"}}>{c.icon} {c.label}</button>
                ))}
              </div>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <p style={{color:C.textMuted,fontSize:13,fontFamily:F.mono}}><span style={{color:C.accent}}>{items.filter(p=>page==="services"?p.cat==="services":true).length}</span> results{search&&<> for "<span style={{color:C.text}}>{search}</span>"</>}</p>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:13,cursor:"pointer",outline:"none"}}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:18,marginBottom:48,animation:"slideIn 0.4s ease"}}>
              {items.filter(p=>page==="services"?p.cat==="services":true).map(p=>
                p.cat==="electronics"
                  ?<ElecCard key={p.id} product={p} onAddToCart={addToCart} onView={handleView} cart={cart} wishlist={wishlist} onWishlist={toggleWishlist}/>
                  :<ProductCard key={p.id} product={p} onAddToCart={addToCart} onView={handleView} cart={cart}/>
              )}
            </div>

            {/* Bundle banner */}
            <div style={{background:`linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,212,255,0.05))`,border:`1px solid rgba(108,99,255,0.25)`,borderRadius:20,padding:"28px 32px",marginBottom:36,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:18}}>
              <div>
                <p style={{margin:"0 0 5px",fontSize:11,fontFamily:F.mono,color:C.accent,letterSpacing:"0.1em",textTransform:"uppercase"}}>Limited Offer</p>
                <h3 style={{margin:"0 0 7px",fontSize:20,fontFamily:F.display,fontWeight:800,color:C.text}}>Device + Service Bundle</h3>
                <p style={{margin:0,color:C.textSec,fontSize:13}}>Buy any device and book a service together — save 10% extra. Code: <span style={{color:C.cyan,fontFamily:F.mono,fontWeight:700}}>BUNDLE10</span></p>
              </div>
              <button onClick={()=>goTo("deals")} style={{background:`linear-gradient(135deg,${C.accent},${C.cyan})`,color:"#fff",border:"none",borderRadius:12,padding:"11px 22px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F.display,flexShrink:0}}>View All Deals →</button>
            </div>

            {/* Newsletter */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 32px",marginBottom:40,textAlign:"center"}}>
              <h3 style={{margin:"0 0 8px",fontSize:19,fontFamily:F.display,fontWeight:800,color:C.text}}>📬 Stay Updated</h3>
              <p style={{margin:"0 0 18px",fontSize:13,color:C.textSec}}>Get the latest deals, new arrivals, and tech tips in your inbox.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",maxWidth:400,margin:"0 auto"}}>
                <input placeholder="your@email.com" style={{flex:1,minWidth:180,background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px",color:C.text,fontSize:13,fontFamily:F.body,outline:"none"}}/>
                <button style={{background:`linear-gradient(135deg,${C.accent},#9B59B6)`,color:"#fff",border:"none",borderRadius:9,padding:"11px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F.display,flexShrink:0}}>Subscribe</button>
              </div>
            </div>

            {/* Footer */}
            <footer style={{borderTop:`1px solid ${C.border}`,paddingTop:32,paddingBottom:32,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:24}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                  <div style={{width:26,height:26,background:`linear-gradient(135deg,${C.accent},${C.cyan})`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⚡</div>
                  <span style={{fontSize:14,fontWeight:800,fontFamily:F.display}}>S&VMart Rwanda</span>
                </div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.7,marginBottom:8}}>Premium electronics and professional tech services for Rwanda and beyond.</p>
                <p style={{fontSize:11,color:C.textMuted,fontFamily:F.mono}}>📍 Kigali, Rwanda</p>
                <p style={{fontSize:11,color:C.textMuted,fontFamily:F.mono,marginTop:3}}>📞 +250 795 910 963</p>
                <p style={{fontSize:11,color:C.textMuted,fontFamily:F.mono,marginTop:3}}>✉ dianeumulisa056@gmail.com</p>
              </div>
              {[
                {title:"Electronics",links:["Phones","Laptops","Machines","Mouse & Input","Printers","Air Condition","Other Devices"]},
                {title:"Tech Services",links:["Web Development","IT Support","Cybersecurity","Mobile Apps","Cloud Setup","UI/UX Design"]},
                {title:"Company",links:[
                  {label:"About Us",page:"about"},
                  {label:"Deals 🔥",page:"deals"},
                  {label:"Track Order",page:"tracking"},
                  {label:"Analytics",page:"analytics"},
                  {label:"Contact Us",page:"contact"},
                  {label:"Privacy Policy",page:null},
                ]},
              ].map(s=>(
                <div key={s.title}>
                  <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,fontFamily:F.display}}>{s.title}</p>
                  {s.links.map(l=>{
                    const label=typeof l==="string"?l:l.label;
                    const pg=typeof l==="object"?l.page:null;
                    return <p key={label} onClick={()=>pg&&goTo(pg)} style={{fontSize:12,color:C.textMuted,marginBottom:6,cursor:pg?"pointer":"default"}} onMouseEnter={e=>pg&&(e.target.style.color=C.accent)} onMouseLeave={e=>e.target.style.color=C.textMuted}>{label}</p>;
                  })}
                </div>
              ))}
            </footer>
            <div style={{textAlign:"center",paddingBottom:22,paddingTop:16,borderTop:`1px solid ${C.border}`,color:C.textMuted,fontSize:11,fontFamily:F.mono}}>
              © 2025 TechMart Rwanda · Built with React · Kigali, Rwanda 🇷🇼 · All rights reserved
            </div>
          </>
        )}
      </div>

      <CartDrawer open={cartOpen} cart={cart} onClose={()=>setCartOpen(false)} onRemove={removeFromCart} onQty={updateQty} onClearCart={()=>setCart([])}/>
      {modal&&<ElecModal p={modal} onClose={()=>setModal(null)} onAdd={addToCart} cart={cart} wishlist={wishlist} onWishlist={toggleWishlist}/>}
      {authOpen&&<AuthPage onAuth={handleAuth} onClose={()=>setAuthOpen(false)}/>}

      {toast&&(
        <div style={{position:"fixed",bottom:22,right:22,background:C.card,border:`1px solid ${toast.type==="info"?C.amber:C.green}`,borderRadius:12,padding:"11px 18px",zIndex:400,display:"flex",alignItems:"center",gap:9,animation:"toastIn 0.3s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",maxWidth:300}}>
          <span style={{fontSize:15}}>{toast.type==="info"?"ℹ️":"✓"}</span>
          <span style={{fontSize:13,color:C.text}}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
