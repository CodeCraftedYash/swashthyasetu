import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class TokenRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string) {
    return this.db.tokenBooking.findUnique({
      where: { id },
      include: { patient: true, hospital: true, doctor: true },
    });
  }

  async findMany(args: Prisma.TokenBookingFindManyArgs = {}) {
    return this.db.tokenBooking.findMany(args);
  }

  async create(data: Prisma.TokenBookingCreateInput) {
    return this.db.tokenBooking.create({ data });
  }

  async update(id: string, data: Prisma.TokenBookingUpdateInput) {
    return this.db.tokenBooking.update({ where: { id }, data });
  }

  async reserve(hospitalId: string, patientId: string, bookedFor: Date, doctorId?: string) {
    const latest = await this.db.tokenBooking.findFirst({
      where: { hospitalId, bookedFor: { gte: bookedFor, lt: new Date(bookedFor.getTime() + 86400000) } },
      orderBy: { tokenNumber: "desc" },
      select: { tokenNumber: true },
    });

    return this.db.tokenBooking.create({
      data: {
        hospitalId,
        patientId,
        doctorId: doctorId ?? null,
        bookedFor,
        tokenNumber: (latest?.tokenNumber ?? 0) + 1,
      },
    });
  }
}
