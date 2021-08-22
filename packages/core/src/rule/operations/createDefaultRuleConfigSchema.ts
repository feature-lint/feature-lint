import { z } from "zod";

export const createDefaultRuleConfigSchema = <NAME extends string>(
  name: NAME
) => {
  return z.object({
    name: z.literal(name),

    enabled: z.boolean(),
  });
};
export interface DefaultRuleConfig<NAME extends string> {
  name: NAME;
  enabled: boolean;
}

export const createDefaultRuleConfig = <NAME extends string>(
  name: NAME
): DefaultRuleConfig<NAME> => {
  return { name, enabled: true };
};
