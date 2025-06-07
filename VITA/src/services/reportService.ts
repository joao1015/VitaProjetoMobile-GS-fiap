// src/services/reportService.ts
import { api } from "./api"; 

export interface Report {
  id?: number;
  userId: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  date: string;
}

export const getAllReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>("/reports");
  return data;
};
