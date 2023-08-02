const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
    const { rows: [user] } = await client.query(`
  INSERT INTO users(username, password)
  VALUES ($1,$2)
  RETURNING *; 
  `, [username, hashedPassword])
    delete user.password;

    return user;
  } catch (error) {
    console.error(error)
  }
}

async function getUser({ username, password }) {

  const user = await getUserByUsername(username)
  const hashedPassword = user.password;

  const isValid = await bcrypt.compare(password, hashedPassword)
  if (!isValid) {
    return false;
  } else {
    delete user.password;
    return user;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(
      `SELECT id, username, password
      FROM users
      WHERE id =${userId}
      
      `);
    if (!user) {
      return null;
    } else {
      delete user.password;
    }
    return user;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function getUserByUsername(userName) {

  try {
    const { rows: [user] } = await client.query(`
  SELECT * 
  FROM users 
  WHERE username=$1;
  `, [userName]
    );

    return user
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
