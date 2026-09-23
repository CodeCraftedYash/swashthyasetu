import db from "../../library/Prisma.js";
import { SeverityRepository } from "../../repositories/severity.repository.js";
import { SeverityController } from "./severity.controller.js";
import { SeverityService } from "./severity.service.js";

const severityRepository = new SeverityRepository(db);
const severityService = new SeverityService(severityRepository);

export const severityController = new SeverityController(severityService);
