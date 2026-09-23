import { Prisma } from "../../generated/prisma/client.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { ProfileInput, UpdateUserInput } from "./user.schema.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Prisma.UserUpdateInput;

    return this.userRepository.update(id, cleanData);
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user.patientProfile ?? null;
  }

  async updateProfile(id: string, data: ProfileInput) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const profileData = {
      ...Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)),
      dateOfBirth: data.dateOfBirth && data.dateOfBirth !== "" ? new Date(data.dateOfBirth) : undefined,
    };

    if (!user.patientProfile) {
      return this.userRepository.update(id, {
        patientProfile: {
          create: profileData as Prisma.PatientProfileCreateWithoutUserInput,
        },
      });
    }

    return this.userRepository.update(id, {
      patientProfile: {
        update: profileData as Prisma.PatientProfileUpdateWithoutUserInput,
      },
    });
  }
}
