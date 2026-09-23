import db from "../../library/Prisma.js";
import { QrCheckInRepository } from "../../repositories/qr-checkin.repository.js";
import { QrCheckInController } from "./qr-checkin.controller.js";
import { QrCheckInService } from "./qr-checkin.service.js";

const qrCheckInRepository = new QrCheckInRepository(db);
const qrCheckInService = new QrCheckInService(qrCheckInRepository);

export const qrCheckInController = new QrCheckInController(qrCheckInService);
