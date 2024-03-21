export interface ChronologicalUserProfileRecord {
  start: string;
  end: string;
  datagroups: Array<ChronologicalUserProfileDataGroup>;
}

export interface ChronologicalUserProfileDataGroup {
  code: string;
  label: string;
  description: string;
  data: any;
  source: string | null;
  subgroups: Array<ChronologicalUserProfileDataGroup>;
}

export * from './wellbeingSurveyInsights';
export * from './wellbeingSurveyResults';
