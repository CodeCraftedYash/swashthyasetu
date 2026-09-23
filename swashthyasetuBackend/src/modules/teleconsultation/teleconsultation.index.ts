import db from "../../library/Prisma.js";
import { TeleconsultationRepository } from "../../repositories/teleconsultation.repository.js";
import { TeleconsultationController } from "./teleconsultation.controller.js";
import { TeleconsultationService } from "./teleconsultation.service.js";

const teleconsultationRepository = new TeleconsultationRepository(db);
const teleconsultationService = new TeleconsultationService(teleconsultationRepository);

export const teleconsultationController = new TeleconsultationController(teleconsultationService);
