import { useState } from "react";

export function useTrainingModals() {
  const [modal, setModal] = useState<"create" | "assign" | "details" | null>(null);
  return { modal, open: setModal, close: () => setModal(null) };
}
