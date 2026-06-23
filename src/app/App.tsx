import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RecruitmentProvider } from "./context/AppContext";
import { WorkflowProvider } from "./context/WorkflowContext";
import { AuthProvider } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <WorkflowProvider>
          <RecruitmentProvider>
            <RouterProvider router={router} />
          </RecruitmentProvider>
        </WorkflowProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}
