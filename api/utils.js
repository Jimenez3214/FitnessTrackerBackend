const jwt = require('jsonwebtoken');

function checkForToken(req, res, next) {
  const token = req.body.token || req.query.token || req.headers["x-acces-token"];
  try {
    if (!token) {
      res.status(401).send({
        error: "ERROR",
        message: "You must be logged in to perform this action",
        name: "UNAUTHORIZED"
      })
      next()
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next()
    }
  } catch (error) {
    console.log(error)
  }
}





module.exports = {
  checkForToken
}