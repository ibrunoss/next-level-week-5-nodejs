import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
  adminId?: string;
  userId: string;
  text: string;
}

class MessagesService {
  private messagesRepository:Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ adminId, userId, text }: IMessageCreate) {

    const message = this.messagesRepository.create({
      adminId,
      userId,
      text
    })

    await this.messagesRepository.save(message);

    return message;
  }

  async listByUser(userId: string) {
    const userMessageList    = await this.messagesRepository.find({ 
      where: { userId },
      relations: ["user"]
     });
    
    return userMessageList;
  }
}

export { MessagesService };