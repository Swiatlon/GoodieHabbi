export interface IStatsProfileResponse {
  quests: {
    completed: number;
    inProgress: number;
    currentTotal: number;
  };
  goals: {
    completed: number;
    inProgress: number;
    currentTotal: number;
  };
  xpProgress: {
    currentXp: number;
    level: number;
    nextLevelXpRequirement: number;
    isMaxLevel: boolean;
  };
}

export interface IStatsExtendedResponse {
  questStats: {
    totalCreated: number;
    totalCompleted: number;
    currentTotal: number;
    currentEverCompleted: number;
    currentCompleted: number;
  };
  goalStats: {
    currentTotal: number;
    currentCompleted: number;
    inProgress: number;
    totalCreated: number;
    totalCompleted: number;
    totalExpired: number;
  };
  xpStats: {
    currentXp: number;
    level: number;
    nextLevelXpRequirement: number;
    isMaxLevel: boolean;
  };
}
