import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { Users, Headphones, Monitor, AlertCircle, Copy } from "lucide-react";

export function ContactSupportSection({
  onModal,
  navigate,
}: {
  onModal: (m: string | null) => void;
  navigate: (p: string) => void;
}) {
  return (
    <div>
      <Breadcrumb active="Contact HR / Support" />
      <h2 className="text-[22px] font-black text-foreground mb-5">
        Contact HR & Support
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            icon: Headphones,
            bg: "#E0F2FE",
            color: "#0EA5E9",
            title: "Raise a Support Ticket",
            desc: "For IT issues, HR requests, payroll queries",
            btn: "Create Ticket",
            onClick: () => navigate("/support"),
          },
          {
            icon: Users,
            bg: "var(--secondary)",
            color: "var(--primary)",
            title: "Contact HR Team",
            desc: "For policy questions, personal matters, HR issues",
            email: "hr@viyanhr.com",
            phone: "+91 80 1234 5678",
          },
          {
            icon: Monitor,
            bg: "#EDE9FE",
            color: "#8B5CF6",
            title: "IT Helpdesk",
            desc: "For laptop, software, VPN, access issues",
            email: "it@viyanhr.com",
            onClick: () => navigate("/support"),
          },
          {
            icon: AlertCircle,
            bg: "#FEE2E2",
            color: "#EF4444",
            title: "Emergency",
            desc: "For urgent matters requiring immediate attention",
            phone: "+91 98765 00000",
            emergency: true,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: card.bg }}
              >
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <p className="text-[16px] font-black text-foreground mb-1">
                {card.title}
              </p>
              <p className="text-[13px] font-bold text-muted-foreground mb-4">
                {card.desc}
              </p>
              {card.email && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-black text-primary">
                    {card.email}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(card.email!);
                      showToast("Copied", "success", "Email copied!");
                    }}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-all"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                </div>
              )}
              {card.phone && !card.emergency && (
                <p className="text-[13px] font-bold text-muted-foreground mb-3">
                  {card.phone}
                </p>
              )}
              {card.emergency && (
                <>
                  <p className="text-[15px] font-black text-rose-500">
                    {card.phone}
                  </p>
                  <p className="text-[12px] font-bold text-muted-foreground italic mt-1">
                    Only for genuine emergencies
                  </p>
                </>
              )}
              {card.btn && (
                <button
                  onClick={card.onClick}
                  className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {card.btn}
                </button>
              )}
              {card.email && !card.btn && (
                <button
                  onClick={() => onModal("email")}
                  className="w-full mt-3 py-2.5 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all"
                >
                  Send Email
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Label>YOUR DEDICATED CONTACTS</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
        {[
          {
            initials: "RP",
            gradient: "linear-gradient(135deg, #00B87C, #059669)",
            name: "Ryan Park",
            role: "HR Administrator",
            email: "ryan@viyanhr.com",
          },
          {
            initials: "SI",
            gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
            name: "Suresh Iyer",
            role: "Engineering Manager",
            email: "suresh@viyanhr.com",
          },
          {
            initials: "IT",
            gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)",
            name: "IT Support Team",
            role: "Information Technology",
            email: "it@viyanhr.com",
          },
          {
            initials: "AD",
            gradient: "linear-gradient(135deg, #00B87C, #059669)",
            name: "Ananya Das",
            role: "Finance Officer",
            email: "ananya@viyanhr.com",
          },
        ].map((contact, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-b-0 hover:bg-[#00B87C]/[0.08] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-sm"
                style={{ background: contact.gradient }}
              >
                {contact.initials}
              </div>
              <div>
                <p className="text-[14px] font-black text-foreground">
                  {contact.name}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground">
                  {contact.role}
                </p>
                <p className="text-[12px] font-black text-primary">
                  {contact.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => onModal("message")}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all shrink-0"
            >
              {contact.name === "IT Support Team" ? "Raise Ticket" : "Message"}
            </button>
          </div>
        ))}
      </div>

      <Label>SUPPORT AVAILABILITY</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="space-y-3 mb-5">
          {[
            { label: "HR Team", hours: "Monday–Friday, 9:00 AM – 6:00 PM IST" },
            {
              label: "IT Support",
              hours: "Monday–Saturday, 8:00 AM – 8:00 PM IST",
            },
            { label: "Emergency", hours: "24/7" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-muted-foreground">
                {item.label}
              </span>
              <span className="text-[14px] font-black text-foreground">
                {item.hours}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[13px] font-black text-primary">
            HR Team is currently available
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
   ═══════════════════════════════════════════ */
