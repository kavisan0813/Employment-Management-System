import { BarChart3, CalendarDays, FileBarChart, Library, Plus, Settings2, Users } from "lucide-react";
import { useState } from "react";
import { P, usePermissions } from "../../shared/permission-engine";
import { activityItems } from "./constants/mockData";
import { Analytics } from "./components/Analytics";
import { CourseCatalog } from "./components/CourseCatalog";
import { Header } from "./components/Header";
import { MyLearning } from "./components/MyLearning";
import { StatsCards } from "./components/StatsCards";
import { TrainingFilters } from "./components/TrainingFilters";
import { TrainingTabs } from "./components/TrainingTabs";
import { useTraining } from "./hooks/useTraining";
import { useTrainingModals } from "./hooks/useTrainingModals";
import { AddCourseModal } from "./modals/AddCourseModal";
import { AssignCourseModal } from "./modals/AssignCourseModal";
import { CoursePlayerModal } from "./modals/CoursePlayerModal";
import type { TrainingView } from "./types/training.types";

function EmptyWorkspace({ title, description, icon: Icon }: { title: string; description: string; icon: typeof CalendarDays }) { return <div className="rounded-2xl border border-border bg-card p-10 text-center"><Icon className="mx-auto text-primary" size={30}/><h2 className="mt-3 font-bold">{title}</h2><p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p></div>; }

export function TrainingPage() {
  const { hasPermissionKey } = usePermissions();
  const canManage = hasPermissionKey(P.TRAINING_MANAGE) || hasPermissionKey(P.TRAINING_FULL);
  const canAssign = canManage || hasPermissionKey(P.TRAINING_ASSIGN);
  const [view, setView] = useState<TrainingView>("dashboard");
  const { records, search, setSearch, department, setDepartment, status, setStatus } = useTraining();
  const { modal, open, close } = useTrainingModals();
  const quickActions = [
    canManage && { label: "Create training", icon: Plus, action: () => open("create") },
    canAssign && { label: "Assign participants", icon: Users, action: () => open("assign") },
    canManage && { label: "Schedule training", icon: CalendarDays, action: () => open("create") },
    canManage && { label: "Upload materials", icon: Library, action: () => open("create") },
    { label: "View reports", icon: FileBarChart, action: () => setView("reports") },
  ].filter(Boolean) as Array<{ label: string; icon: typeof Plus; action: () => void }>;

  const dashboard = <div className="space-y-6"><StatsCards/><section><h2 className="mb-3 font-bold">Quick actions</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{quickActions.map(({ label, icon: Icon, action }) => <button key={label} onClick={action} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow"><span className="rounded-xl bg-primary/10 p-2 text-primary"><Icon size={18}/></span><span className="text-sm font-semibold">{label}</span></button>)}</div></section><Analytics/><section className="grid gap-4 xl:grid-cols-[1.8fr_1fr]"><div><TrainingFilters search={search} onSearch={setSearch} department={department} onDepartment={setDepartment} status={status} onStatus={setStatus}/><div className="mt-4"><TrainingTabs records={records} onDetails={() => open("details")}/></div></div><div className="rounded-2xl border border-border bg-card p-5"><h2 className="font-bold">Recent activity</h2><div className="mt-4 space-y-4">{activityItems.map((activity, i) => <div key={activity} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"/><div><p className="text-sm font-medium">{activity}</p><p className="mt-0.5 text-xs text-muted-foreground">{i + 1} hour{i ? "s" : ""} ago</p></div></div>)}</div></div></section></div>;
  const content: Record<TrainingView, React.ReactNode> = {
    dashboard,
    trainings: <div className="space-y-4"><TrainingFilters search={search} onSearch={setSearch} department={department} onDepartment={setDepartment} status={status} onStatus={setStatus}/><TrainingTabs records={records} onDetails={() => open("details")}/></div>,
    calendar: <Analytics/>,
    "my-training": <MyLearning/>,
    library: <CourseCatalog/>,
    reports: <EmptyWorkspace title="Training reports" description="Completion, participation, department, cost, hours, trainer performance, and feedback analysis are available from this workspace." icon={BarChart3}/>,
    settings: <EmptyWorkspace title="Training settings" description="Manage categories, types, delivery modes, trainer and skill masters, approval workflow, notifications, feedback templates, and reminders." icon={Settings2}/>,
    details: <CoursePlayerModal onClose={() => setView("trainings")}/>,
  };
  return <div className="w-full space-y-6 px-4 py-6 md:px-8"><Header view={view} onView={setView} canManage={canManage} onCreate={() => open("create")}/>{content[view]}{modal === "create" && <AddCourseModal onClose={close}/>} {modal === "assign" && <AssignCourseModal onClose={close}/>} {modal === "details" && <CoursePlayerModal onClose={close}/>}</div>;
}
