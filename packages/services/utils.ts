import type { RequireAllExcept } from "@novelty/lib/types";
import type { ServiceDependencies } from "./types";

export function prepareDependencies<T extends keyof ServiceDependencies>(
  dependencies: any,
  omittedKey: T,
): RequireAllExcept<ServiceDependencies, T> {
  const { [omittedKey]: optionalDep, ...rest } = dependencies;

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`Missing required dependency: ${key}`);
    }
  });

  return {
    ...rest,
    [omittedKey]: optionalDep,
  } as RequireAllExcept<ServiceDependencies, T>;
}
