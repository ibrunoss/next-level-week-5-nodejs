import { Socket } from "socket.io";
import { ws } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

ws.on("connect", async (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService    = new MessagesService();

  const allConnections = await connectionsService.findAll();

  ws.emit("admin_list_all_users", allConnections);

  socket.on("admin_list_messages_by_user", async (params, cb) => {
    const { userId }  = params;
    const allMessages = await messagesService.listByUser(userId);

    cb(allMessages);
  });
  
  socket.on("admin_send_message", async params => {
    const { userId, text }  = params;

    const adminId = socket.id;

    await messagesService.create({ 
      adminId,
      userId,
      text
    });

    const { socketId } = await connectionsService.findByUserId(userId);

    ws.to(socketId).emit("admin_send_to_client", {
      text,
      socketId: adminId
    });
  });

  socket.on("admin_user_in_support", async params => {
    const { userId } = params;
    await connectionsService.updateAdminID(userId, socket.id);
  });

  /* socket.on('disconnect', async () => {
    await connectionsService.updateDisconnectAdminID(socket.id);

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
  
    ws.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  }) */
});