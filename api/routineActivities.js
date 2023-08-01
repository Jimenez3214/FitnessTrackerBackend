const express = require('express');
const { canEditRoutineActivity, updateRoutineActivity, getRoutineActivityById } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {
  //
  const { routineActivityId } = req.params
  const { count, duration } = req.body
  try {
    const bearerHeader = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)

    const verifyUser = await canEditRoutineActivity({ routineActivityId, id: decoded.id })
    console.log(verifyUser)
    if (verifyUser) {

    } else {
      res.send({
        message: `User ${decoded.username} is not allowed to update `
      })
    }
  } catch (error) {
    next(error)
  }
})

// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
