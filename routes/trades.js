const express = require('express');
const router = express.Router();
const Trade = require('../models/trades');

let currentId = 1;

router.post('/', async (req, res) => {
    const { type, user_id, symbol, shares, price, timestamp } = req.body;
    if (!['buy', 'sell'].includes(type) || shares < 1 || shares > 100) {
        return res.status(400).json({ error: 'Invalid trade data' });
    }
    try {
        const trade = new Trade({ id: currentId++, type, user_id, symbol, shares, price, timestamp });
        await trade.save();
        const tradeObject = trade.toObject();
        delete tradeObject._id; // Remove the _id field
        res.status(201).json(tradeObject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create trade' });
    }
});

router.get('/', async (req, res) => {
    const { type, user_id } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (user_id) filter.user_id = user_id;
    try {
        const trades = await Trade.find(filter).sort({ id: 1 }); // Ensure sorting by id
        const tradesArray = trades.map(trade => {
            const tradeObject = trade.toObject();
            delete tradeObject._id; // Remove the _id field
            return tradeObject;
        });
        res.status(200).json(tradesArray);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trades' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const trade = await Trade.findOne({ id: Number(id) });
        if (trade) {
            const tradeObject = trade.toObject();
            delete tradeObject._id; // Remove the _id field
            res.status(200).json(tradeObject);
        } else {
            res.status(404).send('ID not found'); // Match expected error message
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trade' });
    }
});

router.delete('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
router.put('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
router.patch('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));

module.exports = router;
