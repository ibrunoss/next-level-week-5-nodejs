import { Router } from "express";
import { SettingsController } from "./controllers/SettingsController";

const routes = Router();
const settingsController = new SettingsController();

/**
 * Tipos de parâmetros
 * Routes Params => Parâmetros de rotas | Ex.: http://localhost:3333/settings/1
 * Query Params  => Filtros e buscas    | Ex.: http://localhost:3333/settings/1?search=something&filter=target
 * Body Params   => Corpo da requisição | Ex.: (JSON, XML)
 */

routes.post("/settings", settingsController.create);

export { routes }