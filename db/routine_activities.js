const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  duration,
  count,
}) {
  try {

    const { rows: [routine_activity] } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", duration, count)
    SELECT routines.id, activities.id, ${duration}, ${count}
    FROM routines
    JOIN activities ON routines.id=activities.id
    ON CONFLICT ("routineId", "activityId") DO UPDATE
    SET 
    RETURNING *; 
    `);

    // const { rows: [routine_activity] } = await client.query(`
    // INSERT INTO routine_activities ("routineId", "activityId", duration, count)
    // VALUES ($1, $2, $3, $4)
    // RETURNING *;
    // `, [routineId, activityId, duration, count])

    return routine_activity;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutineActivityById(id) { }

async function getRoutineActivitiesByRoutine({ id }) { }

async function updateRoutineActivity({ id, ...fields }) { }

async function destroyRoutineActivity(id) { }

async function canEditRoutineActivity(routineActivityId, userId) { }

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
