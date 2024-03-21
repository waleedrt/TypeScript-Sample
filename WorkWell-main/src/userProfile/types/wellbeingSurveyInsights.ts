import {
  ChronologicalUserProfileRecord,
  ChronologicalUserProfileDataGroup,
} from '.';

export interface WellbeingSurveyInsightsRecord
  extends ChronologicalUserProfileRecord {
  datagroups: [
    {
      code: 'wellbeing_insight';
      label: 'Wellbeing Insight';
      description: string;
      data: null;
      source: null;
      subgroups: Array<WellbeingSurveyDimensionInsights>;
    }
  ];
}

export interface WellbeingSurveyDimensionInsights
  extends ChronologicalUserProfileDataGroup {
  code: 'happiness' | 'thriving' | 'resilience' | 'authenticity';
  label:
    | 'Insight: Happiness'
    | 'Insight: Thriving'
    | 'Insight: Resilience'
    | 'Insight: Authenticity';
  data: [string, string];
  source: string;
}
