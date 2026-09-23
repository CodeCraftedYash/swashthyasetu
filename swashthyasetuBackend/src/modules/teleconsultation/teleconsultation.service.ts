import { TeleconsultationRepository } from "../../repositories/teleconsultation.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateTeleconsultationInput } from "./teleconsultation.schema.js";

export class TeleconsultationService {
  constructor(private readonly teleconsultationRepository: TeleconsultationRepository) {}

  async createTeleconsultation(data: CreateTeleconsultationInput) {
    return this.teleconsultationRepository.create({
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    } as any);
  }

  async listTeleconsultations() {
    return this.teleconsultationRepository.findMany({ include: { patient: true, doctor: true, hospital: true } });
  }

  async getTeleconsultation(id: string) {
    const teleconsultation = await this.teleconsultationRepository.findById(id);
    if (!teleconsultation) throw new ApiError(404, "Teleconsultation not found");
    return teleconsultation;
  }

  async updateStatus(id: string, status: string) {
    const teleconsultation = await this.teleconsultationRepository.findById(id);
    if (!teleconsultation) throw new ApiError(404, "Teleconsultation not found");
    return this.teleconsultationRepository.update(id, { status: status as any });
  }

  async updateNotes(id: string, data: { doctorNotes?: string; patientNotes?: string }) {
    const teleconsultation = await this.teleconsultationRepository.findById(id);
    if (!teleconsultation) throw new ApiError(404, "Teleconsultation not found");
    return this.teleconsultationRepository.update(id, { ...data } as any);
  }
}
