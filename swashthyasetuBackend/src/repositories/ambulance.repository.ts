import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class AmbulanceRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.AmbulanceFindManyArgs = {}) {
    return this.db.ambulance.findMany(args);
  }

  async findById(id: string) {
    return this.db.ambulance.findUnique({
      where: { id },
      include: { hospital: true, locationEvents: { orderBy: { recordedAt: "desc" } } },
    });
  }

  async create(data: Prisma.AmbulanceCreateInput) {
    return this.db.ambulance.create({ data });
  }

  async update(id: string, data: Prisma.AmbulanceUpdateInput) {
    return this.db.ambulance.update({ where: { id }, data });
  }

  async addLocation(ambulanceId: string, latitude: number, longitude: number) {
    return this.db.ambulanceLocation.create({
      data: {
        ambulanceId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    });
  }
}
