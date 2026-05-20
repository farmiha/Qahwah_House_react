import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// GET /api/cart/:sessionId — load cart on page visit
router.get("/:sessionId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    res.json(cart || { sessionId: req.params.sessionId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/:sessionId/add — add item or increment qty
router.post("/:sessionId/add", async (req, res) => {
  try {
    const { menuItemId, name, price, qty } = req.body;
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) cart = new Cart({ sessionId: req.params.sessionId, items: [] });

    const existing = cart.items.find(
      (i) => i.menuItemId?.toString() === menuItemId?.toString()
    );
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ menuItemId, name, price, qty });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/:sessionId/decrement — decrease qty by 1 (min 1)
router.post("/:sessionId/decrement", async (req, res) => {
  try {
    const { menuItemId } = req.body;
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const existing = cart.items.find(
      (i) => i.menuItemId?.toString() === menuItemId?.toString()
    );
    if (existing && existing.qty > 1) {
      existing.qty -= 1;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:sessionId/remove — remove a single item entirely
router.delete("/:sessionId/remove", async (req, res) => {
  try {
    const { menuItemId } = req.body;
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.menuItemId?.toString() !== menuItemId?.toString()
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:sessionId/clear — empty the whole cart
router.delete("/:sessionId/clear", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { items: [] },
      { upsert: true, new: true }
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;