import { AppointmentRepository } from "../../repositories/appointment.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateAppointmentInput } from "./appointment.schema.js";

export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async createAppointment(data: CreateAppointmentInput) {
    return this.appointmentRepository.create({
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    } as any);
  }

  async listAppointments() {
    return this.appointmentRepository.findMany({
      orderBy: { createdAt: "desc" },
      include: { patient: true, doctor: true, hospital: true },
    });
  }

  async getAppointment(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new ApiError(404, "Appointment not found");
    return appointment;
  }

  async updateStatus(id: string, status: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new ApiError(404, "Appointment not found");
    return this.appointmentRepository.update(id, { status: status as any });
  }
}
