import { createServer } from "http";
import path from "path";
import express from "express";
import { Server, Socket } from "socket.io";

import "./database";
import { routes } from "./routes";

const app  = express();
const http = createServer(app);
const ws   = new Server(http);

ws.on("connection", (socket: Socket) => {
  console.log("Connected in", socket.id);
});

const publicDir = path.join(__dirname,"..","public");

app.use(express.static(publicDir));
app.set("views", publicDir);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/client", (req, res) => {
  return res.render("html/client.html");
});
app.get("/admin", (req, res) => {
  return res.render("html/admin.html");
});

app.use(express.json());
app.use(routes);

export { http, ws };