import { IQuest, SeasonEnumType } from '../base-quests';

export interface ISeasonalQuest extends IQuest {
  season: SeasonEnumType | null;
}

export interface IGetSeasonalQuestRequest {
  id: number;
}

export interface IPostSeasonalQuestRequest extends Omit<ISeasonalQuest, 'id' | 'type'> {}

export interface IPutSeasonalQuestRequest extends Omit<ISeasonalQuest, 'type'> {}

export interface IPatchSeasonalQuestRequest extends Partial<Omit<ISeasonalQuest, 'type'>> {
  id: number;
}

export interface IDeleteSeasonalQuestRequest {
  id: number;
}
