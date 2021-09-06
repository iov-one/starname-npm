export type GenericQuery = { [key: string]: GenericQuery | string | undefined };

const flatten = (
  query: GenericQuery | string,
  parentKey?: string,
): {
  [key: string]: string;
} => {
  if (typeof query === "string" || query === null || query === undefined) {
    if (typeof parentKey === "undefined") {
      throw new Error("trying to flatten a POD value");
    }
    return { [parentKey]: query };
  }
  const entries = Object.entries(query);
  return entries.reduce(
    (
      result: { [key: string]: string },
      [key, value]: [string, GenericQuery | string | undefined],
    ): { [key: string]: string } => {
      if (value === undefined) return result;
      if (typeof value !== "string") {
        return { ...result, ...flatten(value, key) };
      }
      const compoundKey =
        parentKey !== undefined ? [parentKey, key].join(".") : key;
      return {
        ...result,
        ...flatten(value, compoundKey),
      };
    },
    {},
  );
};
export const stargateToQueryString = (obj: GenericQuery): string => {
  const flat: { [key: string]: string | undefined } = flatten(obj);
  const items: ReadonlyArray<[string, string | undefined]> =
    Object.entries(flat);
  return (
    "events=" +
    items
      .filter(([, value]: [string, string | undefined]) => {
        return value !== undefined;
      })
      .map(([key, value]: [string, string | undefined]): string =>
        [key, `'${value}'`].join("="),
      )
      .join("&events=")
  );
};
