import * as z from "zod";

export const verifySchema = z.object({
    verificationcode: z
        .string()
        .length(6, "Verification code must be 6 characters long")
});