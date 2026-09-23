import { TokenRepository } from "../../repositories/token.repository.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateTokenInput } from "./token.schema.js";

export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async createToken(data: CreateTokenInput) {
    return this.tokenRepository.create({
      ...data,
      bookedFor: new Date(data.bookedFor),
    } as any);
  }

  async getToken(id: string) {
    const token = await this.tokenRepository.findById(id);
    if (!token) throw new ApiError(404, "Token not found");
    return token;
  }

  async updateStatus(id: string, status: string) {
    const token = await this.tokenRepository.findById(id);
    if (!token) throw new ApiError(404, "Token not found");
    return this.tokenRepository.update(id, { status: status as any });
  }

  async reserveToken(hospitalId: string, patientId: string, bookedFor: string, doctorId?: string) {
    return this.tokenRepository.reserve(hospitalId, patientId, new Date(bookedFor), doctorId);
  }
}
