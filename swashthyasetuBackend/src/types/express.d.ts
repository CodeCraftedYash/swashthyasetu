import { AccessTokenPayload } from "./jwtPayload.type";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};