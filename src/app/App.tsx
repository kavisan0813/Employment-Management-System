import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RecruitmentProvider, EmployeesProvider } from "./context/AppContext";
import { WorkflowProvider } from "./context/WorkflowContext";
import { AuthProvider } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <WorkflowProvider>
          <EmployeesProvider>
            <RecruitmentProvider>
              <Toaster position="top-right" richColors />
              <RouterProvider router={router} />
            </RecruitmentProvider>
          </EmployeesProvider>
        </WorkflowProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}

