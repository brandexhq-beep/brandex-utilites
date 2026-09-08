export interface IBrandexUtility {
  metadata: {
    id: string;
    name: string;
    description: string;
    category: string;
    capabilities: ('Local' | 'Hybrid' | 'Server')[];
  };
  // Future: Add validation, UI component, and worker definition
}
