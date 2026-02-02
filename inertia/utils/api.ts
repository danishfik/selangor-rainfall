import axios from "axios";
import type { AxiosResponse } from "axios";

interface ApiService {
  apiCall<T = unknown>(
    method: "GET" | "POST",
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<T>>;
}

const apiService: ApiService = {
  async apiCall<T = unknown>(
    method: "GET" | "POST",
    endpoint: string,
    params = {}
  ): Promise<AxiosResponse<T>> {
    const baseUrl = import.meta.env.VITE_URL_API || "";
    const isExternal = endpoint.startsWith('http');
    const url = isExternal ? endpoint : baseUrl + endpoint;

    const config = {
      withCredentials: !isExternal,
      ...(method === "GET" && { params })
    };

    try {
      if (method === "GET") {
        return await axios.get<T>(url, config);
      } else {
        return await axios.post<T>(url, params, config);
      }
    } catch (err) {
      throw err;
    }
  }
};

export default apiService;