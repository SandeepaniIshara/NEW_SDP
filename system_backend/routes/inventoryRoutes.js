import express from "express";
import {
    getInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryTransactions,
    getLowStockItems
} from "../controllers/inventoryController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all inventory items
router.get("/", authMiddleware, getInventoryItems);

// Get low stock items
router.get("/low-stock", authMiddleware, getLowStockItems);

// Add new inventory item
router.post("/", authMiddleware, addInventoryItem);

// Update inventory item
router.put("/:id", authMiddleware, updateInventoryItem);

// Delete inventory item
router.delete("/:id", authMiddleware, deleteInventoryItem);

// Get transactions for specific inventory item
router.get("/:id/transactions", authMiddleware, getInventoryTransactions);

export default router;