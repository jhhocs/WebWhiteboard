const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:3000/WB-database";
const dbName = "WB-database";

let db;

const connectToMongo = async () => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const getDb = () => {
  if (!db) {
    throw Error("No database connection");
  }
  return db;
};

module.exports = { connectToMongo, getDb };
