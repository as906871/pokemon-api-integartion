export const createAxiosClient = () => {
  const cache = new Map<string, any>();
  let abortController: AbortController | null = null;

  const get = async <T>(url: string): Promise<T> => {
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    if (cache.has(url)) {
      return cache.get(url);
    }

    try {
      const response = await fetch(url, { signal: abortController.signal });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      cache.set(url, data);
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request cancelled");
      }
      throw error;
    }
  };

  return { get };
};

const axiosClient = createAxiosClient();
export default axiosClient;
