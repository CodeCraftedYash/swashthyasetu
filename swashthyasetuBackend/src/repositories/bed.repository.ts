import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class BedRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.BedInventoryFindManyArgs = {}) {
    return this.db.bedInventory.findMany(args);
  }

  async findById(id: string) {
    return this.db.bedInventory.findUnique({ where: { id }, include: { hospital: true } });
  }

  async findByHospitalAndWard(hospitalId: string, wardType: string) {
    return this.db.bedInventory.findUnique({
      where: { hospitalId_wardType: { hospitalId, wardType: wardType as any } },
      include: { hospital: true },
    });
  }

  async create(data: Prisma.BedInventoryCreateInput) {
    return this.db.bedInventory.create({ data });
  }

  async update(id: string, data: Prisma.BedInventoryUpdateInput) {
    return this.db.bedInventory.update({ where: { id }, data });
  }

  async summary() {
    const rows = await this.db.bedInventory.findMany({
      select: { hospitalId: true, wardType: true, totalBeds: true, occupiedBeds: true },
    });

    return rows.reduce(
      (acc, row) => {
        acc.total += row.totalBeds;
        acc.occupied += row.occupiedBeds;
        return acc;
      },
      { total: 0, occupied: 0 },
    );
  }
}
