import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class NotificationRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.NotificationFindManyArgs = {}) {
    return this.db.notification.findMany(args);
  }

  async create(data: Prisma.NotificationCreateInput) {
    return this.db.notification.create({ data });
  }

  async markRead(id: string) {
    return this.db.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.db.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
