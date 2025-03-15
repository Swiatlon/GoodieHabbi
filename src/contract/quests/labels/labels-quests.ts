export interface IQuestLabel {
  id: number;
  value: string;
  backgroundColor: string;
  textColor: string;
}

export interface IPostQuestLabelRequest {
  value: string;
  backgroundColor: string;
  textColor: string;
}

export interface IPatchQuestLabelRequest {
  id: number;
  value?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface IDeleteQuestLabelRequest {
  id: number;
}

export interface IGetQuestLabelsRequest {}
