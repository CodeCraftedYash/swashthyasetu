import { SchemeRepository } from "../../repositories/scheme.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateSchemeInput } from "./scheme.schema.js";

export class SchemeService {
  constructor(private readonly schemeRepository: SchemeRepository) {}

  async listSchemes() {
    return this.schemeRepository.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getScheme(id: string) {
    const scheme = await this.schemeRepository.findById(id);
    if (!scheme) throw new ApiError(404, "Scheme not found");
    return scheme;
  }

  async createScheme(data: CreateSchemeInput) {
    return this.schemeRepository.create(data as any);
  }

  async updateScheme(id: string, data: Partial<CreateSchemeInput>) {
    const scheme = await this.schemeRepository.findById(id);
    if (!scheme) throw new ApiError(404, "Scheme not found");
    return this.schemeRepository.update(id, data as any);
  }

  async applyForScheme(schemeId: string, data: { patientId: string; notes?: string }) {
    const scheme = await this.schemeRepository.findById(schemeId);
    if (!scheme) throw new ApiError(404, "Scheme not found");
    return this.schemeRepository.apply({
      schemeId,
      patientId: data.patientId,
      notes: data.notes ?? null,
    } as any);
  }

  async getPatientApplications(patientId: string) {
    return this.schemeRepository.findApplications({ where: { patientId }, orderBy: { appliedAt: "desc" } });
  }

  async updateApplicationStatus(id: string, status: string) {
    const application = await this.schemeRepository.findApplications({ where: { id } });
    if (!application.length) throw new ApiError(404, "Scheme application not found");
    return this.schemeRepository.updateApplication(id, { status: status as any });
  }
}
