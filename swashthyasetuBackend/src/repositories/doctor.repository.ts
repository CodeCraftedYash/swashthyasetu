import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class DoctorRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.DoctorProfileFindManyArgs = {}) {
    return this.db.doctorProfile.findMany(args);
  }

  async findById(id: string) {
    return this.db.doctorProfile.findUnique({
      where: { id },
      include: {
        hospital: true,
        specialties: { include: { specialty: true } },
      },
    });
  }

  async create(data: Prisma.DoctorProfileCreateInput) {
    return this.db.doctorProfile.create({ data });
  }

  async update(id: string, data: Prisma.DoctorProfileUpdateInput) {
    return this.db.doctorProfile.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: Prisma.EnumDoctorStatusFieldUpdateOperationsInput) {
    return this.db.doctorProfile.update({
      where: { id },
      data: { status },
    });
  }
}
