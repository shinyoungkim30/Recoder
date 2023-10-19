const express = require('express')
const router = express.Router()
// const User = require('../models/user');
const { User, Warehouse, Rack, Loading, Stock, Company, sequelize } = require('../models'); // 모델들을 import
const { Op, fn, col,literal } = require('sequelize');


// 출고 메인 페이지 => 출고될 리스트 조회
// router.post('/create', async (req, res) => {
// //    let user_id = req.user.user_id
//     let wh_seq = (req.body.wh_seq)
//     console.log('req', wh_seq);


//     try {
//         const result = await Warehouse.findAll({
//             where: {
//                 wh_seq: wh_seq
//             },
//             attributes: ['wh_seq', 'wh_name'],
//             include: [{
//                 model: Rack,
//                 include: [{
//                     model: Loading,
//                     where: {
//                         loading_type: 'I',
//                     },
//                     include: [{
//                         model: Stock
//                     }]
//                 }]
//             }]
//         })

//         const result2 = await Loading.findAll({
        
//             attributes:[fn('DISTINCT',col('stock_shipping_des')),'stock_shipping_des'],
//             where:{
//                 com_seq:com_seq,
//                 loading_type:'I'
//             }
//         })

//         res.json(result)
//     } catch (error) {
//         console.error(error);
//     }

// })


router.post('/create', async (req, res) => {
    //    let user_id = req.user.user_id
        // let{wh_seq,com_seq }= (req.body.outData)
        console.log('req', req.body);
    
    
            const q = Warehouse.findAll({
                where: {
                    wh_seq: req.body.wh_seq
                },
                attributes: ['wh_seq', 'wh_name'],
                include: [{
                    model: Rack,
                    include: [{
                        model: Loading,
                        where: {
                            loading_type: 'I',
                        },
                        include: [{
                            model: Stock
                        }]
                    }]
                }]
            })
            const q2 = Loading.findAll({
            
                attributes:[fn('DISTINCT',col('stock_shipping_des')),'stock_shipping_des'],
                where:{
                    com_seq:req.body.com_seq,
                    loading_type:'O'
                }
            })
    
            return Promise.all([q,q2])
            .then(([result1,result2])=>{
                res.json({result1,result2})

            })
            .catch(error=>{
                console.log("에러",error);
            })

    })
    

// 출고버튼 클릭(출고 등록)
router.post('/create/loading', async (req, res) => {

    try {
        console.log(req.body);
        const outLoading = await Loading.update(
            {
                loading_type: 'O',
                out_created_at: req.body.created_at,
                loading_cnt: req.body.loading_cnt,
                stock_shipping_des: req.body.stock_shipping_des,
                loading_manager: req.body.loading_manager,
                loading_floor: null,
                loading_position: null,
            },
            {
                where: {
                    loading_seq: req.body.loading_seq
                }

            })

        console.log(outLoading);
        // socket -------------------------
        const io = req.app.get('io');
        io.of('/out').emit('updateOut', '출고완료');
        // --------------------------------
        res.json(outLoading)
    } catch (error) {
        console.log(error);
    }
})



// 출고이력 페이지 - 모든 출고 리스트 조회
router.post('/controll', async (req, res) => {

    let { id, wh_seq } = req.body;
    console.log("aaaaaaaaa", req.body);
    try {
        const outControllList = await User.findAll({
            attributes: ['com_seq'],
            where: {
                user_id: id
            },
            include: [{
                model: Company,
                include: [{
                    model: Warehouse,
                    where: {
                        wh_seq: wh_seq
                    },
                    attributes: ['wh_seq', 'wh_name']
                    ,
                    include: [{
                        model: Rack,

                        include: [{
                            model: Loading,
                            where: {
                                loading_type: 'O'
                            },
                            include: [{
                                model: Stock,

                            }]
                        }]
                    }]
                }]

            }]
        });
        console.log(outControllList);
        res.json(outControllList)
    } catch (error) {
        console.error(error);
    }


})

// 출고품 관리 페이지 -- 창고별
router.post('/des', async (req, res) => {

    console.log('des 1번 함수',req.body);
    let { com_seq, wh_seq } = req.body;
    try {
        const desDetail = await Warehouse.findAll({
            where: {
                wh_seq: wh_seq,
            },
            attributes :['wh_name'],
            include: [
                {
                    model: Rack,
                    attributes: ['rack_seq'],
                    include: [
                        {
                            model: Loading,
                            where: { loading_type: 'O' },
                            attributes : 
                                ['stock_shipping_des','out_created_at']
                               , 
                            include: [
                                {
                                    model: Stock,
                                   attributes :[ 
                                    'stock_name','stock_kind'
                                   ]
                                }
                            ]
                        }
                    ]

                }

            ],
        })
        console.log(desDetail);
        res.json(desDetail)
    } catch (error) {
        console.error(error);
    }
})


// 💥 stock_name 당 정보 가져오기 
router.post('/des/name', async (req, res) => {
    console.log("1번",req.body);
    let { wh_seq,com_seq } = req.body;
  
    try {
        const sNameList = await Warehouse.findAll({
            attributes:
               [ 
               ]
              ,
              include: [
                {
                  model: Rack,
                 
                  where: {
                    wh_seq: wh_seq,
                  },
                  include: [
                    {
                      model: Loading,
                      attributes:[ 
                        [fn('SUM',col('loading_cnt')), 'total_loading_cnt'],'out_created_at']
                      ,
                      where: {
                        loading_type: 'O',
                  

                      },
                      include: [
                        {
                          model: Stock,
                        },
                      ],
                    },
                  ],
                },
              ],
              group: ['stock_name'],
              order: [
                [col('out_created_at'), 'DESC'],
                // [col('total_loading_cnt'), sort],
              ],
            });
        console.log( sNameList);
        res.json( sNameList)
    } catch (error) {
        console.error(error);
    }



})


router.post('/des/count', async (req, res) => {
  

    let { wh_seq, stock_name } = req.body;

    try {
      const result = await Stock.findAll({
        attributes: [
          [fn('SUM', col('loading_cnt')), 'total_loading_cnt']
        ],
        where: {
          stock_name: stock_name
        },
        include: [{
          model: Loading,
          attributes: ['stock_shipping_des', 'loading_cnt'],
          where: {
            loading_type: 'O'
          },
          include: [{
            model: Rack,
            attributes: [],
            where: {
                wh_seq: wh_seq
              },
            include: [{
              model: Warehouse,
              attributes:['wh_seq'],
             
            }]
          }],
        }],
        group: 'stock_shipping_des'
      });
      res.json(result);
    } catch (error) {
      console.error(error);
    }
  });



module.exports = router