import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RecruitmentProvider, EmployeesProvider } from "./context/AppContext";
import { WorkflowProvider } from "./context/WorkflowContext";
import { AuthProvider } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <WorkflowProvider>
          <EmployeesProvider>
            <RecruitmentProvider>
              <RouterProvider router={router} />
            </RecruitmentProvider>
          </EmployeesProvider>
        </WorkflowProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}
