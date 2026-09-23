import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class HospitalRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.HospitalFindManyArgs = {}) {
    return this.db.hospital.findMany(args);
  }

  async count(args: Prisma.HospitalCountArgs = {}) {
    return this.db.hospital.count(args);
  }

  async findById(id: string) {
    return this.db.hospital.findUnique({
      where: { id },
      include: {
        specialties: { include: { specialty: true } },
        beds: true,
        doctors: { include: { specialties: { include: { specialty: true } } } },
      },
    });
  }

  async create(data: Prisma.HospitalCreateInput) {
    return this.db.hospital.create({ data });
  }

  async update(id: string, data: Prisma.HospitalUpdateInput) {
    return this.db.hospital.update({
      where: { id },
      data,
    });
  }
}
