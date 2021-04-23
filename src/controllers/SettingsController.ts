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
}

export { SettingsController }