/**
 * BrandEX Worker Engine
 * Thread pooling and lifecycle management for offscreen browser processing.
 */

export interface WorkerTask<TInput = unknown, TOutput = unknown> {
  id: string;
  type: string;
  payload: TInput;
  onSuccess?: (result: TOutput) => void;
  onError?: (error: Error) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private activeCount: number = 0;

  constructor(private readonly maxWorkers: number = 4) {}

  public get capacity(): number {
    return this.maxWorkers;
  }

  public get isBusy(): boolean {
    return this.activeCount >= this.maxWorkers;
  }
}
