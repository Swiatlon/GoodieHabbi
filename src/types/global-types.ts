export type NullableString = string | null;
export type NullableDate = Date | null;
export type NullableNumber = number | null;

export type UndefinedString = string | undefined;

export interface IApiError {
  data?: {
    message?: string;
  };
}
