import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import router from "./router/index.js";

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

//Express.js
const app = express();
app.use(express.json()).use(cors()).use("/api", router);

//Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e10,
});

io.on("connect", (socket) => {
  console.log("connected");
  socket.on("join", (user_id) => {
    socket.join(`room-${user_id}`);
    console.log("join");
  });
  socket.on("sendMessage", (message, callback) => {
    callback();
    socket.join(`room-${message.receiver}`);
    //io.to(`room-${message.receiver}`).emit("message", { message });
    socket.broadcast
      .to("")
      .to(`room-${message.receiver}`)
      .emit("message", { message });
    console.log("message sended");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

//Mongodb
mongoose.set("strictQuery", true);
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started");
    });
  })
  .catch((e) => {
    console.log(e);
  });
