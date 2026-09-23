import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class TeleconsultationRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.TeleconsultationFindManyArgs = {}) {
    return this.db.teleconsultation.findMany(args);
  }

  async findById(id: string) {
    return this.db.teleconsultation.findUnique({
      where: { id },
      include: { patient: true, doctor: true, hospital: true },
    });
  }

  async create(data: Prisma.TeleconsultationCreateInput) {
    return this.db.teleconsultation.create({ data });
  }

  async update(id: string, data: Prisma.TeleconsultationUpdateInput) {
    return this.db.teleconsultation.update({ where: { id }, data });
  }
}
