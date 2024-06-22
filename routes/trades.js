const express = require('express');
const router = express.Router();
const Trade = require('../models/trades');

router.post('/', async (req, res) => {
    const { type, user_id, symbol, shares, price, timestamp } = req.body;
    if (!['buy', 'sell'].includes(type) || shares < 1 || shares > 100) {
        return res.status(400).json({ error: 'Invalid trade data' });
    }
    try {
        const trade = new Trade({ type, user_id, symbol, shares, price, timestamp });
        await trade.save();
        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create trade' });
    }
});

// GET request to /trades
router.get('/', async (req, res) => {
    const { type, user_id } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (user_id) filter.user_id = user_id;
    try {
        const trades = await Trade.find(filter).sort('id');
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trades' });
    }
});

// GET request to /trades/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const trade = await Trade.findById(id);
        if (trade) {
            res.status(200).json(trade);
        } else {
            res.status(404).json({ error: 'ID not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trade' });
    }
});


router.delete('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
router.put('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
router.patch('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));

module.exports = router;