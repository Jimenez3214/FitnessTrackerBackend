const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal])

    return routine;
  } catch (error) {
    console.error(error)
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=${id};
    `);

    const { rows: [username] } = await client.query(`
    SELECT username
    FROM users
    JOIN routines ON users.id=routines."creatorId"
    WHERE routines."creatorId"=${routine.creatorId};
    `);

    routine.creatorName = username.username;
    return routine;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM routines;
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: ids } = await client.query(`
    SELECT id
    FROM routines;
    `);

    const routines = await Promise.all(ids.map(routine =>
      getRoutineById(routine.id)
    ));

    await Promise.all(routines.map(routine =>
      routine.activities = attachActivitiesToRoutines(routine)
    ));

    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: ids } = await client.query(`
    SELECT id 
    FROM routines
    WHERE "isPublic"=true;
    `);

    const routines = await Promise.all(ids.map(routine =>
      getRoutineById(routine.id)
    ));

    await Promise.all(routines.map(routine =>
      routine.activities = attachActivitiesToRoutines(routine)
    ));


    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: ids } = await client.query(`
    SELECT routines.id
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username=$1;
    `, [username]);

    const userRoutines = await Promise.all(ids.map(routine =>
      getRoutineById(routine.id)
    ));

    await Promise.all(userRoutines.map(routine =>
      routine.activities = attachActivitiesToRoutines(routine)
    ));

    return userRoutines;
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: ids } = await client.query(`
    SELECT routines.id
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username=$1
    AND "isPublic"=true;
    `, [username]);

    const userRoutines = await Promise.all(ids.map(routine =>
      getRoutineById(routine.id)
    ));

    await Promise.all(userRoutines.map(routine =>
      routine.activities = attachActivitiesToRoutines(routine)
    ));

    return userRoutines;
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: ids } = await client.query(`
    SELECT routines.id
    FROM routines
    JOIN routine_activities ON routines.id=routine_activities."routineId"
    WHERE routine_activities."activityId"=$1
    AND "isPublic"=true;
    `, [id]);

    const routines = await Promise.all(ids.map(routine =>
      getRoutineById(routine.id)
    ));

    await Promise.all(routines.map(routine =>
      routine.activities = attachActivitiesToRoutines(routine)
    ));

    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  try {
    const { rows: [updatedRoutine] } = await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return updatedRoutine;
  } catch (error) {
    console.error(error);
  }
}

async function destroyRoutine(id) {

  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=${id};
    `);
    await client.query(`
    DELETE FROM routines
    WHERE id=${id};
    `);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
