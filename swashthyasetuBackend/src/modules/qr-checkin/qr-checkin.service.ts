import { QrCheckInRepository } from "../../repositories/qr-checkin.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateQrCheckInInput } from "./qr-checkin.schema.js";

export class QrCheckInService {
  constructor(private readonly qrCheckInRepository: QrCheckInRepository) {}

  async createQrCheckIn(data: CreateQrCheckInInput) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(data.expiresAt);
    const qrCheckIn = await this.qrCheckInRepository.create({
      qrToken: token,
      patientId: data.patientId ?? null,
      hospitalId: data.hospitalId,
      deskName: data.deskName ?? null,
      status: "CREATED",
      expiresAt,
    } as any);

    return { ...qrCheckIn, qrToken: token };
  }

  async getByToken(token: string) {
    const qrCheckIn = await this.qrCheckInRepository.findByToken(token);
    if (!qrCheckIn) throw new ApiError(404, "QR check-in not found");
    return qrCheckIn;
  }

  async scanToken(token: string) {
    const qrCheckIn = await this.qrCheckInRepository.findByToken(token);
    if (!qrCheckIn) throw new ApiError(404, "QR check-in not found");
    if (qrCheckIn.expiresAt < new Date()) throw new ApiError(410, "QR token has expired");
    return this.qrCheckInRepository.update(qrCheckIn.id, { status: "SCANNED", scannedAt: new Date() } as any);
  }

  async verifyToken(token: string) {
    const qrCheckIn = await this.qrCheckInRepository.findByToken(token);
    if (!qrCheckIn) throw new ApiError(404, "QR check-in not found");
    if (qrCheckIn.status === "VERIFIED") throw new ApiError(409, "QR token has already been used");
    if (qrCheckIn.expiresAt < new Date()) throw new ApiError(410, "QR token has expired");
    return this.qrCheckInRepository.update(qrCheckIn.id, { status: "VERIFIED", verifiedAt: new Date() } as any);
  }

  async updateStatus(id: string, status: string) {
    const qrCheckIn = await this.qrCheckInRepository.findById(id);
    if (!qrCheckIn) throw new ApiError(404, "QR check-in not found");
    return this.qrCheckInRepository.update(id, { status: status as any } as any);
  }
}
