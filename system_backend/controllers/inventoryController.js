import pool from '../config/db.js';

export const getInventoryItems = async (req, res) => {
    try {
        const [items] = await pool.query(`
            SELECT i.*, c.name AS clerk_name 
            FROM inventory i
            JOIN clerks c ON i.clerk_id = c.id
            ORDER BY i.item_name
        `);
        res.json({ success: true, items });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ success: false, message: 'Error fetching inventory' });
    }
};

export const addInventoryItem = async (req, res) => {
    const { item_name, item_type, quantity, unit_price, reorder_level } = req.body;
    
    try {
        // Validate required fields
        if (!item_name || !item_type || quantity === undefined || unit_price === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const [result] = await pool.query(
            `INSERT INTO inventory 
            (item_name, item_type, quantity, unit_price, reorder_level, clerk_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [item_name, item_type, quantity, unit_price, reorder_level, req.user.id]
        );

        // Record the initial transaction
        await pool.query(
            `INSERT INTO inventory_transactions 
            (inventory_id, transaction_type, quantity, clerk_id, notes) 
            VALUES (?, 'purchase', ?, ?, 'Initial inventory entry')`,
            [result.insertId, quantity, req.user.id]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Inventory item added successfully',
            itemId: result.insertId
        });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ success: false, message: 'Error adding inventory item' });
    }
};

export const updateInventoryItem = async (req, res) => {
    const { id } = req.params;
    const { item_name, item_type, quantity, unit_price, reorder_level } = req.body;
    
    try {
        // First get current quantity
        const [current] = await pool.query(
            'SELECT quantity FROM inventory WHERE id = ?', 
            [id]
        );
        
        if (current.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Inventory item not found' 
            });
        }

        const currentQuantity = current[0].quantity;
        const quantityChange = quantity - currentQuantity;

        // Update the inventory item
        await pool.query(
            `UPDATE inventory 
            SET item_name = ?, item_type = ?, quantity = ?, 
                unit_price = ?, reorder_level = ?, clerk_id = ?
            WHERE id = ?`,
            [item_name, item_type, quantity, unit_price, reorder_level, req.user.id, id]
        );

        // Record the transaction if quantity changed
        if (quantityChange !== 0) {
            const transactionType = quantityChange > 0 ? 'purchase' : 'usage';
            await pool.query(
                `INSERT INTO inventory_transactions 
                (inventory_id, transaction_type, quantity, clerk_id, notes) 
                VALUES (?, ?, ?, ?, 'Manual inventory adjustment')`,
                [id, transactionType, Math.abs(quantityChange), req.user.id]
            );
        }

        res.json({ 
            success: true, 
            message: 'Inventory item updated successfully' 
        });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ success: false, message: 'Error updating inventory item' });
    }
};

export const deleteInventoryItem = async (req, res) => {
    const { id } = req.params;
    
    try {
        await pool.query('DELETE FROM inventory WHERE id = ?', [id]);
        res.json({ success: true, message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ success: false, message: 'Error deleting inventory item' });
    }
};

export const getInventoryTransactions = async (req, res) => {
    const { id } = req.params;
    
    try {
        const [transactions] = await pool.query(`
            SELECT t.*, c.name AS clerk_name 
            FROM inventory_transactions t
            JOIN clerks c ON t.clerk_id = c.id
            WHERE t.inventory_id = ?
            ORDER BY t.transaction_date DESC
        `, [id]);
        
        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching inventory transactions:', error);
        res.status(500).json({ success: false, message: 'Error fetching transactions' });
    }
};

export const getLowStockItems = async (req, res) => {
    try {
        const [items] = await pool.query(`
            SELECT i.*, c.name AS clerk_name 
            FROM inventory i
            JOIN clerks c ON i.clerk_id = c.id
            WHERE i.quantity <= i.reorder_level
            ORDER BY i.quantity ASC
        `);
        res.json({ success: true, items });
    } catch (error) {
        console.error('Error fetching low stock items:', error);
        res.status(500).json({ success: false, message: 'Error fetching low stock items' });
    }
};