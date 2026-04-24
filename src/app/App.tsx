import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RecruitmentProvider } from "./context/AppContext";

export default function App() {
  return (
    <RecruitmentProvider>
      <RouterProvider router={router} />
    </RecruitmentProvider>
  );
}
