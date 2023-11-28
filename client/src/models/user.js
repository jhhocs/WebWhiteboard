// user.js
const mysql = require('mysql');

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static getAllUsers() {
    // Implement logic to fetch all users from the database
  }

  static createUser(username, email) {
    // Implement logic to create a new user in the database
  }
}

module.exports = User;
