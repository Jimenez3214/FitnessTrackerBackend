const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username,password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  // let userToAdd = {username, hashedPassword}

  try{
  const {rows:[ user ]} = await client.query(`
  INSERT INTO users(username, password)
  VALUES ($1,$2)
  ON CONFLICT (username) DO NOTHING
  RETURNING *; 
  `, [username, hashedPassword])
      return user;
    } catch(error){
      console.error(error)
    }
}

async function getUser({ username, password }) {
try{
  const{rows: [user] } = await client.query(`
  SELECT (username, password)
  FROM users;
  `)
  console.log('Users pulled', user)
  
}catch(error){
console.error(error)
}

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
