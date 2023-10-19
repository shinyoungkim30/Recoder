const express = require('express')
const { Company, User } = require('../models')

const router = express.Router()

router.get('/:comNum', async (req, res, next) => {
  try {
    const removeHyphens = req.params.comNum.replaceAll('-', '')
    const result = await Company.findAll({
      where: {
        com_business_num: removeHyphens
      }
    })
    console.log(result);
    res.json(result)
  } catch (error) {
    console.error(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    let { com_business_num, com_name, com_address, com_tel } = req.body;
    if (com_name && com_business_num) {
      const result = await Company.findOne({
        where: { com_business_num: com_business_num }
      })
      if (!result) {
        const result2 = await Company.create({
          com_business_num: com_business_num,
          com_name: com_name,
          com_address: com_address,
          com_tel: com_tel,
        })
        await User.update({
          com_seq: result2.com_seq
        }, {
          where: {
            user_seq: req.user.user_seq
          }
        })
        res.send('ok')
      } else {
        res.send('이미 등록된 기업입니다.')
      }
    } else {
      res.send('기업명 또는 사업자등록번호를 입력해주세요.')
    }
  } catch (error) {
    console.error(error);
  }
})

module.exports = router