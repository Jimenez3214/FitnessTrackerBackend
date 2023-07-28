const express = require('express');
const router = express.Router();
const {getAllPublicRoutines, createRoutine} = require('../db')
// GET /api/routines
router.get('/routines', async (req, res, next)=>{
    try{
        const routines = await getAllPublicRoutines();
        res.send({
            routines,
        });
    }catch(error){
        next(error)
    }
})
// POST /api/routines
router.post('/routines', async (req, res, next )=>{
    
})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
