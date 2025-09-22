const cache = new Map<string, any>();

export const cacheUtils = {
  get: <T>(key: string): T | undefined => {
    return cache.get(key);
  },

  set: <T>(key: string, value: T): void => {
    cache.set(key, value);
  },

  has: (key: string): boolean => {
    return cache.has(key);
  },
};
