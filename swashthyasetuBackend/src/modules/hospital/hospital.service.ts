import { HospitalRepository } from "../../repositories/hospital.repository.js";
import { ApiError } from "../../utils/apiError.js";
import { parseLimit, parsePage, toBoolean } from "../../utils/helpers.js";
import type { CreateHospitalInput, UpdateHospitalInput } from "./hospital.schema.js";

export class HospitalService {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async getHospitals(query: Record<string, string | undefined>) {
    const search = query.search?.trim();
    const status = query.status;
    const level = query.level;
    const district = query.district;
    const specialty = query.specialty;
    const availableOnly = toBoolean(query.availableOnly);
    const page = parsePage(query.page, 1);
    const limit = parseLimit(query.limit, 20, 100);

    const where: Record<string, unknown> = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { area: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (level) where.level = level;
    if (district) where.district = district;
    if (availableOnly) where.status = { not: "FULL" };
    if (specialty) {
      where.specialties = {
        some: {
          specialty: { name: { contains: specialty, mode: "insensitive" } },
        },
      };
    }

    const [items, total] = await Promise.all([
      this.hospitalRepository.findMany({
        where,
        include: { specialties: { include: { specialty: true } }, beds: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.hospitalRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getHospitalById(id: string) {
    const hospital = await this.hospitalRepository.findById(id);
    if (!hospital) throw new ApiError(404, "Hospital not found");
    return hospital;
  }

  async createHospital(data: CreateHospitalInput) {
    return this.hospitalRepository.create({
      ...data,
      latitude: data.latitude !== undefined ? data.latitude.toString() : null,
      longitude: data.longitude !== undefined ? data.longitude.toString() : null,
    } as any);
  }

  async updateHospital(id: string, data: UpdateHospitalInput) {
    const hospital = await this.hospitalRepository.findById(id);
    if (!hospital) throw new ApiError(404, "Hospital not found");

    return this.hospitalRepository.update(id, {
      ...data,
      latitude: data.latitude !== undefined ? data.latitude.toString() : undefined,
      longitude: data.longitude !== undefined ? data.longitude.toString() : undefined,
    } as any);
  }
}
