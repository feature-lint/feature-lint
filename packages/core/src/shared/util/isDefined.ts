export function isDefined<VALUE>(
  value: VALUE | undefined
): value is NonNullable<VALUE> {
  if (value === undefined) {
    return false;
  }

  return true;
}
