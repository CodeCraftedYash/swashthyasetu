import db from "../../library/Prisma.js";
import { AlertRepository } from "../../repositories/alert.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateAlertInput } from "./alert.schema.js";

export class AlertService {
  constructor(private readonly alertRepository: AlertRepository) {}

  async listAlerts() {
    return this.alertRepository.findMany({
      include: { hospital: true, ambulance: true, patient: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAlertById(id: string) {
    const alert = await this.alertRepository.findById(id);
    if (!alert) throw new ApiError(404, "Alert not found");
    return alert;
  }

  async createAlert(data: CreateAlertInput) {
    const alert = await this.alertRepository.create({
      ...data,
      latitude: data.latitude !== undefined ? data.latitude.toString() : null,
      longitude: data.longitude !== undefined ? data.longitude.toString() : null,
      status: "CREATED",
    } as any);

    await this.alertRepository.addEvent({
      alert: { connect: { id: alert.id } },
      status: "CREATED",
      note: data.note ?? "Alert created",
    });

    return alert;
  }

  async updateStatus(id: string, status: string) {
    const alert = await this.alertRepository.findById(id);
    if (!alert) throw new ApiError(404, "Alert not found");

    const updated = await this.alertRepository.update(id, { status: status as any });
    await this.alertRepository.addEvent({
      alert: { connect: { id: id } },
      status: status as any,
      note: `Status updated to ${status}`,
    });
    return updated;
  }

  async assignAlert(id: string, payload: { ambulanceId?: string; hospitalId?: string; assignedById?: string }) {
    const alert = await this.alertRepository.findById(id);
    if (!alert) throw new ApiError(404, "Alert not found");

    const updated = await db.$transaction(async (tx) => {
      const result = await tx.alert.update({
        where: { id },
        data: {
          ...(payload.ambulanceId ? { ambulanceId: payload.ambulanceId } : {}),
          ...(payload.hospitalId ? { hospitalId: payload.hospitalId } : {}),
          ...(payload.assignedById ? { assignedById: payload.assignedById } : {}),
          status: "AMBULANCE_ASSIGNED",
        },
      });

      await tx.alertEvent.create({
        data: {
          alertId: id,
          status: "AMBULANCE_ASSIGNED",
          note: "Alert assigned to responder",
        },
      });

      return result;
    });

    return updated;
  }

  async createEvent(id: string, data: { status: string; note?: string }) {
    const alert = await this.alertRepository.findById(id);
    if (!alert) throw new ApiError(404, "Alert not found");

    const event = await this.alertRepository.addEvent({
      alert: { connect: { id } },
      status: data.status as any,
      note: data.note ?? null,
    });

    await this.alertRepository.update(id, { status: data.status as any });
    return event;
  }

  async listEvents(id: string) {
    const alert = await this.alertRepository.findById(id);
    if (!alert) throw new ApiError(404, "Alert not found");
    return this.alertRepository.listEvents(id);
  }
}
