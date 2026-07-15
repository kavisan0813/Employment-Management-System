import { EditEmployeeModal } from "../modals/EditEmployeeModal";
import { DeleteEmployeeModal } from "../modals/DeleteEmployeeModal";
import { ImportEmployeeModal as BulkImportModal } from "../modals/ImportEmployeeModal"; // renamed for clarity
import { Employee, EmployeeInput } from "../../../context/AppContext";

interface EmployeeModalsProps {
  showImportModal: boolean;
  editEmployee: Employee | null;
  deleteEmployee: Employee | null;
  onCloseImport: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onImport: (emps: EmployeeInput[]) => void;
  onSaveEdit: (
    id: string,
    form: {
      name: string;
      email: string;
      department: string;
      designation: string;
      salary: string;
      joinDate: string;
      status: string;
    },
  ) => void;
  onConfirmDelete: () => void;
}

export function EmployeeModals({
  showImportModal,
  editEmployee,
  deleteEmployee,
  onCloseImport,
  onCloseEdit,
  onCloseDelete,
  onImport,
  onSaveEdit,
  onConfirmDelete,
}: EmployeeModalsProps) {
  return (
    <>
      {showImportModal && (
        <BulkImportModal onClose={onCloseImport} onImport={onImport} />
      )}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={onCloseEdit}
          onSave={onSaveEdit}
        />
      )}
      {deleteEmployee && (
        <DeleteEmployeeModal
          employee={deleteEmployee}
          onClose={onCloseDelete}
          onConfirm={onConfirmDelete}
        />
      )}
    </>
  );
}
