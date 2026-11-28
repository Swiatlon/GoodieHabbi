import { parseJwt } from './jwt-utils';

const tokenWith = (payload: object) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

describe('parseJwt', () => {
  it('decodes a payload that needs several base64url replacements', () => {
    const payload = { accountId: 7, exp: 2000000000, name: '??????~~~~~~' };

    expect(tokenWith(payload).split('.')[1].match(/[-_]/g)?.length).toBeGreaterThan(1);
    expect(parseJwt(tokenWith(payload))).toEqual(payload);
  });

  it.each([null, '', 'no-dots', 'header.%%%.signature', 'header.bm90LWpzb24.signature'])('returns undefined for %p', token => {
    expect(parseJwt(token)).toBeUndefined();
  });
});
