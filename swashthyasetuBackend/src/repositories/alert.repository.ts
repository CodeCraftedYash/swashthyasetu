import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class AlertRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.AlertFindManyArgs = {}) {
    return this.db.alert.findMany(args);
  }

  async findById(id: string) {
    return this.db.alert.findUnique({
      where: { id },
      include: { events: true, hospital: true, ambulance: true, patient: true },
    });
  }

  async create(data: Prisma.AlertCreateInput) {
    return this.db.alert.create({ data });
  }

  async update(id: string, data: Prisma.AlertUpdateInput) {
    return this.db.alert.update({ where: { id }, data });
  }

  async addEvent(data: Prisma.AlertEventCreateInput) {
    return this.db.alertEvent.create({ data });
  }

  async listEvents(alertId: string) {
    return this.db.alertEvent.findMany({
      where: { alertId },
      orderBy: { createdAt: "desc" },
    });
  }
}
