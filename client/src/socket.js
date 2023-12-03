import io from "socket.io-client"

const URL = "https://webwhiteboard.onrender.com";
// const URL = "http://localhost:3001"; // For local testing

export const socket = io(URL);