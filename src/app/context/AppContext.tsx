import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  avatar: string | null;
  initials: string;
  type: string;
  location: string;
  rating: number;
  source: "LinkedIn" | "Indeed" | "Referral";
  interviewerAvatars: string[];
  interviewDate?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  postedAt: string;
  applicants: number;
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  role: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
}

export type Stage =
  | "Applied"
  | "Screening"
  | "Round 1"
  | "Round 2"
  | "Offer"
  | "Hired";

interface RecruitmentContextType {
  recruitmentPipeline: Record<Stage, Candidate[]>;
  addCandidate: (stage: Stage, candidate: Candidate) => void;
  deleteCandidate: (id: string, stage: Stage) => void;
  moveCandidate: (id: string, fromStage: Stage, toStage: Stage) => void;
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, "id" | "postedAt" | "applicants">) => void;
  deleteJob: (id: string) => void;
  interviews: ScheduledInterview[];
  scheduleInterview: (iv: Omit<ScheduledInterview, "id">) => void;
  cancelInterview: (id: string) => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(
  undefined,
);

export const RecruitmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pipeline, setPipeline] = useState<Record<Stage, Candidate[]>>({
    Applied: [],
    Screening: [],
    "Round 1": [],
    "Round 2": [],
    Offer: [],
    Hired: [],
  });
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);

  const addCandidate = (stage: Stage, candidate: Candidate) => {
    setPipeline((prev) => ({
      ...prev,
      [stage]: [...prev[stage], candidate],
    }));
  };

  const deleteCandidate = (id: string, stage: Stage) => {
    setPipeline((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((c) => c.id !== id),
    }));
  };

  const moveCandidate = (id: string, fromStage: Stage, toStage: Stage) => {
    setPipeline((prev) => {
      const candidate = prev[fromStage].find((c) => c.id === id);
      if (!candidate) return prev;
      return {
        ...prev,
        [fromStage]: prev[fromStage].filter((c) => c.id !== id),
        [toStage]: [...prev[toStage], candidate],
      };
    });
  };

  const addJob = (job: Omit<JobPosting, "id" | "postedAt" | "applicants">) => {
    setJobs((prev) => [
      ...prev,
      {
        ...job,
        id: `J${Date.now()}`,
        postedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        applicants: 0,
      },
    ]);
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const scheduleInterview = (iv: Omit<ScheduledInterview, "id">) => {
    setInterviews((prev) => [...prev, { ...iv, id: `IV${Date.now()}` }]);
  };

  const cancelInterview = (id: string) => {
    setInterviews((prev) => prev.filter((iv) => iv.id !== id));
  };

  return (
    <RecruitmentContext.Provider
      value={{
        recruitmentPipeline: pipeline,
        addCandidate,
        deleteCandidate,
        moveCandidate,
        jobs,
        addJob,
        deleteJob,
        interviews,
        scheduleInterview,
        cancelInterview,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (context === undefined) {
    throw new Error("useRecruitment must be used within a RecruitmentProvider");
  }
  return context;
};
