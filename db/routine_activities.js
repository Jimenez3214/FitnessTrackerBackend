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
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `, [routineId, activityId, duration, count]);

    // const { rows: [routine_activity] } = await client.query(`
    // INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    // SELECT routines.id, activities.id, ${count}, ${duration}
    // FROM routines
    // JOIN activities ON routines.id=${routineId}
    // AND activities.id=${activityId}
    // ON CONFLICT ("routineId", "activityId") DO NOTHING
    // RETURNING *; 
    // `);
    return routine_activity;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
  SELECT * 
  FROM routine_activities
  WHERE id=$1;
  `, [id]);
    return routine_activity;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activity } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId" = $1;
  `, [id]);

    return routine_activity;
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  console.log(fields)
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  try {
    const { rows: [routine_activity] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));


    return routine_activity
  } catch (error) {
    console.error(error)
  }

}


async function destroyRoutineActivity(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id]);

    return routine_activity;

  } catch (error) {
    console.error(error)
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    // const { rows: [routine_activity] } = await client.query(`
    //   SELECT routine_activities.*
    //   FROM routine_activities
    //   JOIN routines ON routines.id = routine_activities."routineId" 
    //   WHERE routines."creatorId"=$1;
    //   `, [userId]);

    const { rows: [routine] } = await client.query(`
    SELECT routines.*
    FROM routines
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routine_activities.id=$1;
    `, [routineActivityId])

    if (routine.creatorId === userId) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
