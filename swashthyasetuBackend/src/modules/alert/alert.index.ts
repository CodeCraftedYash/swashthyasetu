import db from "../../library/Prisma.js";
import { AlertRepository } from "../../repositories/alert.repository.js";
import { AlertController } from "./alert.controller.js";
import { AlertService } from "./alert.service.js";

const alertRepository = new AlertRepository(db);
const alertService = new AlertService(alertRepository);

export const alertController = new AlertController(alertService);
