import db from "../../library/Prisma.js";
import { AppointmentRepository } from "../../repositories/appointment.repository.js";
import { AppointmentController } from "./appointment.controller.js";
import { AppointmentService } from "./appointment.service.js";

const appointmentRepository = new AppointmentRepository(db);
const appointmentService = new AppointmentService(appointmentRepository);

export const appointmentController = new AppointmentController(appointmentService);
