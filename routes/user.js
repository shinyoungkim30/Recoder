const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Company, Warehouse, Rack } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, join, logout, checkId, updateUser } = require('../controllers/auth');

const router = express.Router()

router.get('/test', async (req, res, next) => {
  try {
    res.send('ok')
  } catch (error) {
    console.error(error);
  }
})

// 로그인한 상태에서 사용자 정보 불러오기 (로그인 안하면 null 리턴)
router.get('/', async (req, res, next) => { // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { user_id: req.user.user_id },
        attributes: {
          exclude: ['user_pw']
        },
        include: [{
          model: Company,
          include: [{
            model: Warehouse,
            include: [{
                model: Rack
            }]
          }]
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, login);

router.post('/', isNotLoggedIn, join);

router.post('/logout', isLoggedIn, logout);

// 아이디 중복체크
router.post('/checkid', checkId)

// 회원 정보 수정
router.patch('/', isLoggedIn, updateUser);

// 닉네임 요청
router.get('/info', async (req, res, next) => {
  const userNick = await User.findAll({
    where: { user_seq: req.user?.user_seq },
    attributes: ['user_nick'],
    include: [{
      model: Company,
      attributes: ['com_name'],
    }],
  })
  res.json({userNick})
})

module.exports = router