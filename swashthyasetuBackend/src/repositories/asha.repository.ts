import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class AshaRepository {
  constructor(private readonly db: PrismaClient) {}

  async findTasks(args: Prisma.FollowUpTaskFindManyArgs = {}) {
    return this.db.followUpTask.findMany(args);
  }

  async findTaskById(id: string) {
    return this.db.followUpTask.findUnique({ where: { id }, include: { patient: true, ashaWorker: true } });
  }

  async createTask(data: Prisma.FollowUpTaskCreateInput) {
    return this.db.followUpTask.create({ data });
  }

  async updateTask(id: string, data: Prisma.FollowUpTaskUpdateInput) {
    return this.db.followUpTask.update({ where: { id }, data });
  }

  async findHouseholds(args: Prisma.HouseholdFindManyArgs = {}) {
    return this.db.household.findMany(args);
  }

  async findHouseholdById(id: string) {
    return this.db.household.findUnique({
      where: { id },
      include: { members: true, ashaWorker: true },
    });
  }

  async createHousehold(data: Prisma.HouseholdCreateInput) {
    return this.db.household.create({ data });
  }

  async updateHousehold(id: string, data: Prisma.HouseholdUpdateInput) {
    return this.db.household.update({ where: { id }, data });
  }
}
