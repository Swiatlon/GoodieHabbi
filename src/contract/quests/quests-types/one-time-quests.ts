import { IQuest } from '../base-quests';

export interface IOneTimeQuest extends IQuest {}

export interface IGetOneTimeQuestRequest {
  id: number;
}

export interface IDeleteOneTimeQuestRequest {
  id: number;
}

export interface IPostOneTimeQuestRequest extends Omit<IOneTimeQuest, 'id'> {}

export interface IPutOneTimeQuestRequest extends IOneTimeQuest {}

export interface IPatchQuestRequest extends Partial<IOneTimeQuest> {
  id: number;
}
