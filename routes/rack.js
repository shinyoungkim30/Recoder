const express = require('express')
const { Rack, Loading, Stock } = require('../models')
const router = express.Router()

/** 창고에  저장  */
router.post('/', async (req, res, next) => {
    console.log(`선반 저장할`, req.body)
    // let { rackName, rackWidth, rackLength, rackFloor, rackX, rackZ, rackRotateYN, wh_seq } = req.body    
    try {
        let arr = req.body.map(item => ({
            rack_id: item.rackName,
            rack_position: "",
            rack_width: item.rackWidth,
            rack_length: item.rackLength,
            rack_floor: item.rackFloor,
            rack_x: item.rackX,
            rackZ: item.rackZ,
            rack_rotate_yn: item.rackRotationYN,
            wh_seq: item.wh_seq
        }))
        const result = await Rack.bulkCreate(arr);
        // const result = await Rack.create({
        //     rack_id: rackName,
        //     rack_position: '????',
        //     rack_width: rackWidth,
        //     rack_length: rackLength,
        //     rack_floor: rackFloor,
        //     rack_x: rackX,
        //     rack_z: rackZ,
        //     rack_rotate_yn: rackRotateYN,
        //     wh_seq: wh_seq

        // })
        // console.log(result)
        res.send("창고 생성 성공")
        // res.json(result.toJSON())
    } catch (error) {
        console.error(error);
    }
})

/** rackList 조회 */
router.get('/:wh_seq', async (req, res) => {
    console.log("qwe");
    let wh_seq = req.params.wh_seq
    try{
        const rackList = await Rack.findAll({
            // attributes: ['rack_x', 'rack_z', 'rack_width', 'rack_length', 'rack_floor'],
            where: {
                wh_seq : wh_seq
            },
            include: [{
                model: Loading,
                include: [{
                    model: Stock,
                    
                }]
            }]
        })
        // console.log('rackList 가져오기', rackList);
        res.json(rackList)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router