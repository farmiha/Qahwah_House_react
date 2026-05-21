import express from "express";
import Cart from "../models/Cart.js";
const router = express.Router();
router.get("/:sessionId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    res.json(cart || { sessionId: req.params.sessionId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:sessionId/add", async (req, res) => {
  try {
    const { menuItemId, name, price, qty } = req.body;
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) cart = new Cart({ sessionId: req.params.sessionId, items: [] });
    const existing = cart.items.find(i => i.menuItemId?.toString() === menuItemId?.toString());
    if (existing) existing.qty += qty;
    else cart.items.push({ menuItemId, name, price, qty });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:sessionId/remove", async (req, res) => {
  try {
    const { menuItemId } = req.body;
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (cart) {
      cart.items = cart.items.filter(i => i.menuItemId?.toString() !== menuItemId?.toString());
      await cart.save();
    }
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:sessionId/decrement", async (req, res) => {
  try {
    const { menuItemId } = req.body;
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (cart) {
      const item = cart.items.find(i => i.menuItemId?.toString() === menuItemId?.toString());
      if (item && item.qty > 1) item.qty -= 1;
      else cart.items = cart.items.filter(i => i.menuItemId?.toString() !== menuItemId?.toString());
      await cart.save();
    }
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:sessionId/clear", async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ sessionId: req.params.sessionId }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
