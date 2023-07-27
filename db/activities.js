const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `, [name, description]);

    return activity
  } catch (error) {
    console.error(error)
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM activities;
    `);

    return rows
  } catch (error) {
    console.error(error)
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=${id};
    `);

    return activity;
  } catch (error) {
    console.error(error);
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT * 
    FROM activities
    WHERE name=$1;
    `, [name]);

    return activity;
  } catch (error) {
    console.error(error);
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routine) {

  try {
    const { rows: activities } = await client.query(`
    SELECT activities.*
    FROM activities
    JOIN routine_activities ON activities.id=routine_activities."activityId"
    WHERE routine_activities."routineId"=${routine.id};
    `);

    const { rows: routine_activities } = await client.query(`
    SELECT routine_activities.*
    FROM routine_activities 
    JOIN activities ON routine_activities."activityId"=activities.id
    WHERE routine_activities."routineId"=${routine.id};
    `);

    activities.map(activity => routine_activities.filter(routine_activity => {
      if (activity.id === routine_activity.activityId) {
        activity.count = routine_activity.count
        activity.duration = routine_activity.duration
        activity.routineId = routine_activity.routineId
        activity.routineActivityId = routine_activity.id
      }
    }))


    routine.activities = activities;
    return activities;
  } catch (error) {
    console.error(error);
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');


  try {
    const { rows: [updatedActivity] } = await client.query(`
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return updatedActivity;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
