import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class AppointmentRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.AppointmentFindManyArgs = {}) {
    return this.db.appointment.findMany(args);
  }

  async findById(id: string) {
    return this.db.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true, hospital: true, token: true },
    });
  }

  async create(data: Prisma.AppointmentCreateInput) {
    return this.db.appointment.create({ data });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.db.appointment.update({ where: { id }, data });
  }
}
