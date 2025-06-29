import { IQuest, SeasonEnumType } from '../base-quests';

export interface ISeasonalQuest extends IQuest {
  season: SeasonEnumType;
}

export interface IGetSeasonalQuestRequest {
  id: number;
}

export interface IPostSeasonalQuestRequest extends Omit<ISeasonalQuest, 'id' | 'type' | 'statistics'> {}

export interface IPutSeasonalQuestRequest extends Omit<ISeasonalQuest, 'type' | 'statistics'> {}

export interface IPatchSeasonalQuestRequest extends Partial<Omit<ISeasonalQuest, 'type'>> {
  id: number;
}

export interface IDeleteSeasonalQuestRequest {
  id: number;
}
