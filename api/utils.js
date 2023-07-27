const jwt = require('jsonwebtoken');

function checkForToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) {
    next()
  } else {
    jwt.verify(token, process.env.JWT_SECRET) => {
      req.user = user

      next()
    }
  }


  module.exports = {
    checkForToken
  }