import { AmbulanceRepository } from "../../repositories/ambulance.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateAmbulanceInput, UpdateAmbulanceInput } from "./ambulance.schema.js";

export class AmbulanceService {
  constructor(private readonly ambulanceRepository: AmbulanceRepository) {}

  async listAmbulances() {
    return this.ambulanceRepository.findMany({ include: { hospital: true } });
  }

  async getAmbulanceById(id: string) {
    const ambulance = await this.ambulanceRepository.findById(id);
    if (!ambulance) throw new ApiError(404, "Ambulance not found");
    return ambulance;
  }

  async createAmbulance(data: CreateAmbulanceInput) {
    return this.ambulanceRepository.create({
      ...data,
      latitude: data.latitude !== undefined ? data.latitude.toString() : null,
      longitude: data.longitude !== undefined ? data.longitude.toString() : null,
    } as any);
  }

  async updateAmbulance(id: string, data: UpdateAmbulanceInput) {
    const ambulance = await this.ambulanceRepository.findById(id);
    if (!ambulance) throw new ApiError(404, "Ambulance not found");

    return this.ambulanceRepository.update(id, {
      ...data,
      latitude: data.latitude !== undefined ? data.latitude.toString() : undefined,
      longitude: data.longitude !== undefined ? data.longitude.toString() : undefined,
    } as any);
  }

  async updateStatus(id: string, status: string) {
    const ambulance = await this.ambulanceRepository.findById(id);
    if (!ambulance) throw new ApiError(404, "Ambulance not found");
    return this.ambulanceRepository.update(id, { status: status as any });
  }

  async addLocation(id: string, latitude: number, longitude: number) {
    const ambulance = await this.ambulanceRepository.findById(id);
    if (!ambulance) throw new ApiError(404, "Ambulance not found");

    return this.ambulanceRepository.addLocation(id, latitude, longitude);
  }
}
