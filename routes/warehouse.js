const express = require('express')
const { Warehouse, Rack, Stock, Loading } = require('../models')
const router = express.Router()

router.get('/:wh_seq', async (req, res) => {
    console.log("asd");
    let wh_seq = req.params.wh_seq
    try {
        const warehouseList = await Warehouse.findOne({
            attributes: ['wh_width', 'wh_length'],
            where: {
                wh_seq : wh_seq
            },

        });
        // console.log('warehouseList 가져오기',warehouseList);
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:wh_seq', async (req, res) => {
    try {
        const result = await Warehouse.destroy({
            where: {
                wh_seq: req.params.wh_seq
            }
        })
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})

router.get('/wh_name/:com_seq', async (req, res) => {
    try {
        const wareNameList = await Warehouse.findAll({
            where: { com_seq: req.params.com_seq },
            attributes: ['wh_name'],
        })
        res.json(wareNameList)
    } catch (error) {
        console.error(error);
    }
})

// router.get('/:wh_seq', async (req, res) => {
//     console.log("qwe");
//     let wh_seq = req.params.wh_seq
//     try{
//         const rackList = await Rack.findAll({
//             attributes: ['rack_x', 'rack_z', 'rack_width', 'rack_length', 'rack_floor'],
//             where: {
//                 wh_seq : wh_seq
//             }
//         })
//         console.log('rackList 가져오기', rackList);
//         res.json(rackList)
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })
module.exports = router