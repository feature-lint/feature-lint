import { z } from "zod";

export const BuildingBlockName = z.string().min(1);
