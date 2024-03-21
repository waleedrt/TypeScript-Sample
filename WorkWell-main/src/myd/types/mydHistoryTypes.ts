export interface MYDHistoryEntry {
  start: string;
  end: string;
  datagroups: Array<{
    code: 'map_your_day';
    label: 'Map Your Day';
    description: 'Map Your Day Data';
    subgroups: Array<
      MYDHistoryDailyAverageWellbeingEntry | MYDHistoryDailyReflectionEntry
    >;
  }>;
}

export interface MYDProcessedHistory {
  [key: string]: {
    averageWellbeing: number | null;
    negativeEvent: string | null;
    positiveEvent: string | null;
  };
}

export interface MYDHistoryDailyAverageWellbeingEntry {
  code: 'daily_average_wellbeing';
  label: 'Daily Average Wellbeing';
  description: 'Average Wellbeing from MYD';
  data: number;
  source: 'Map Your Day';
}

export interface MYDHistoryDailyReflectionEntry {
  code: 'daily_reflection';
  label: 'Daily Reflection';
  description: 'Daily Reflection Data';
  data: {
    negative: string;
    positive: string;
  };
  source: 'Map Your Day';
}
