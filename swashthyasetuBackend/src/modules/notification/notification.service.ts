import { NotificationRepository } from "../../repositories/notification.repository.js";
import { ApiError } from "../../utils/apiError.js";

export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async listNotifications(userId: string) {
    return this.notificationRepository.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markRead(id: string) {
    const notifications = await this.notificationRepository.findMany({ where: { id } });
    if (!notifications.length) throw new ApiError(404, "Notification not found");
    return this.notificationRepository.markRead(id);
  }

  async markAllRead(userId: string) {
    return this.notificationRepository.markAllRead(userId);
  }
}
