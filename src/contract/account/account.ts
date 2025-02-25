export interface IPostRegisterRequest {
  email: string;
  password: string;
}

export interface IPostRegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPostLoginRequest {
  login: string;
  password: string;
}

export interface IPostLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPostRefreshRequest {
  refreshToken: string;
}

export interface IPostRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IDecodedJwt {
  accountId: number;
  exp: number;
}
