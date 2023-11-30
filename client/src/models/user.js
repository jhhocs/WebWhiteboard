// user.js
const { getDb } = require("./database");

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static async getAllUsers() {
    try {
      const db = getDb();
      return await db.collection("users").find({}).toArray();
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  static async createUser(username, email) {
    try {
      const db = getDb();
      const result = await db
        .collection("users")
        .insertOne({ username, email });
      return new User(result.insertedId, username, email);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = User;
