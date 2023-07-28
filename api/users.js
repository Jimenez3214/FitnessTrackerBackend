/* eslint-disable no-useless-catch */
// require('dotenv').config();
const express = require("express");
const { getUserByUsername, createUser, getUser, getUserById } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkForToken } = require("./utils");

// POST /api/users/register

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.send({
        "error": "ERROR",
        "message": `User ${_user.username} is already taken.`,
        "name": "UserExistsError"
      })
    }

    else if (password.length < 8) {
      res.send({
        "error": 'ERROR',
        "message": 'Password Too Short!',
        "name": 'PasswordTooShortError',
      })
    }
    else {
      const user = await createUser({ username, password });
      console.log(user)
      const token = jwt.sign({
        id: user.id,
        username
      },
        process.env.JWT_SECRET, {
        expiresIn: '1w'
      });

      res.send({
        "message": 'Thanks for signing up!',
        "token": token,
        "user": {
          "id": user.id,
          username
        }
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// POST /api/users/login

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });
    console.log(user)
    if (user) {
      const token = jwt.sign({
        id: user.id, username: user.username
      },
        process.env.JWT_SECRET);

      res.send({
        "user": {
          "id": user.id,
          "username": username,

        },
        message: "you're logged in!", token
      });
    }
  } catch (error) {
    next(error)
  }
})

// GET /api/users/me

router.get('/me', checkForToken, async (req, res, next) => {

  console.log(req.user)

})

// GET /api/users/:username/routines

module.exports = router;
