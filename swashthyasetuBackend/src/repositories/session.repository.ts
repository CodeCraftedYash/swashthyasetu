import { Prisma, Session } from "../generated/prisma/client";
import {DbClient} from '../types/database.type'

export class SessionRepository {
  constructor(private readonly db:DbClient ) {}

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.db.session.create({
      data,
    });
  }
// finds the session with the session id
  async findById(id: string): Promise<Session | null> {
    return this.db.session.findUnique({
      where: {
        id,
      },
    });
  }

  // finds the session with the user id
  async findByUserId(userId: string): Promise<Session[]> {
    return this.db.session.findMany({
      where: {
        userId,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.SessionUpdateInput,
  ): Promise<Session> {
    return this.db.session.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Session> {
    return this.db.session.delete({
      where: {
        id,
      },
    });
  }

  async deleteManyByUserId(userId: string) {
    return this.db.session.deleteMany({
      where: {
        userId,
      },
    });
  }
}