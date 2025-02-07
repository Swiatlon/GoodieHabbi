import { IQuest } from '../base-quests';

export interface IOneTimeQuest extends IQuest {}

export interface IGetOneTimeQuestRequest {
  id: number;
}

export interface IDeleteOneTimeQuestRequest {
  id: number;
}

export interface IPostOneTimeQuestRequest extends Omit<IOneTimeQuest, 'id' | 'type'> {}

export interface IPutOneTimeQuestRequest extends Omit<IOneTimeQuest, 'type'> {}

export interface IPatchOneTimeQuestRequest extends Partial<Omit<IOneTimeQuest, 'type'>> {
  id: number;
}
