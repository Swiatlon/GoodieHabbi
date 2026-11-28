import { configureStore } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import authSlice, { setCredentials } from '../state/auth/auth-state';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

interface SentRequest {
  method: string;
  url: string;
  authorization: string | null;
  body: string;
}

const BASE_URL = 'https://goodiehabits.runasp.net/api';
const OLD_TOKEN = 'e30.eyJhY2NvdW50SWQiOjF9.old';
const NEW_TOKEN = 'e30.eyJhY2NvdW50SWQiOjF9.new';
const ACCOUNT_URL = 'accounts/me';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const sent: SentRequest[] = [];
let respond: (request: SentRequest) => Response;

// `fetchBaseQuery` captures `fetch` when it is created, so the mock has to exist before the module is loaded.
global.fetch = jest.fn(async (input: Request) => {
  const request = { method: input.method, url: input.url, authorization: input.headers.get('authorization'), body: await input.clone().text() };
  sent.push(request);

  return respond(request);
}) as unknown as typeof fetch;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { baseQueryWithReauth } = require('./base-query') as typeof import('./base-query');

const createStore = () => {
  const store = configureStore({ reducer: { authSlice } });
  store.dispatch(setCredentials({ accessToken: OLD_TOKEN }));

  return store;
};

const run = (store: ReturnType<typeof createStore>, args: Parameters<typeof baseQueryWithReauth>[0]) =>
  baseQueryWithReauth(
    args,
    {
      dispatch: store.dispatch,
      getState: store.getState,
      signal: new AbortController().signal,
      abort: () => {},
      extra: undefined,
      endpoint: 'test',
      type: 'query',
    },
    {}
  );

const isRefresh = (request: SentRequest) => request.url === `${BASE_URL}/auth/refresh-token`;
const expiredUntilRefreshed = (request: SentRequest) => {
  if (isRefresh(request)) return json(200, { accessToken: NEW_TOKEN });

  return request.authorization === `Bearer ${NEW_TOKEN}` ? json(200, { ok: true }) : json(401, {});
};

describe('baseQueryWithReauth', () => {
  beforeEach(() => {
    sent.length = 0;
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue('stored-refresh-token');
    jest.mocked(SecureStore.deleteItemAsync).mockClear();
  });

  it('refreshes on 401 and repeats the request with the new access token', async () => {
    respond = expiredUntilRefreshed;
    const store = createStore();

    const result = await run(store, ACCOUNT_URL);

    expect(result.data).toEqual({ ok: true });
    expect(sent.map(r => `${r.method} ${r.url}`)).toEqual([
      `GET ${BASE_URL}/accounts/me`,
      `POST ${BASE_URL}/auth/refresh-token`,
      `GET ${BASE_URL}/accounts/me`,
    ]);
    expect(JSON.parse(sent[1].body)).toEqual({ refreshToken: 'stored-refresh-token' });
    expect(store.getState().authSlice.token).toBe(NEW_TOKEN);
  });

  it('refreshes once for requests that expire together', async () => {
    respond = expiredUntilRefreshed;
    const store = createStore();

    const results = await Promise.all([run(store, ACCOUNT_URL), run(store, 'quests')]);

    expect(results.map(r => r.data)).toEqual([{ ok: true }, { ok: true }]);
    expect(sent.filter(isRefresh)).toHaveLength(1);
  });

  it.each([400, 401])('logs out when the refresh token is refused with %i', async status => {
    respond = request => json(isRefresh(request) ? status : 401, {});
    const store = createStore();

    const result = await run(store, ACCOUNT_URL);

    expect(result.error?.status).toBe(401);
    expect(store.getState().authSlice.token).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
    expect(sent).toHaveLength(2);
  });

  it('keeps the session when the refresh fails on the server side', async () => {
    respond = request => json(isRefresh(request) ? 500 : 401, {});
    const store = createStore();

    await run(store, ACCOUNT_URL);

    expect(store.getState().authSlice.token).toBe(OLD_TOKEN);
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('logs out when there is no stored refresh token', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    respond = () => json(401, {});
    const store = createStore();

    await run(store, ACCOUNT_URL);

    expect(store.getState().authSlice.token).toBeNull();
    expect(sent).toHaveLength(1);
  });

  it('does not sign the user back in when they log out during a refresh', async () => {
    const store = createStore();
    respond = request => {
      if (!isRefresh(request)) return json(401, {});

      store.dispatch(setCredentials({ accessToken: null }));
      return json(200, { accessToken: NEW_TOKEN });
    };

    await run(store, ACCOUNT_URL);

    expect(store.getState().authSlice.token).toBeNull();
    expect(sent).toHaveLength(2);
  });

  it('does not refresh when a login is refused', async () => {
    respond = () => json(401, {});

    await run(createStore(), { url: 'auth/login', method: 'POST', body: {} });

    expect(sent).toHaveLength(1);
  });

  it('encodes parameter values and leaves array brackets readable', async () => {
    respond = () => json(200, {});

    await run(createStore(), { url: 'workouts/exercises', params: { search: 'push & pull #1', ids: [1, 2] } });

    expect(sent[0].url).toBe(`${BASE_URL}/workouts/exercises?search=push%20%26%20pull%20%231&ids[]=1&ids[]=2`);
  });
});
