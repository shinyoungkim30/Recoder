const passport = require('passport')
const local = require('./localStrategy')
const User = require('../models/user')

module.exports = () => {
  passport.serializeUser((user, done) => {
      done(null, user.user_id)
  })

  passport.deserializeUser(async (user_id, done) => {
    try {
        const user = await User.findOne({ where: { user_id }});
        done(null, user); // req.user
      } catch (error) {
        console.error(error);
        done(error);
      }
  })

  local()
}