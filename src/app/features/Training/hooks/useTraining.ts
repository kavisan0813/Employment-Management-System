import { useMemo, useState } from "react";
import { trainingService } from "../services/training.service";

export function useTraining() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  const records = useMemo(() => trainingService.list().filter((item) => {
    const matchesSearch = `${item.title} ${item.trainer} ${item.id}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (department === "All departments" || item.department === department) && (status === "All statuses" || item.status === status);
  }), [search, department, status]);
  return { records, search, setSearch, department, setDepartment, status, setStatus };
}
