const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'user_id',
    passwordField: 'user_pw'
  }, async (user_id, user_pw, done) => {
    try {
      const user = await User.findOne({
        where: { user_id }
      });
      if (!user) {
        return done(null, false, { reason: '존재하지 않는 아이디입니다!' });
      }
      const result = await bcrypt.compare(user_pw, user.user_pw);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }))
}