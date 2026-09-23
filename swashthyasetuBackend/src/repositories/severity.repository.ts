import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class SeverityRepository {
  constructor(private readonly db: PrismaClient) {}

  async findSymptoms() {
    return this.db.symptom.findMany({
      orderBy: { name: "asc" },
    });
  }

  async createAssessment(data: Prisma.SeverityAssessmentCreateInput) {
    return this.db.severityAssessment.create({ data });
  }

  async findAssessmentById(id: string) {
    return this.db.severityAssessment.findUnique({
      where: { id },
      include: { symptoms: { include: { symptom: true } }, patient: true },
    });
  }

  async findAssessmentsByPatient(patientId: string) {
    return this.db.severityAssessment.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: { symptoms: { include: { symptom: true } } },
    });
  }
}
