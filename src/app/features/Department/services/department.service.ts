import { Department } from "../types/department.types";

// Future API layer placeholder matching employee service structure
export const departmentService = {
  async getAll(): Promise<Department[]> {
    // API GET call
    return [];
  },
  async getById(): Promise<Department | null> {
    // API GET call
    return null;
  },
  async create(): Promise<void> {
    // API POST request
  },
  async update(): Promise<void> {
    // API PUT request
  },
  async delete(): Promise<void> {
    // API DELETE request
  },
};
