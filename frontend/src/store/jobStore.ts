import { create } from 'zustand';

export interface Job {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputImageUrl: string;
  generatedImages?: any;
  generatedContent?: any;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  addJob: (job: Job) => void;
  updateJob: (id: number, updates: Partial<Job>) => void;
  setCurrentJob: (job: Job | null) => void;
  setJobs: (jobs: Job[]) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  currentJob: null,

  addJob: (job: Job) =>
    set((state) => ({
      jobs: [job, ...state.jobs],
    })),

  updateJob: (id: number, updates: Partial<Job>) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
      currentJob: state.currentJob?.id === id ? { ...state.currentJob, ...updates } : state.currentJob,
    })),

  setCurrentJob: (job: Job | null) => set({ currentJob: job }),

  setJobs: (jobs: Job[]) => set({ jobs }),
}));
