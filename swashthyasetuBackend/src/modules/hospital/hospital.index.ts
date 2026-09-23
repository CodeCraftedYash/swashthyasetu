import db from "../../library/Prisma.js";
import { HospitalRepository } from "../../repositories/hospital.repository.js";
import { HospitalController } from "./hospital.controller.js";
import { HospitalService } from "./hospital.service.js";

const hospitalRepository = new HospitalRepository(db);
const hospitalService = new HospitalService(hospitalRepository);

export const hospitalController = new HospitalController(hospitalService);
