const express = require('express')
const router = express.Router()
// const User = require('../models/user');
const { Notice, User, Warehouse, Rack, Loading, Stock, Company, sequelize, Sequelize } = require('../models'); // 모델들을 import
const { Op, fn, col, literal } = require('sequelize');

// 알림 내용 가져오기
router.post('/alarm', async (req, res) => {
    console.log('user_seq', req.body.user_seq)
    let user_seq = req.body.user_seq
    try {
        const result = await Notice.findAll({
            attributes: ['notice_content','notice_seq'],
            include: [
                {
                    model: Stock,
                    attributes: ['stock_name'],
                    include: [
                        {
                            model: Loading,
                            attributes: [],
                        },
                    ],
                },
            ],
            where: {
                user_seq: user_seq,
            },
        });
        // 결과를 클라이언트에 응답
        res.json(result);
    } catch (error) {
        console.error('오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 알림 수량 변경
router.post('/change', async (req, res) => {
    console.log('알람변경', req.body);
    let { user_seq, stock_name, notice_content } = req.body;
    try {
        // 먼저 해당 유저와 재고 이름에 대한 알림 정보를 조회합니다.
        const result = await Notice.findOne({
            attributes: ['notice_content', 'notice_seq'],
            include: [
                {
                    model: Stock,
                    attributes: ['stock_name'],
                    where: { stock_name: stock_name },
                    include: [
                        {
                            model: Loading,
                            attributes: [],
                        },
                    ],
                },
            ],
            where: {
                user_seq: user_seq,
            },
        });

        if (!result) {
            return res.status(404).json({ error: '해당 알림을 찾을 수 없습니다.' });
        }

        // 알림 정보가 있는 경우 알림 내용을 업데이트합니다.
        const notice_seq = result.notice_seq;
        await Notice.update(
            {
                notice_content: notice_content,
            },
            {
                where: {
                    notice_seq: notice_seq,
                },
            }
        );

        // 업데이트된 결과를 클라이언트에 응답
        res.json({ success: true, message: '알림 내용이 업데이트되었습니다.' });
    } catch (error) {
        console.error('오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 입고제품 리스트 조회
router.post('/list', async (req, res) => {
    console.log('com_seq', req.body.com_seq)
    try {
        const com_seq = req.body.com_seq;

        // Full Outer Join을 사용하여 stock_name을 가져오는 SQL 쿼리를 작성합니다.
        const result = await sequelize.query(`
              SELECT DISTINCT s.stock_name FROM stock AS s
            JOIN loading AS l ON l.stock_seq = s.stock_seq
              WHERE l.loading_type = 'I'  AND l.com_seq = ${com_seq}
            `);


        res.json(result);
    } catch (error) {
        console.error('오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }

  
});

// 입고재품 재고량 조회
router.post('/create', async (req, res) => {
    //     console.log(req.body);
    //     let { com_seq, wh_seq } = req.body
    //     let stockNames = req.body.stock_name;

    //     try {
    //         const results = await Promise.all(stockNames.map(async (stockName) => {
    //             const result = await Loading.sum('loading_cnt', {
    //                 include: [
    //                     {
    //                         model: Stock,
    //                         where: {
    //                             stock_name: stockName,
    //                         },
    //                     },
    //                 ],
    //                 where: {
    //                     loading_type: 'I',
    //                     com_seq: com_seq,
    //                 },
    //             });
    //             return { stockName, sum: result };
    //         }));

    //         console.log('각 stock_name 별 합계:');
    //         results.forEach(({ stockName, sum }) => {
    //             console.log(`${stockName}: ${sum}`);
    //         });

    //         // 클라이언트에게 결과 응답을 보내줍니다.
    //         res.json(results);
    //     } catch (error) {
    //         console.error('오류:', error);
    //         res.status(500).json({ error: '서버 오류' }); // 에러가 발생한 경우 500 상태 코드와 에러 메시지를 응답합니다.
    //     }
    // });
    let { com_seq, wh_seq } = req.body
    try {
        const result = await Loading.findAll({
            attributes: [
                [fn('SUM', col('loading_cnt')), 'total_loading_cnt']
            ],
            where: {
                com_seq: com_seq,
                [Op.or]: [
                    { loading_type: 'I' },
                    // { loading_type: 'O' }
                  ]
                
            },
            include: [{
                model: Stock,
                attributes: ['stock_name', 'stock_name'],
            }],
            group: 'stock_name'
        });
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;