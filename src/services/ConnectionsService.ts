import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionsService {
  id?: string;
  adminId?: string;
  userId: string;
  socketId: string;
}

class ConnectionsService {
  private connectionsRepository: Repository<Connection>

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ id, adminId, userId, socketId }: IConnectionsService) {
    
    const connection = this.connectionsRepository.create({
      id,
      adminId,
      userId,
      socketId
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  async findByUserId(userId: string) {
    const connection = await this.connectionsRepository.findOne({
      userId
    })
    return connection;
  }

  async findAllWithoutAdmin() {
    const connections = await this.connectionsRepository.find({
      where: { adminId: null },
      relations: ["user"]
    });
    return connections;
  }

  async findAll() {
    const connections = await this.connectionsRepository.find({
      relations: ["user"]
    });
    return connections;
  }

  async findBySocketID(socketId: string) {
    const connection = await this.connectionsRepository.findOne({ socketId });
    return connection;
  }

  async updateAdminID(userId: string, adminId: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ adminId })
      .where("userId = :userId", { userId })
      .execute();
  }

  async updateDisconnectAdminID(userId: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ adminId: null })
      .where("userId = :userId", { userId })
      .execute();
  }
}

export { ConnectionsService };