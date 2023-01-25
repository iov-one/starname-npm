// eslint-disable-next-line @typescript-eslint/ban-types
export const isKeyOf = <T extends object>(
  key: any | keyof T,
  t: T,
): key is keyof T => key !== undefined && key !== null && key in t;
