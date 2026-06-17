const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TechMart database...");

  // ── Coupons ──────────────────────────────────────────────────
  const coupons = [
    { code: "SAVE10",   discount: 0.10, isPercent: true,  maxUses: 500 },
    { code: "BUNDLE10", discount: 0.10, isPercent: true,  maxUses: 300 },
    { code: "NEWUSER",  discount: 20,   isPercent: false, maxUses: 999 },
  ];

  for (const coupon of coupons) {
    const exists = await prisma.coupon.findUnique({ where: { code: coupon.code } });
    if (!exists) {
      await prisma.coupon.create({ data: coupon });
    }
  }
  console.log("✅ Coupons seeded");

  // ── Products ──────────────────────────────────────────────────
  const products = [
    // PHONES
    { name:"Samsung Galaxy S24 Ultra", brand:"Samsung", price:1299, origPrice:1399, rating:4.9, reviewCount:2341, badge:"Best Seller", type:"electronics", subcat:"phones", stock:18, image:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", description:"The pinnacle of Android smartphones with an integrated S-Pen.", specs:["200MP camera","Snapdragon 8 Gen 3","12GB RAM","5000mAh battery"] },
    { name:"iPhone 15 Pro Max", brand:"Apple", price:1199, origPrice:1199, rating:4.8, reviewCount:5120, badge:"New", type:"electronics", subcat:"phones", stock:25, image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", description:"Apple's most powerful iPhone ever with titanium frame.", specs:["A17 Pro chip","48MP ProRAW","Titanium frame","USB-C 3.0"] },
    { name:"Google Pixel 8 Pro", brand:"Google", price:999, origPrice:1099, rating:4.7, reviewCount:876, badge:"Sale", type:"electronics", subcat:"phones", stock:14, image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80", description:"The smartest phone with Google Tensor G3 chip.", specs:["Tensor G3 chip","50MP camera","7yr Android updates","Temperature sensor"] },
    { name:"OnePlus 12 Pro", brand:"OnePlus", price:799, origPrice:899, rating:4.6, reviewCount:432, badge:null, type:"electronics", subcat:"phones", stock:20, image:"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80", description:"Flagship performance with Hasselblad cameras.", specs:["Snapdragon 8 Gen 3","100W fast charge","Hasselblad camera","6.82 QHD+"] },
    // LAPTOPS
    { name:"MacBook Pro 16 M3 Pro", brand:"Apple", price:2499, origPrice:2999, rating:4.9, reviewCount:1840, badge:"Best Seller", type:"electronics", subcat:"laptops", stock:12, image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", description:"The ultimate pro laptop with M3 Pro chip.", specs:["Apple M3 Pro","36GB unified RAM","1TB SSD","22hr battery"] },
    { name:"Dell XPS 15 OLED", brand:"Dell", price:1799, origPrice:2099, rating:4.7, reviewCount:654, badge:"Sale", type:"electronics", subcat:"laptops", stock:8, image:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80", description:"Premium Windows laptop with jaw-dropping OLED display.", specs:["Intel Core i9-13900H","32GB DDR5","RTX 4060","15.6 3.5K OLED"] },
    { name:"ASUS ROG Zephyrus G16", brand:"ASUS", price:1999, origPrice:2299, rating:4.8, reviewCount:389, badge:"New", type:"electronics", subcat:"laptops", stock:6, image:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80", description:"Powerhouse gaming laptop that doubles as a workstation.", specs:["AMD Ryzen 9 7945HX","RTX 4080","32GB RAM","QHD+ 240Hz"] },
    { name:"Lenovo ThinkPad X1 Carbon", brand:"Lenovo", price:1349, origPrice:1599, rating:4.6, reviewCount:721, badge:"Sale", type:"electronics", subcat:"laptops", stock:15, image:"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80", description:"Ultra-light business laptop with military-grade durability.", specs:["Intel Core i7-1365U","16GB LPDDR5","512GB SSD","14 IPS 2.8K"] },
    // MACHINES
    { name:"Apple Mac Studio M2 Ultra", brand:"Apple", price:3999, origPrice:4499, rating:4.9, reviewCount:234, badge:"Top Pick", type:"electronics", subcat:"machines", stock:5, image:"https://images.unsplash.com/photo-1655721530791-59b0a593bc5b?w=500&q=80", description:"Desktop powerhouse for video editors and 3D artists.", specs:["M2 Ultra chip","192GB unified RAM","4TB SSD","8K display support"] },
    { name:"Raspberry Pi 5 Kit", brand:"Raspberry Pi", price:129, origPrice:149, rating:4.8, reviewCount:1203, badge:"Popular", type:"electronics", subcat:"machines", stock:60, image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80", description:"The latest and most powerful Raspberry Pi.", specs:["BCM2712 quad-core","8GB LPDDR4X","PCIe 2.0","Dual 4K HDMI"] },
    // MOUSE
    { name:"Logitech MX Master 3S", brand:"Logitech", price:99, origPrice:129, rating:4.9, reviewCount:3421, badge:"Best Seller", type:"electronics", subcat:"mouse", stock:40, image:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80", description:"The world's most advanced productivity mouse.", specs:["8000 DPI sensor","MagSpeed scroll","7 buttons","70-day battery"] },
    { name:"Razer DeathAdder V3 Pro", brand:"Razer", price:149, origPrice:169, rating:4.8, reviewCount:987, badge:"New", type:"electronics", subcat:"mouse", stock:22, image:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80", description:"Featherlight gaming mouse with ultra-precise wireless.", specs:["Focus Pro 30K sensor","90hr battery","HyperSpeed wireless","58g ultra-light"] },
    // PRINTERS
    { name:"HP LaserJet Pro M404dn", brand:"HP", price:299, origPrice:379, rating:4.6, reviewCount:542, badge:"Sale", type:"electronics", subcat:"printers", stock:18, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", description:"Fast reliable monochrome laser printer for busy offices.", specs:["40ppm speed","Duplex printing","Ethernet + USB","250-sheet tray"] },
    { name:"Epson EcoTank ET-8550", brand:"Epson", price:699, origPrice:849, rating:4.8, reviewCount:317, badge:"Best Value", type:"electronics", subcat:"printers", stock:10, image:"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&q=80", description:"Professional photo printer with cartridge-free ink tanks.", specs:["6-color inkjet","A3+ format","Wi-Fi + Ethernet","2yr ink supply"] },
    // AIR CONDITION
    { name:"Daikin FTXB35C Split AC", brand:"Daikin", price:899, origPrice:1099, rating:4.8, reviewCount:412, badge:"Best Seller", type:"electronics", subcat:"aircon", stock:7, image:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80", description:"Whisper-quiet energy-efficient split air conditioner.", specs:["12000 BTU","Inverter technology","A++ energy rating","Wi-Fi control"] },
    { name:"LG Dual Cool Portable 12K", brand:"LG", price:549, origPrice:649, rating:4.5, reviewCount:218, badge:"Sale", type:"electronics", subcat:"aircon", stock:12, image:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80", description:"Portable air conditioner with no permanent installation needed.", specs:["12000 BTU","Dual Inverter","No-drain design","Auto cooling"] },
    // OTHER
    { name:"Sony 65 OLED Bravia XR", brand:"Sony", price:2299, origPrice:2799, rating:4.9, reviewCount:521, badge:"Sale", type:"electronics", subcat:"other", stock:4, image:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80", description:"Sony's most lifelike TV with cognitive intelligence.", specs:["4K 120Hz OLED","Cognitive Processor XR","HDMI 2.1 x4","Dolby Atmos"] },
    { name:"Bose QuietComfort 45", brand:"Bose", price:279, origPrice:329, rating:4.8, reviewCount:1870, badge:"Best Seller", type:"electronics", subcat:"other", stock:28, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", description:"Gold standard noise-cancelling headphones.", specs:["World-class ANC","24hr battery","Aware Mode","Foldable design"] },
    { name:"GoPro HERO12 Black", brand:"GoPro", price:399, origPrice:449, rating:4.7, reviewCount:643, badge:"New", type:"electronics", subcat:"other", stock:16, image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80", description:"The world's most versatile action camera.", specs:["5.3K60 video","HyperSmooth 6.0","HDR photo","27m waterproof"] },
    // SERVICES
    { name:"Custom Web Development", brand:"TechMart Dev Studio", price:499, origPrice:799, rating:4.9, reviewCount:214, badge:"Popular", type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80", tagline:"Full-stack websites built for performance", duration:"7-14 days", delivery:"Remote", teamSize:"2 developers", description:"Modern responsive websites from landing pages to full e-commerce platforms.", specs:["UI/UX Design","Frontend React/Next.js","Backend Node/Django","30-day free support"] },
    { name:"IT Support and Maintenance", brand:"TechMart Support", price:99, origPrice:149, rating:4.8, reviewCount:560, badge:"Best Value", type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80", tagline:"On-demand tech help for businesses", duration:"Same day", delivery:"Remote / On-site", teamSize:"Certified technician", description:"Fast reliable IT support for hardware software and network issues.", specs:["Hardware diagnostics","OS installation","Network config","Virus removal"] },
    { name:"Cybersecurity Audit", brand:"TechMart SecureLab", price:349, origPrice:599, rating:4.9, reviewCount:98, badge:"Critical", type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80", tagline:"Protect your business from digital threats", duration:"3-5 business days", delivery:"Remote", teamSize:"Security specialist", description:"Comprehensive security audit with full remediation roadmap.", specs:["Network vulnerability scan","Web app pentest","Risk report","Remediation roadmap"] },
    { name:"Mobile App Development", brand:"TechMart Dev Studio", price:799, origPrice:1299, rating:4.8, reviewCount:134, badge:"New", type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80", tagline:"iOS and Android apps that users love", duration:"3-6 weeks", delivery:"Remote", teamSize:"3 developers", description:"Cross-platform mobile apps for iOS and Android using React Native.", specs:["UX/UI Design","React Native","API integration","App Store submission"] },
    { name:"Cloud Infrastructure Setup", brand:"TechMart CloudOps", price:599, origPrice:899, rating:4.7, reviewCount:77, badge:null, type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80", tagline:"Scalable cloud architecture on AWS GCP or Azure", duration:"5-10 business days", delivery:"Remote", teamSize:"Cloud architect", description:"Design deploy and optimize cloud infrastructure for your business.", specs:["Architecture design","CI/CD pipeline","Container orchestration","Cost optimization"] },
    { name:"UI/UX Design Sprint", brand:"TechMart Design Co", price:299, origPrice:449, rating:4.8, reviewCount:189, badge:"Sale", type:"service", subcat:null, stock:999, image:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80", tagline:"Beautiful user-tested designs in 5 days", duration:"5 days", delivery:"Remote", teamSize:"Senior designer", description:"A focused 5-day sprint delivering complete UI/UX with clickable prototype.", specs:["User research","Wireframes","High-fidelity mockups","Figma prototype"] },
  ];

  for (const item of products) {
    const { specs, ...data } = item;
    await prisma.product.create({
      data: {
        ...data,
        specs: { create: specs.map(s => ({ spec: s })) },
      },
    });
    process.stdout.write(".");
  }

  console.log(`\n✅ ${products.length} products seeded`);
  console.log("✅ Seed complete!");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });