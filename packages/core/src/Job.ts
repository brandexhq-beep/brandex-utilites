export type JobStatus = 'IDLE' | 'STARTING' | 'PROCESSING' | 'COMPLETED' | 'ERROR' | 'CANCELLED';

export interface JobProgress {
  status: JobStatus;
  percentage: number;
  stage: string; // e.g. "Reading image", "Decoding", "Resizing"
  error?: string;
}

export interface IJob {
  id: string;
  utilityId: string;
  inputFiles: File[];
  progress: JobProgress;
  outputFiles: File[];
}
