import { IQuest, SeasonEnumType } from '../base-quests';

export interface ISeasonalQuest extends IQuest {
  season: SeasonEnumType;
}

export interface IGetSeasonalQuestRequest {
  id: number;
}

export interface IPostSeasonalQuestRequest extends Omit<ISeasonalQuest, 'id' | 'questType' | 'statistics'> {}

export interface IPutSeasonalQuestRequest extends Omit<ISeasonalQuest, 'questType' | 'statistics'> {}

export interface IPatchSeasonalQuestRequest extends Partial<Omit<ISeasonalQuest, 'questType'>> {
  id: number;
}

export interface IDeleteSeasonalQuestRequest {
  id: number;
}
