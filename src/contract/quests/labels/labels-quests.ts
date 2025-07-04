export interface IQuestLabel {
  id: number;
  value: string;
  backgroundColor: string;
}

export interface IPostQuestLabelRequest {
  value: string;
  backgroundColor: string;
}

export interface IPatchQuestLabelRequest {
  id: number;
  value?: string;
  backgroundColor?: string;
}

export interface IDeleteQuestLabelRequest {
  id: number;
}

export interface IGetQuestLabelsRequest {}
