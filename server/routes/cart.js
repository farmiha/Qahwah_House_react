import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// GET /api/cart/:sessionId
router.get("/:sessionId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    res.json(cart || { sessionId: req.params.sessionId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/:sessionId/add
router.post("/:sessionId/add", async (req, res) => {
  try {
    const { menuItemId, name, price, qty } = req.body;
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) cart = new Cart({ sessionId: req.params.sessionId, items: [] });
    const existing = cart.items.find(i => i.menuItemId?.toString() === menuItemId);
    if (existing) existing.qty += qty;
    else cart.items.push({ menuItemId, name, price, qty });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:sessionId/clear
router.delete("/:sessionId/clear", async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ sessionId: req.params.sessionId }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
