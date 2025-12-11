// src/types/extendDurationDTO.ts
import { z } from 'zod';

export const extendDurationSchema = z.object({
  expirationDate: z.string().min(1, "Lütfen yeni bir bitiş tarihi seçin."), // ISO string
});

export type ExtendDurationDTO = z.infer<typeof extendDurationSchema>;