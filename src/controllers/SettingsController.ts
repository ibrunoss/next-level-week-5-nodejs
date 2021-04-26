import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  async create(req: Request, res: Response): Promise<Response> {
    const settingsService = new SettingsService();

    try {
      const setting = await settingsService.create(req.body);
      return res.json(setting);
    } catch (error) {
      return res.status(error.status).json({message: error.message});
    }
  }

  async findByUserName(req: Request, res: Response): Promise<Response> {
    const { username } = req.params; 
    const settingsService = new SettingsService();
    const settings = await settingsService.findByUserName(username);
    return res.json(settings);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { username } = req.params; 
    const { chat } = req.body; 
    const settingsService = new SettingsService();
    const update = await settingsService.update(username, chat);
    return res.json(update);
  }
}

export { SettingsController }