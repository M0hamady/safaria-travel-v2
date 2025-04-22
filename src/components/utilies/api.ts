// src/utils/api.ts

export const BASE_URL = "https://app.telefreik.com";

export const apiFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Attempt to extract a meaningful error message from the response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};
