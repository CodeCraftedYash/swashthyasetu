import { DoctorRepository } from "../../repositories/doctor.repository.js";
import { ApiError } from "../../utils/apiError.js";
import { parseLimit, parsePage } from "../../utils/helpers.js";
import type { CreateDoctorInput, UpdateDoctorInput } from "./doctor.schema.js";

export class DoctorService {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async listDoctors(query: Record<string, string | undefined>) {
    const page = parsePage(query.page, 1);
    const limit = parseLimit(query.limit, 20, 100);

    const where: Record<string, unknown> = {};
    if (query.hospitalId) where.hospitalId = query.hospitalId;
    if (query.status) where.status = query.status;
    if (query.specialty) {
      where.specialties = { some: { specialty: { name: { contains: query.specialty, mode: "insensitive" } } } };
    }

    const [items, total] = await Promise.all([
      this.doctorRepository.findMany({
        where,
        include: { hospital: true, specialties: { include: { specialty: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.doctorRepository.findMany({ where }).then((rows) => rows.length),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return doctor;
  }

  async createDoctor(data: CreateDoctorInput) {
    return this.doctorRepository.create(data as any);
  }

  async updateDoctor(id: string, data: UpdateDoctorInput) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return this.doctorRepository.update(id, data as any);
  }

  async updateStatus(id: string, status: string) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return this.doctorRepository.updateStatus(id, { set: status as any } as any);
  }
}
