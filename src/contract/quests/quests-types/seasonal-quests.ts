import { IQuest, SeasonEnumType } from '../base-quests';

export interface ISeasonalQuest extends IQuest {
  season: SeasonEnumType | null;
}

export interface IGetSeasonalQuestRequest {
  id: number;
}

export interface IPostSeasonalQuestRequest extends Omit<ISeasonalQuest, 'id'> {}

export interface IPutSeasonalQuestRequest extends ISeasonalQuest {}

export interface IPatchSeasonalQuestRequest extends Partial<ISeasonalQuest> {
  id: number;
}
export interface IDeleteSeasonalQuestRequest {
  id: number;
}
