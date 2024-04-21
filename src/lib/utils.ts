import { customAlphabet } from 'nanoid';

export const generateId = (length = 21) => {
  const alphabets =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return customAlphabet(alphabets, length)();
};
