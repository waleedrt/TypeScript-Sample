export type historySingleWorkflowType = {
  name: string;
  stepTypes: Array<string>; // Could be more specific
  finished: string | null;
  stepData: Array<{ question: string; answer: string }>;
};

export type historySingleEngagementType = {
  engagementDate: string;
  finished: string;
  collection: string;
  workflowsCompleted: Array<historySingleWorkflowType>;
};

export type collectionEngagementHistoryType = Array<
  historySingleEngagementType
>;
