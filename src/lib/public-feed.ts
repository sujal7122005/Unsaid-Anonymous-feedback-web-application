import { randomBytes } from "crypto";

export function generatePublicFeedToken(): string {
  return randomBytes(32).toString("hex");
}
