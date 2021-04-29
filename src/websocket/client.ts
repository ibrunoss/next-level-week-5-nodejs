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
      connection.adminId = null;
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
    
    const allMessages = await messagesService.listByUser(userId);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsService.findAllWithoutAdmin();

    ws.emit("admin_list_all_users", allUsers);
  });
  
  socket.on("client_send_to_admin", async ({ text, socketId, email }) => {
    const userId  = await usersService.create(email).then(user => user.id);
    const message = await messagesService.create({
      userId,
      adminId: socketId,
      text
    });
 
    ws.to(socketId).emit("admin_receive_message", {
      message,
      socket: socket.id
    });
  });
  
});