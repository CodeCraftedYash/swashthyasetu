import db from "../../library/Prisma.js";
import { NotificationRepository } from "../../repositories/notification.repository.js";
import { NotificationController } from "./notification.controller.js";
import { NotificationService } from "./notification.service.js";

const notificationRepository = new NotificationRepository(db);
const notificationService = new NotificationService(notificationRepository);

export const notificationController = new NotificationController(notificationService);
