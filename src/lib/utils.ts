import { customAlphabet } from 'nanoid';

export const generateId = (length = 21) => {
  const alphabets =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return customAlphabet(alphabets, length)();
};

export const excludeFields = <T>(object: T, keys: Array<keyof T>): T => {
  if (!Object.keys(object).length) return object;
  const result = { ...object };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};
