import api from "@/api/axios";
import { APIError } from "@/api/errors";
import type { ApiResponse } from "@/api/types";

export async function apiGet<T>(url: string) {
  try {
    const res = await api.get<ApiResponse<T>>(url);
    return res.data.data;
  } catch (err: any) {
    throw new APIError(
      err.response?.data?.message || "Error",
      err.response?.status
    );
  }
}

export async function apiPost<T>(url: string, body: any) {
  try {
    const res = await api.post<ApiResponse<T>>(url, body);
    return res.data.data;
  } catch (err: any) {
    throw new APIError(
      err.response?.data?.message || "Error",
      err.response?.status
    );
  }
}

export async function apiPut<T>(url: string, body: any) {
  try {
    const res = await api.put<ApiResponse<T>>(url, body);
    return res.data.data;
  } catch (err: any) {
    throw new APIError(
      err.response?.data?.message || "Error",
      err.response?.status
    );
  }
}

export async function apiDelete<T>(url: string) {
  try {
    const res = await api.delete<ApiResponse<T>>(url);
    return res.data.data;
  } catch (err: any) {
    throw new APIError(
      err.response?.data?.message || "Error",
      err.response?.status
    );
  }
}
