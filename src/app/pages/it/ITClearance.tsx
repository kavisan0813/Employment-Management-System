import { useEffect, useState } from "react";
import { CheckCircle2, Laptop, ShieldCheck } from "lucide-react";
import { usePermissionKey } from "../../shared/permission-engine/usePermission";
import { P } from "../../shared/permission-engine/permissions";
import { OFFBOARDING_EXITS_KEY, OFFBOARDING_UPDATED_EVENT, publishClearance } from "../../features/Offboarding/services/offboardingWorkflow";
import type { ExitEmployee } from "../../features/Offboarding/types/offboarding.types";

const readExits = (): ExitEmployee[] => {
  try { return JSON.parse(localStorage.getItem(OFFBOARDING_EXITS_KEY) || "[]"); } catch { return []; }
};

export function ITClearance() {
  const canClear = usePermissionKey(P.OFFBOARDING_CLEARANCE_IT);
  const [exits, setExits] = useState<ExitEmployee[]>(readExits);

  useEffect(() => {
    const refresh = () => setExits(readExits());
    window.addEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(OFFBOARDING_UPDATED_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const pending = exits.filter((exit) => exit.clearance.find((item) => item.dept === "IT")?.status !== "cleared");
  return <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
    <div className="flex items-center gap-4"><div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center"><Laptop className="text-sky-600" /></div><div><h1 className="text-2xl font-bold">IT Clearance</h1><p className="text-sm text-muted-foreground">Complete asset return and access-revocation sign-off.</p></div></div>
    {pending.length === 0 ? <div className="rounded-2xl border p-8 text-center text-muted-foreground">No IT clearances are pending.</div> : <div className="space-y-3">{pending.map((exit) => <div key={exit.id} className="rounded-2xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"><div><p className="font-bold">{exit.name}</p><p className="text-sm text-muted-foreground">{exit.designation} · LWD: {exit.lwd}</p><p className="text-xs text-muted-foreground mt-2">Confirm laptop/assets returned, email disabled, VPN disabled, and access removed.</p></div>{canClear && <button onClick={() => publishClearance(exit.name, "IT")} className="px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-sm font-bold flex items-center gap-2"><ShieldCheck size={16}/> Approve IT Clearance</button>}</div>)}</div>}
    <div className="text-xs text-muted-foreground flex items-center gap-2"><CheckCircle2 size={14} className="text-[#00B87C]"/> Approved clearances update Offboarding Details automatically.</div>
  </div>;
}
