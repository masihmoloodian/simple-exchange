const io = require("socket.io")();
const PORT = 5000;

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Emit random prices for BTC and ETH every second
  setInterval(() => {
    const btcUsdPrice = Math.random() * 40000;
    const btcEurPrice = btcUsdPrice * 0.82;
    const ethUsdPrice = Math.random() * 2000;
    const ethEurPrice = ethUsdPrice * 0.82;

    socket.emit("price", {
      BTC: {
        USD: {
          amount: btcUsdPrice
        },
        EUR: {
          amount: btcEurPrice
        },
      },
      ETH: {
        USD: {
          amount: ethUsdPrice
        },
        EUR: {
          amount: ethEurPrice
        },
      },
    });
  }, 1000);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

io.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
