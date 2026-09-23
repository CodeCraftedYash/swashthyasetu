import { BedRepository } from "../../repositories/bed.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateBedInput, UpdateBedInput } from "./bed.schema.js";

export class BedService {
  constructor(private readonly bedRepository: BedRepository) {}

  async listBeds() {
    return this.bedRepository.findMany({ include: { hospital: true } });
  }

  async getBedById(id: string) {
    const bed = await this.bedRepository.findById(id);
    if (!bed) throw new ApiError(404, "Bed inventory not found");
    return bed;
  }

  async createBed(data: CreateBedInput) {
    if ((data.occupiedBeds ?? 0) > data.totalBeds) {
      throw new ApiError(400, "Occupied beds cannot exceed total beds");
    }

    return this.bedRepository.create({
      hospitalId: data.hospitalId,
      wardType: data.wardType,
      totalBeds: data.totalBeds,
      occupiedBeds: data.occupiedBeds ?? 0,
    } as any);
  }

  async updateBed(id: string, data: UpdateBedInput) {
    const current = await this.bedRepository.findById(id);
    if (!current) throw new ApiError(404, "Bed inventory not found");

    const nextOccupied = data.occupiedBeds ?? current.occupiedBeds;
    const nextTotal = data.totalBeds ?? current.totalBeds;
    if (nextOccupied > nextTotal) {
      throw new ApiError(400, "Occupied beds cannot exceed total beds");
    }
    if (nextOccupied < 0) {
      throw new ApiError(400, "Occupied beds cannot fall below zero");
    }

    return this.bedRepository.update(id, data as any);
  }

  async updateWardBed(hospitalId: string, wardType: string, data: { occupiedBeds?: number; totalBeds?: number }) {
    const bed = await this.bedRepository.findByHospitalAndWard(hospitalId, wardType);
    if (!bed) throw new ApiError(404, "Ward inventory not found");

    const nextOccupied = data.occupiedBeds ?? bed.occupiedBeds;
    const nextTotal = data.totalBeds ?? bed.totalBeds;
    if (nextOccupied > nextTotal) throw new ApiError(400, "Occupied beds cannot exceed total beds");
    if (nextOccupied < 0) throw new ApiError(400, "Occupied beds cannot fall below zero");

    return this.bedRepository.update(bed.id, {
      occupiedBeds: nextOccupied,
      totalBeds: nextTotal,
    } as any);
  }

  async summary() {
    return this.bedRepository.summary();
  }
}
