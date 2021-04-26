import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
  chat: boolean,
  username: string
}

class SettingsService {
  private settingsRepository:Repository<Setting>;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create({chat, username}: ISettingsCreate) {
    const userAlreadyExists  = await this.settingsRepository.findOne({ username });

    if (userAlreadyExists) {
      throw { message: "User already exists!", status: 400 }
    }

    const setting = this.settingsRepository.create({
      chat,
      username
    });
  
    await this.settingsRepository.save(setting);

    return setting;
  }

  async findByUserName(username: string) {
    const settings = await this.settingsRepository.findOne({ username })
    return settings;
  }

  async update(username: string, chat: boolean) {
    const update = await this.settingsRepository.update({ username },{ chat })
      /* .createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", { username })
      .execute(); */
    return update;
  }
}

export { SettingsService };