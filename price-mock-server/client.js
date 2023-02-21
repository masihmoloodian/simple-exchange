const io = require("socket.io-client");

const socket = io.connect("http://localhost:5000", { reconnect: true });

socket.on("price", (msg) => {
  console.log({ msg });
});
