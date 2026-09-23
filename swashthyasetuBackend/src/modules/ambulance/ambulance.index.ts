import db from "../../library/Prisma.js";
import { AmbulanceRepository } from "../../repositories/ambulance.repository.js";
import { AmbulanceController } from "./ambulance.controller.js";
import { AmbulanceService } from "./ambulance.service.js";

const ambulanceRepository = new AmbulanceRepository(db);
const ambulanceService = new AmbulanceService(ambulanceRepository);

export const ambulanceController = new AmbulanceController(ambulanceService);
