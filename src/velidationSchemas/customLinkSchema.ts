import * as z from "zod";

export const customLinkCreateSchema = z.object({
    productName: z
        .string()
        .trim()
        .min(2, "Product name must be at least 2 characters long")
        .max(60, "Product name must be at most 60 characters long"),
});

export const customLinkDeleteSchema = z.object({
    linkId: z.string().trim().min(1, "Link id is required"),
});
