import { IQuest } from '../base-quests';

export interface IOneTimeQuest extends IQuest {}

export interface IGetOneTimeQuestRequest {
  id: number;
}

export interface IDeleteOneTimeQuestRequest {
  id: number;
}

export interface IPostOneTimeQuestRequest extends Omit<IOneTimeQuest, 'id' | 'questType' | 'lastCompletedAt'> {}

export interface IPutOneTimeQuestRequest extends Omit<IOneTimeQuest, 'questType' | 'lastCompletedAt'> {}

export interface IPatchOneTimeQuestRequest extends Partial<Omit<IOneTimeQuest, 'questType'>> {
  id: number;
}
