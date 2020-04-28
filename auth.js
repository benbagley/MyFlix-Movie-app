const jwtSecret = 'your_jwt_secret'; // same key as in JWTStrategy

const jwt = require('jsonwebtoken');
passport = require('passport');

require('.passport'); // local passportfile

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // this is the username generated in the JWT
    expiresIn: '7d',
    algorithm: 'HS256' // to encode JWT's values
  });
}

/* POST login */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error,
    user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user : user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}