import {
  FileText,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────── */
/* Document Preview Graphic Content Components                    */
/* ─────────────────────────────────────────────────────────────── */
export function DocumentPreviewContent({ docName }: { docName: string }) {
  const nameLower = docName.toLowerCase();
  if (nameLower.includes("aadhar")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-white to-slate-50 text-slate-800 rounded-2xl border-2 border-emerald-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-emerald-500/30 pb-2">
          <div>
            <p className="text-[10px] font-extrabold text-emerald-800 tracking-wide leading-none">
              Government of India
            </p>
            <p className="text-[8px] text-slate-500 font-bold mt-0.5 leading-none">
              Unique Identification Authority of India
            </p>
          </div>
          <div className="text-right">
            <span className="bg-emerald-600 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Aadhaar
            </span>
          </div>
        </div>

        {/* Middle Body */}
        <div className="flex gap-4 my-2.5 items-center flex-1">
          {/* Mock photo */}
          <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-slate-400 font-black text-xl">PS</div>
          </div>
          <div className="space-y-1 text-[9.5px] font-bold text-slate-700">
            <p className="text-[11px] font-black text-slate-900 leading-tight">
              Priya Sharma
            </p>
            <p>
              <span className="text-slate-400">DOB:</span> 15/08/1995
            </p>
            <p>
              <span className="text-slate-400">Gender:</span> Female
            </p>
            <p className="text-[8px] leading-tight text-slate-500 font-normal">
              <span className="font-bold text-slate-600">Address:</span> Flat
              402, Green Meadows, Velachery, Chennai - 600042
            </p>
          </div>
        </div>

        {/* Bottom Number */}
        <div className="border-t border-emerald-500/30 pt-2 flex flex-col items-center justify-center">
          <p className="text-[14px] font-black text-slate-900 tracking-widest leading-none">
            5482 1902 4321
          </p>
          <p className="text-[7px] text-emerald-700 font-black tracking-widest mt-1 uppercase">
            Mera Aadhaar, Meri Pehchan
          </p>
        </div>

        {/* Subtle Watermark logo */}
        <div className="absolute right-2 bottom-6 opacity-5 pointer-events-none">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-orange-500"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>
    );
  }
  if (nameLower.includes("pan card")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-2xl border border-teal-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/20 pb-2">
          <div>
            <p className="text-[9px] font-black tracking-wider uppercase text-emerald-400">
              Income Tax Department
            </p>
            <p className="text-[7px] text-slate-300 tracking-widest uppercase">
              Govt. Of India
            </p>
          </div>
          <span className="text-[7px] font-black uppercase text-emerald-400 border border-emerald-400/40 px-1 py-0.5 rounded">
            Permanent Account Number
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-4 my-2 items-center flex-1">
          <div className="w-16 h-20 bg-white/10 border border-white/20 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-emerald-400 font-black text-xl">PS</div>
          </div>
          <div className="space-y-1 text-[9px] font-bold text-slate-200">
            <p className="text-[11px] font-black text-white leading-tight">
              PRIYA SHARMA
            </p>
            <p>
              <span className="text-slate-400 uppercase text-[8px]">
                Father's Name:
              </span>{" "}
              RAJESH SHARMA
            </p>
            <p>
              <span className="text-slate-400 uppercase text-[8px]">
                Date of Birth:
              </span>{" "}
              15/08/1995
            </p>
            <p className="text-[12px] font-black text-emerald-400 tracking-wider mt-1.5">
              BPWPS1234P
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[7px] text-slate-400 font-bold">
          <span>Holder's Signature</span>
          <span className="font-mono text-[9px] text-emerald-400">
            ✔ VERIFIED
          </span>
        </div>
      </div>
    );
  }
  if (nameLower.includes("passport")) {
    return (
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl border border-indigo-500/20 shadow-lg p-5 flex flex-col justify-between relative overflow-hidden text-left font-sans select-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/20 pb-2">
          <div>
            <p className="text-[9px] font-black tracking-wider uppercase text-amber-400">
              Republic of India
            </p>
            <p className="text-[7px] text-slate-300 tracking-widest uppercase">
              Passport / पारपत्र
            </p>
          </div>
          <span className="text-[10px] font-black tracking-wider text-amber-400">
            IND
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-4 my-2 items-center flex-1">
          <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-[8px] flex items-center justify-center overflow-hidden shrink-0">
            <div className="text-amber-400 font-black text-xl">PS</div>
          </div>
          <div className="space-y-1 text-[8.5px] font-bold text-slate-300">
            <p className="text-[10px] font-black text-white leading-tight">
              SHARMA PRIYA
            </p>
            <p>
              <span className="text-slate-400">Nationality:</span> INDIAN
            </p>
            <p>
              <span className="text-slate-400">Sex:</span> F
            </p>
            <p>
              <span className="text-slate-400">DOB:</span> 15 AUG 1995
            </p>
            <p>
              <span className="text-slate-400">Passport No:</span> Z7654321
            </p>
            <p className="text-[7.5px] text-amber-400/80">
              Expiry Date: 20 JUN 2031
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-2 text-center text-[7px] text-slate-400 tracking-widest font-mono">
          P&lt;INDSHARMA&lt;&lt;PRIYA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>
      </div>
    );
  }

  // Letters (Offer Letter, Appointment Letter, NDA, appraisal, etc.)
  if (
    nameLower.includes("letter") ||
    nameLower.includes("nda") ||
    nameLower.includes("appraisal")
  ) {
    return (
      <div className="w-full aspect-[3/4] bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col justify-between text-left font-serif select-none relative">
        <div className="absolute inset-0 bg-[#00B87C]/[0.01] pointer-events-none" />

        {/* Header */}
        <div className="border-b-2 border-[#00B87C] pb-3 text-center font-sans">
          <h4 className="text-[14px] font-black text-[#00B87C] uppercase tracking-widest">
            viyanHR Technologies
          </h4>
          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Innovating Human Resources
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 my-4 space-y-3">
          <div className="flex justify-between items-center text-[8px] font-sans font-bold text-slate-500 uppercase">
            <span>Ref: NHR/2021/EMP-0142</span>
            <span>Date: 12th March 2021</span>
          </div>

          <h5 className="text-[10px] font-extrabold text-slate-900 uppercase text-center tracking-wide font-sans">
            {docName}
          </h5>

          <p className="text-[9px] leading-relaxed">
            Dear <strong>Priya Sharma</strong>,
          </p>

          <p className="text-[8px] leading-relaxed text-slate-600">
            {nameLower.includes("offer") &&
              "We are pleased to offer you the position of Senior Frontend Developer at viyanHR Technologies. Your expertise and passion will be a tremendous asset to our engineering division."}
            {nameLower.includes("appointment") &&
              "This letter serves to confirm your formal appointment as Senior Frontend Developer. You will report to Arjun Reddy and will be based out of our Chennai operations."}
            {nameLower.includes("nda") &&
              "This Non-Disclosure Agreement governs the confidentiality of proprietary engineering designs, codebase resources, client datasets, and internal corporate information."}
            {nameLower.includes("appraisal") &&
              "Based on your exceptional performance rating of 4.5/5 and high completion rate of 924 tasks, your appraisal cycle review confirms an increment in tenure benefits."}
          </p>

          <p className="text-[8px] leading-relaxed text-slate-600">
            Please review the details regarding work parameters and department
            standards. We look forward to your continued contribution.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end border-t border-slate-100 pt-3 font-sans">
          <div>
            <p className="text-[7px] font-black text-slate-800">
              Sarah Mitchell
            </p>
            <p className="text-[6px] text-slate-500 font-bold uppercase">
              VP, Human Resources
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-emerald-500/20 bg-emerald-50 text-[6px] text-[#00B87C] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              Officially Signed
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Educational Certificate
  if (nameLower.includes("certificate") || nameLower.includes("degree")) {
    return (
      <div className="w-full aspect-[4/3] bg-[#FCFBF7] text-slate-800 rounded-2xl border-4 border-double border-amber-800/20 shadow-md p-6 flex flex-col justify-between text-center font-serif select-none relative">
        <div className="absolute inset-2 border border-amber-800/10 pointer-events-none" />

        <h4 className="text-[13px] font-extrabold tracking-widest text-amber-900 uppercase">
          Board of Technical Education
        </h4>
        <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider -mt-1 font-sans">
          Tamil Nadu, India
        </p>

        <div className="my-2 space-y-1.5">
          <p className="text-[8px] italic text-slate-600 font-sans">
            This is to certify that
          </p>
          <p className="text-[13px] font-extrabold text-slate-900 tracking-wide font-serif">
            Priya Sharma
          </p>
          <p className="text-[8px] leading-relaxed text-slate-600">
            has successfully completed the program of study and passed the
            examinations prescribed for the degree of
          </p>
          <p className="text-[11px] font-extrabold text-amber-900 tracking-wide font-serif">
            Bachelor of Technology
          </p>
          <p className="text-[8px] font-bold text-slate-500 font-sans">
            in Computer Science and Engineering
          </p>
        </div>

        <div className="flex justify-between items-end border-t border-slate-200/50 pt-2 font-sans text-[7px] font-bold text-slate-600">
          <div>
            <p className="italic text-slate-400">Class: First Class</p>
            <p className="text-left mt-0.5">Year: 2017</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-amber-800/20 flex items-center justify-center bg-amber-800/5 text-amber-800 text-[6px] font-black uppercase shrink-0 shadow-inner">
            SEAL
          </div>
          <div className="text-right">
            <p>Registrar Signature</p>
            <p className="text-slate-400">Verified</p>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback card
  return (
    <div className="w-full aspect-[3/4] bg-secondary rounded-2xl border border-border p-6 flex flex-col justify-between text-left font-sans select-none relative">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileText size={22} />
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-primary text-[10px] font-bold border border-primary/20">
          ✔ VERIFIED
        </span>
      </div>

      <div className="flex-1 my-6 flex flex-col justify-center gap-1.5">
        <h4 className="text-[15px] font-black text-foreground">{docName}</h4>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          EMPLOYEE RECORD
        </p>
        <div className="h-px bg-border/50 my-2" />
        <div className="space-y-1 text-[11px] text-muted-foreground font-semibold">
          <p>
            <span className="text-slate-400">Owner:</span> Priya Sharma
          </p>
          <p>
            <span className="text-slate-400">Uploaded:</span> Yes
          </p>
          <p>
            <span className="text-slate-400">Verification Date:</span> Jan 12,
            2026
          </p>
          <p>
            <span className="text-slate-400">File Type:</span> Secured Document
          </p>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-bold border-t border-border/50 pt-3 text-center tracking-widest font-mono">
        NHR-SECURE-DOC-ID-9874
      </div>
    </div>
  );
}

export function EmployeeDocuments() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Employee Documents</h1>
      <DocumentPreviewContent docName="Aadhaar Card" />
    </div>
  );
}

export default EmployeeDocuments;
