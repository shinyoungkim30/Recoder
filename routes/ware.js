const express = require('express')
const { Warehouse, Loading, Rack, Stock } = require('../models')
const router = express.Router()

router.post('/', async (req, res, next) => {
    let { width, length, name, comSeq } = req.body
    try {
        const result = await Warehouse.create({
            wh_name: name,
            wh_width: width,
            wh_length: length,
            com_seq: comSeq
        })
        res.json(result.toJSON())
    } catch (error) {
        console.error(error);
    }
})

router.get('/manage/:com_seq', async (req, res) => {
    let com_seq = req.params.com_seq
    try {
        const warehouseList = await Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq : com_seq
            },
            include: [{
                model: Rack,
                include: [{
                    model: Loading,
                    include: [{
                        model: Stock
                    }]
                }]
            }]
        });
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/wh_name/:com_seq', async (req, res) => {
    try {
        const nameList = await Warehouse.findAndCountAll({
            attributes: ['wh_name'],
            where: {
                com_seq: req.params.com_seq,
            },
            include: [{
                model: Rack,
                attributes: ['rack_seq'],
                include: [{
                    model: Loading,
                    where: {
                        loading_type: 'I'
                    },
                    attributes: ['loading_seq'],
                    include: [{
                        model: Stock,
                        attributes: ['stock_name']
                    }]
                }]
            }]
        })
        res.json(nameList)
    } catch (error) {
        console.error(error);
    }
})

router.get('/shortList/:com_seq', async (req, res) => {
    let com_seq = req.params.com_seq
    try {
        const warehouseList = await Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq : com_seq
            },
            include: [{
                model: Rack,
                include: [{
                    model: Loading,
                    include: [{
                        model: Stock
                    }]
                }]
            }],
            limit: 3
        });
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router