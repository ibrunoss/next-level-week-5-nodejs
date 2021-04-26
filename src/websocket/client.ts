import { Socket } from "socket.io";
import { ws } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

interface IParams {
  text: string;
  email: string;
}

ws.on("connect", (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();
  
  socket.on("client_first_access", async (params: IParams) => {
    const { text, email } = params;
    const socketId = socket.id;
    const userId = await usersService.create(email).then(user => user.id);
    const connection = await connectionsService.findByUserId(userId);

    if (connection) {
      connection.socketId = socketId;
      await connectionsService.create(connection);
    } else {
      await connectionsService.create({
        socketId,
        userId
      });
    }

    await messagesService.create({
      userId,
      text
    });
    
  })
});