const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const robot = require("robotjs");

const PORT = process.argv[2] || 8080;

app.use(express.static("public"));

const { width, height } = robot.getScreenSize();

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("app:click", () => {
    robot.mouseClick();
  });

  socket.on("app:touchmove", (data) => {
    let { x, y } = robot.getMousePos();

    const tmpX = x - data[0];
    const tmpY = y - data[1];

    if (width > tmpX && tmpY >= 0) {
      x = tmpX;
    }

    if (height > tmpY && tmpY >= 0) {
      y = tmpY;
    }

    robot.moveMouse(x, y);
  });
});

http.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
