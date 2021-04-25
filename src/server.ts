//Node libs
import { createServer } from "http";
import path from "path";

import express from "express";
import { Server, Socket } from "socket.io";

// My files
import "./database";
import { routes } from "./routes";
import e from "express";

const PORT = 3333;
const app  = express();
const http = createServer(app); // Criando o protocolo http
const ws   = new Server(http);  // Criando o protocolo WS (Websocket)

ws.on("connection", (socket: Socket) => {
  console.log("Connected in", socket.id);
});

const publicDir = path.join(__dirname,"..","public");

//Configurações para podermos criar rotas que entreguem views html da pasta ./public
app.use(express.static(publicDir));
app.set("views", publicDir);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  return res.render("html/client.html");
});

app.use(express.json());
app.use(routes);

http.listen(PORT, () => console.log(`Server is running on port ${PORT}`));