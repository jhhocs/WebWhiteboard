const readline = require("readline");
const User = require("./models/user");
const { connectToMongo } = require("./config/database");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

connectToMongo().then(() => {
  rl.question("Enter username: ", (username) => {
    rl.question("Enter email: ", async (email) => {
      try {
        const newUser = await User.createUser(username, email);
        console.log("New user created:", newUser);
        rl.close();
      } catch (error) {
        console.error("Error creating user:", error);
        rl.close();
      }
    });
  });
});
