import db from "../../library/Prisma.js";
import { DoctorRepository } from "../../repositories/doctor.repository.js";
import { DoctorController } from "./doctor.controller.js";
import { DoctorService } from "./doctor.service.js";

const doctorRepository = new DoctorRepository(db);
const doctorService = new DoctorService(doctorRepository);

export const doctorController = new DoctorController(doctorService);
