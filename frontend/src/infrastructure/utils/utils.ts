export const pickMany = <T extends Record<PropertyKey, any>, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Pick<T, K[number]> => {
  const result = {} as Pick<T, K[number]>;

  keys.forEach(key => {
    result[key] = obj[key];
  });

  return result;
};
