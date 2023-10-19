const bcrypt = require('bcrypt')
const passport = require('passport')
const { User, Company } = require('../models')

exports.join = async (req, res, next) => {
  console.log('요청');
  let { user_id, user_pw, user_nick, user_cname } = req.body
  try {
    const exUser = await User.findOne({
      where: {
        user_id: user_id,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(user_pw, 12);
    await User.create({
      user_id: user_id,
      user_pw: hashedPassword,
      user_nick: user_nick,
      user_cname: user_cname,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { user_id: user.user_id },
        attributes: {
          exclude: ['user_pw']
        },
        include: [{
          model: Company
        }]
      })
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
}

exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.send('ok');
  });
}

exports.checkId = async (req, res) => {
  try {
    const checkId = await User.findOne({
      where: { user_id: req.body.id } 
    })
    if (checkId === null) {
      res.send('회원가입 가능')
    } else {
      res.send('아이디 중복')
    }
  } catch (error) {
    console.error(error);
  }
}

exports.updateUser = async (req, res) => {
  let { currentPW, newPW, nick } = req.body
  try {
    const result = await bcrypt.compare(currentPW, req.user.user_pw);
    if (result) {
      if (newPW) {
        const hashedPassword = await bcrypt.hash(newPW, 12);
        if (nick) {
          await User.update({
            user_pw: hashedPassword,
            user_nick: nick
          }, {
            where: {
              user_id: req.user.user_id
            }
          })
          res.send('ok')      
        } else {
          await User.update({
            user_pw: hashedPassword,
            user_nick: req.user.user_nick
          }, {
            where: {
              user_id: req.user.user_id
            }
          })
          res.send('ok')  
        }
      } else {
        res.send('새로운 비밀번호를 입력하세요.')
      }
    } else {
      res.send('기존 비밀번호가 일치하지 않습니다.')
    }
  } catch (error) {
    console.error(error);
  }
}