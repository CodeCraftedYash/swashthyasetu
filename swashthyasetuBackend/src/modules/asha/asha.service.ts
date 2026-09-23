import { AshaRepository } from "../../repositories/asha.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { TaskInput } from "./asha.schema.js";

export class AshaService {
  constructor(private readonly ashaRepository: AshaRepository) {}

  async listTasks() {
    return this.ashaRepository.findTasks({ orderBy: { createdAt: "desc" }, include: { patient: true, ashaWorker: true } });
  }

  async getTask(id: string) {
    const task = await this.ashaRepository.findTaskById(id);
    if (!task) throw new ApiError(404, "Task not found");
    return task;
  }

  async createTask(data: TaskInput) {
    return this.ashaRepository.createTask({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    } as any);
  }

  async updateTask(id: string, data: Partial<TaskInput>) {
    const task = await this.ashaRepository.findTaskById(id);
    if (!task) throw new ApiError(404, "Task not found");
    return this.ashaRepository.updateTask(id, {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    } as any);
  }

  async updateStatus(id: string, status: string) {
    const task = await this.ashaRepository.findTaskById(id);
    if (!task) throw new ApiError(404, "Task not found");
    return this.ashaRepository.updateTask(id, { status: status as any });
  }

  async listHouseholds() {
    return this.ashaRepository.findHouseholds({ include: { members: true, ashaWorker: true } });
  }

  async getHousehold(id: string) {
    const household = await this.ashaRepository.findHouseholdById(id);
    if (!household) throw new ApiError(404, "Household not found");
    return household;
  }

  async createHousehold(data: any) {
    return this.ashaRepository.createHousehold(data as any);
  }

  async updateHousehold(id: string, data: any) {
    const household = await this.ashaRepository.findHouseholdById(id);
    if (!household) throw new ApiError(404, "Household not found");
    return this.ashaRepository.updateHousehold(id, data as any);
  }
}
