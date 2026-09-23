import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class SchemeRepository {
  constructor(private readonly db: PrismaClient) {}

  async findMany(args: Prisma.GovernmentSchemeFindManyArgs = {}) {
    return this.db.governmentScheme.findMany(args);
  }

  async findById(id: string) {
    return this.db.governmentScheme.findUnique({
      where: { id },
      include: { hospitals: { include: { hospital: true } } },
    });
  }

  async create(data: Prisma.GovernmentSchemeCreateInput) {
    return this.db.governmentScheme.create({ data });
  }

  async update(id: string, data: Prisma.GovernmentSchemeUpdateInput) {
    return this.db.governmentScheme.update({ where: { id }, data });
  }

  async findApplications(args: Prisma.SchemeApplicationFindManyArgs = {}) {
    return this.db.schemeApplication.findMany(args);
  }

  async apply(data: Prisma.SchemeApplicationCreateInput) {
    return this.db.schemeApplication.create({ data });
  }

  async updateApplication(id: string, data: Prisma.SchemeApplicationUpdateInput) {
    return this.db.schemeApplication.update({ where: { id }, data });
  }
}
