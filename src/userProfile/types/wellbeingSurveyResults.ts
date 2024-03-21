import {
  ChronologicalUserProfileRecord,
  ChronologicalUserProfileDataGroup,
} from '.';

export interface WellbeingSurveyResult extends ChronologicalUserProfileRecord {
  datagroups: [
    {
      code: 'wellbeing_dimension';
      label: 'Wellbeing Dimension';
      description: string;
      data: null;
      source: null;
      subgroups: Array<WellbeingSurveyDimensionResult>;
    }
  ];
}

export interface WellbeingSurveyDimensionResult
  extends ChronologicalUserProfileDataGroup {
  code: 'happiness' | 'thriving' | 'resilience' | 'authenticity';
  label: 'Happiness' | 'Thriving' | 'Resilience' | 'Authenticity';
  data: number;
  source: string;
  subgroups: Array<WellbeingSurveySubdimensionResult>;
}

export interface WellbeingSurveySubdimensionResult
  extends ChronologicalUserProfileDataGroup {
  code:
    | 'quality_of_work'
    | 'quality_of_life'
    | 'work_life_dynamics'
    | 'relational_connectedness'
    | 'spiritual_vitality'
    | 'meaning_in_life'
    | 'self_regulation'
    | 'optimism'
    | 'hardiness'
    | 'self_integrity'
    | 'personal_growth'
    | 'authenticity_at_work';
  label:
    | 'Quality of Work'
    | 'Quality of Life'
    | 'Work Life Dynamics'
    | 'Authenticity'
    | 'Relational Connectedness'
    | 'Spiritual Vitality'
    | 'Meaning in Life'
    | 'Self Regulation'
    | 'Optimism'
    | 'Hardiness'
    | 'Self Integrity'
    | 'Personal Growth'
    | 'Authenticity at Work';
  data: number;
  source: string;
  subgroups: Array<any>;
}
