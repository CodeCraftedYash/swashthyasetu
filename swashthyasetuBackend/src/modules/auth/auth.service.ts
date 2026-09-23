import crypto from "node:crypto";

import { SessionRepository } from "../../repositories/session.repository.js";
import { UserRepository } from "../../repositories/user.repository.js";
import PasswordService from "../../services/password.service.js";
import TokenService from "../../services/token.service.js";
import { ApiError } from "../../utils/apiError.js";
import type { LoginPayload, RegisterPayload } from "./auth.types.js";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async register(data: RegisterPayload) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const passwordHash = await PasswordService.hashPassword(data.password);
    const roles = data.roles ?? ["PATIENT"];
    const user = await this.userRepository.create({
      email: data.email,
      phone: data.phone ?? null,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      roles,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  async login(data: LoginPayload) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await PasswordService.comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is inactive");
    }

    const sessionId = crypto.randomUUID();
    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      role: user.roles[0] ?? "PATIENT",
    });
    const refreshToken = TokenService.generateRefreshToken({
      userId: user.id,
      sessionId,
    });
    const refreshTokenHash = await PasswordService.hashPassword(refreshToken);

    await this.sessionRepository.create({
      id: sessionId,
      token: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {
        connect: { id: user.id },
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const payload = TokenService.verifyRefreshToken(refreshToken);
    const session = await this.sessionRepository.findById(payload.sessionId);
    if (!session) {
      throw new ApiError(401, "Session not found");
    }

    if (session.expiresAt < new Date() || session.isRevoked) {
      throw new ApiError(401, "Refresh token expired or revoked");
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      role: user.roles[0] ?? "PATIENT",
    });
    const newRefreshToken = TokenService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = TokenService.verifyRefreshToken(refreshToken);
      const session = await this.sessionRepository.findById(payload.sessionId);
      if (session) {
        await this.sessionRepository.update(session.id, {
          isRevoked: true,
        });
      }
    } catch {
      return;
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

