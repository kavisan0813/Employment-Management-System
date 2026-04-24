import React, { createContext, useContext, useState, ReactNode } from 'react';

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

export type Stage = "Applied" | "Screening" | "Round 1" | "Round 2" | "Offer" | "Hired";

interface RecruitmentContextType {
  recruitmentPipeline: Record<Stage, Candidate[]>;
  addCandidate: (stage: Stage, candidate: Candidate) => void;
  deleteCandidate: (id: string, stage: Stage) => void;
  moveCandidate: (id: string, fromStage: Stage, toStage: Stage) => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

export const RecruitmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pipeline, setPipeline] = useState<Record<Stage, Candidate[]>>({
    Applied: [],
    Screening: [],
    "Round 1": [],
    "Round 2": [],
    Offer: [],
    Hired: [],
  });

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

  return (
    <RecruitmentContext.Provider
      value={{ recruitmentPipeline: pipeline, addCandidate, deleteCandidate, moveCandidate }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (context === undefined) {
    throw new Error('useRecruitment must be used within a RecruitmentProvider');
  }
  return context;
};
