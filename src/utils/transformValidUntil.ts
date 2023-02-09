export const transformValidUntil = <T extends object>(
  value: T & {
    valid_until: string;
  },
): Omit<T, "valid_until"> & { validUntil: number } => {
  return {
    ...value,
    validUntil: parseInt(value.valid_until) * 1000,
  };
};
