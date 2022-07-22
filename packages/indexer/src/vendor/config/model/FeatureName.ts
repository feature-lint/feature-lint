import { z } from "zod";

export const FeatureName = z.string().min(1);
