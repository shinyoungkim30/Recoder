const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const { updateStockAfterUploadImg } = require('../controllers/img')
const { Loading, Stock, Client } = require('../models'); // 모델들을 import
const { Op, fn, col, NOW, Model, where } = require('sequelize');

const router = express.Router()

// 이미지 업로드 관련
// -----------------------------
try {
    fs.readdirSync('uploads')
} catch (error) {
    fs.mkdirSync('uploads')
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'recoderbucket',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('file'), updateStockAfterUploadImg)
// --------------------------------------------------------------------------------

// com_seq, loading_type별로 데이터 조회
router.get('/:com_seq/:loading_type', async (req, res, next) => {

    let com_seq = req.params.com_seq
    let loading_type = req.params.loading_type

    let date = ''
    if (loading_type === 'O') {
        // 출고일 경우 out_created_at을 내림차순으로
        date = 'out_created_at'
    } else {
        date = 'created_at'
    }

    try {
        const result = await Loading.findAll({
            where: {
                com_seq: com_seq,
                loading_type: loading_type
            },
            include: [{
                model: Stock,
                include: [{
                    model: Client
                }]
            }],
            order: [
                [col(date), 'DESC'],
            ],
            limit: 5
        })
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})
// 전체 물류현황 갯수 요청
router.get('/cnt/:com_seq/:loading_type', async (req, res, next) => {

    let com_seq = req.params.com_seq
    let loading_type = req.params.loading_type

    try {
        const result = await Loading.count({
            where: {
                com_seq: com_seq,
                loading_type: loading_type
            },
            include: [{
                model: Stock,
                include: [{
                    model: Client
                }]
            }],
        })
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})


// 바코드...
router.post('/barcode', async (req, res) => {
    let barcode = req.body.barcode;
    let com_seq = req.body.com_seq

    try {
        const result = await Stock.findAll({
            where: {
                stock_barcode: barcode
            }
        })
        let { stock_seq, stock_balance_cnt } = result[0]
        await Loading.create({
            loading_type: null,
            loading_cnt: stock_balance_cnt,
            com_seq: com_seq,
            stock_seq: stock_seq
        })
        res.send('ok')
    } catch (error) {
        console.error(error);
    }
});



router.post('/create', async (req, res) => {
    const {com_seq} = req.body; // 입력 데이터의 바코드 배열

    try {
        const result = await Loading.findAll({
            where: {
               loading_type : null,
               com_seq : com_seq
            },   include: [{
                model: Stock
            }]
        });
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});


// (in_01)입고 에정 페이지 : 등록버튼 누르고 입고 페이지로 넘기기  => 이후 입고 페이지에서 추가정보 등록 후 입고처리
router.post('/send/loading', async (req, res, next) => {
    let { stock_barcode, com_seq, stock_seq } = req.body;
    

    try { // 등록클릭 > 로딩타입 B로 row 생성
        const result2 = await Loading.update(
            { loading_type: 'B' }, // 업데이트할 데이터
            { 
                where: { 
                    stock_seq: stock_seq,
                    com_seq: com_seq
                } // 업데이트할 조건
            }
        );
        const io = req.app.get('io');
        io.of('/in').emit('updateIn', '입고등록완료');
        res.json(result2);
    } catch (error) {
        console.log(error);
    }

});


// (in_02) : in_01에서 등록 누른 제품들만 보여주기

router.post('/get/loading', async (req, res) => {

    let com_seq = req.body.com_seq

    try {
        console.log("in_02 : com_seq", com_seq);

        const result = await Loading.findAll({
            where: {
                loading_type: 'B',
                com_seq: com_seq
            },
            include: [{
                model: Stock
            }]
        })
        res.json(result)
    } catch (error) {
        console.log(error);
    }
})

//  (in_02) : 입고취소 : 입고취소 버튼 클릭시 입고 예정 리스트로 데이터 보내기
router.post('/del/loaing', async (req, res) => {
    let stock_seq = req.body.stock_seq
    try {
        console.log('입고취소요', stock_seq)
        const result = await Loading.update(
            {
                loading_type: null,
            },
            {
                where: {
                    stock_seq: stock_seq,
                },
                include: [
                    {
                        model: Stock,
                    },
                ],
            }
        );
        const io = req.app.get('io');
        io.of('/in').emit('updateIn', '입고취소완료');
        res.json(result)
    } catch (error) {
        console.log('입고취소 에러', error);
    }
})

// (in_02) :  추가정보 입력 후 입고등록
router.post('/loading', async (req, res) => {
    let { rack_seq, loading_seq, loading_floor, loading_position, loading_manager, com_seq } = (req.body)
    try {
    const result2 = await Loading.update(
        
        { 
            loading_type: 'I',
            rack_seq: rack_seq,
            loading_floor: loading_floor,
            loading_position: loading_position,
            loading_manager: loading_manager,
     }, // 업데이트할 데이터
        { 
            where: { 
                loading_seq: loading_seq,
                com_seq: com_seq
            } // 업데이트할 조건
        }
    );
    // socket -------------------
    // const io = req.app.get('io');
    // io.of('/in').emit('updateLoading', '여기?');
    // --------------------------
    res.json(result2);
} catch (error) {
    console.log(error);
}

    // try {
    //     console.log('loading', req.body);
    //     const result = await Loading.create({
    //         rack_seq: rack_seq,
    //         loading_type: "I",
    //         stock_seq: stock_seq,
    //         loading_floor: loading_floor,
    //         loading_position: loading_position,
    //         loading_manager: loading_manager,
    //         com_seq: com_seq
    //     })

    //     res.json(result)
    // } catch (error) {
    //     console.error(error);
    // }
})

router.patch('/position', async (req, res) => {
    let { stock_seq, x, z, y, rack_seq } = req.body;
    let loading_floor = parseInt(y);
    let loading_position = [x, z].join(',')
    try {
        await Loading.update({
            loading_type: 'I',
            loading_floor: loading_floor,
            loading_position: loading_position,
            rack_seq: rack_seq,
        }, {
            where: { stock_seq: stock_seq }  
        })
        const io = req.app.get('io');
        io.of('/in').emit('updateIn', '입고완료');
        res.send('ok')
    } catch (error) {
        console.error(error);
    }
})

module.exports = router