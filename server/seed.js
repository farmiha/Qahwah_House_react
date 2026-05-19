import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/qahwahhouse";

const SEED_ITEMS = [
  // Drinks
  {
    name: "Traditional Qahwah",
    desc: "Ancient Yemeni spiced coffee with ginger, cardamom & saffron.",
    price: 6.5,
    size: "12 oz",
    badge: "Signature",
    img: "img4.jpg",
    category: "drinks",
  },
  {
    name: "Adeni Chai",
    desc: "Yemeni black tea with cardamom, nutmeg & evaporated milk.",
    price: 7.0,
    size: "12 oz",
    badge: "Signature",
    img: "img3.jpg",
    category: "drinks",
  },
  {
    name: "Sana'ani Coffee",
    desc: "Medium roast with cardamom from Yemen's mountain capital.",
    price: 7.0,
    size: "12 oz",
    badge: "New",
    img: "img7.jpg",
    category: "drinks",
  },
  {
    name: "Espresso",
    desc: "Double shot of dark roast Yemeni Arabica — bold and smooth.",
    price: 6.0,
    size: "Demitasse",
    badge: "Classic",
    img: "img8.jpg",
    category: "drinks",
  },
  {
    name: "Latte",
    desc: "Smooth espresso with steamed milk and a delicate latte art finish.",
    price: 7.0,
    size: "16 oz",
    badge: "Café",
    img: "img11.jpg",
    category: "drinks",
  },
  // Pastries
  {
    name: "Pistachio Baklava",
    desc: "House-made baklava soaked in fragrant rose water syrup. Crisp and sweet.",
    price: 6.5,
    size: "2 pcs",
    badge: "Bestseller",
    img: "img9.jpg",
    category: "pastries",
  },
  {
    name: "Honey Cake",
    desc: "Layered Yemeni honey cake made with local sidr honey and warm spices.",
    price: 5.5,
    size: "Slice",
    badge: "Chef's Pick",
    img: "img10.jpg",
    category: "pastries",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await MenuItem.deleteMany({});
    console.log("🗑  Cleared existing menu items");

    const inserted = await MenuItem.insertMany(SEED_ITEMS);
    console.log(`🌱 Seeded ${inserted.length} menu items:`);
    inserted.forEach((item) =>
      console.log(`   • [${item.category}] ${item.name} — $${item.price}`)
    );

    await mongoose.disconnect();
    console.log("✅ Done! MongoDB disconnected.");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
