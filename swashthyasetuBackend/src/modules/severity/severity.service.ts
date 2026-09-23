import { SeverityRepository } from "../../repositories/severity.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateAssessmentInput } from "./severity.schema.js";

export class SeverityService {
  constructor(private readonly severityRepository: SeverityRepository) {}

  async listSymptoms() {
    return this.severityRepository.findSymptoms();
  }

  async createAssessment(data: CreateAssessmentInput) {
    const assessment = await this.severityRepository.createAssessment({
      patientId: data.patientId ?? null,
      score: data.score,
      severity: data.severity,
      recommendation: data.recommendation ?? null,
      symptoms: {
        create: data.symptoms.map((entry) => ({
          symptomId: entry.symptomId,
          answer: entry.answer,
          notes: entry.notes ?? null,
        })),
      },
    } as any);

    return assessment;
  }

  async getAssessment(id: string) {
    const assessment = await this.severityRepository.findAssessmentById(id);
    if (!assessment) throw new ApiError(404, "Severity assessment not found");
    return assessment;
  }

  async getPatientAssessments(patientId: string) {
    return this.severityRepository.findAssessmentsByPatient(patientId);
  }
}
