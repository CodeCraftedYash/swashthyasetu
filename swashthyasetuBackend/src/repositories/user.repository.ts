import { Prisma, type User } from "../generated/prisma/client.js";
import { PrismaClient } from "../generated/prisma/client.js";

export type UserWithProfile = Prisma.UserGetPayload<{ include: { patientProfile: true } }>;

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }

  async findById(id: string): Promise<UserWithProfile | null> {
    return this.db.user.findUnique({
      where: { id },
      include: { patientProfile: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async findByFirstName(firstName: string): Promise<User[]> {
    return this.db.user.findMany({
      where: { firstName },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.db.user.delete({ where: { id } });
  }
}
