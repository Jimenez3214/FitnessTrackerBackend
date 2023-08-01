const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine } = require('../db')
const jwt = require('jsonwebtoken')

// GET /api/routines

router.get('/', async (req, res, next) => {

    try {
        const routines = await getAllPublicRoutines();
        res.send(
            routines
        )
    } catch (error) {
        next(error)
    }

})
// POST /api/routines

router.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body

    try {
        if (typeof req.headers.authorization !== 'undefined') {
            const bearerHeader = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)
            console.log(decoded)
            const newRoutine = await createRoutine({ creatorId: decoded.id, isPublic, name, goal })
            console.log(newRoutine)
            res.send(newRoutine)
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
})

// PATCH /api/routines/:routineId

router.patch('/:routineId', async (req, res, next) => {
    if (!req.headers.authorization) {
        next()
    }

    const { routineId } = req.params
    const { isPublic, name, goal } = req.body

    try {
        const bearerHeader = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)

        const routine = await getRoutineById(routineId)
        console.log(routine)

        if (routine.creatorId === decoded.id) {
            const updatedRoutine = await updateRoutine({
                id: routineId,
                isPublic: isPublic,
                name: name,
                goal: goal
            })

            console.log(updatedRoutine)
            res.send(updatedRoutine)
        } else {
            res.status(403).send({
                error: 'ERROR',
                message: `User ${decoded.username} is not allowed to update ${routine.name}`,
                name: 'UNAUTHORIZED USER'
            })
        }
    } catch (error) {
        next(error)
    }
})

// DELETE /api/routines/:routineId

router.delete('/:routineId', async (req, res, next) => {
    if (!req.headers.authorization) {
        next()
    }

    const { routineId } = req.params

    try {
        const bearerHeader = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)

        const routine = await getRoutineById(routineId)
        console.log(routine)

        if (routine.creatorId === decoded.id) {
            await destroyRoutine(routineId)

            res.send(routine)
        } else {
            res.status(403).send({
                error: 'ERROR',
                message: `User ${decoded.username} is not allowed to delete ${routine.name}`,
                name: 'UNAUTHORIZED USER'
            })
        }
    } catch (error) {
        next(error)
    }
})

// POST /api/routines/:routineId/activities

module.exports = router;
