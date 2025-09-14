import { z } from "zod";

export const updateStoreSchema = z.object({
  storeName: z.string().min(3, "Store Name min 3 characters"),
  address: z.string().min(3, "Address min 3 character"),
  city: z.string().min(3, "City min 3 character"),
  province: z.string().min(3, "Province min 3 character"),
  latitude: z.number(),
  longitude: z.number(),
  is_active: z.boolean(),
});

export type UpdateStoreSchema = z.infer<typeof updateStoreSchema>;
