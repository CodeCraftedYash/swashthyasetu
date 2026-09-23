import db from "../../library/Prisma.js";
import { SchemeRepository } from "../../repositories/scheme.repository.js";
import { SchemeController } from "./scheme.controller.js";
import { SchemeService } from "./scheme.service.js";

const schemeRepository = new SchemeRepository(db);
const schemeService = new SchemeService(schemeRepository);

export const schemeController = new SchemeController(schemeService);
