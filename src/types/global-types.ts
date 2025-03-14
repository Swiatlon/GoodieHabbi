export type NullableString = string | null;
export type NullableDate = Date | null;
export type NullableNumber = number | null;

export interface IApiError {
  data?: {
    message?: string;
  };
}
