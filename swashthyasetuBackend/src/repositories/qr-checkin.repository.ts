import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class QrCheckInRepository {
  constructor(private readonly db: PrismaClient) {}

  async findByToken(qrToken: string) {
    return this.db.qRCheckIn.findUnique({ where: { qrToken } });
  }

  async findById(id: string) {
    return this.db.qRCheckIn.findUnique({ where: { id } });
  }

  async create(data: Prisma.QRCheckInCreateInput) {
    return this.db.qRCheckIn.create({ data });
  }

  async update(id: string, data: Prisma.QRCheckInUpdateInput) {
    return this.db.qRCheckIn.update({ where: { id }, data });
  }
}
