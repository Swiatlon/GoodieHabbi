import { generateCsv } from './export';

describe('generateCsv', () => {
  it.each(['=1+1', '+48123', '-cmd', '@SUM(A1)'])('stops %p from running as a formula', note => {
    expect(generateCsv([{ note }])).toBe(`note\n'${note}`);
  });

  it('leaves negative numbers as numbers', () => {
    expect(generateCsv([{ amount: -12.5 }])).toBe('amount\n-12.5');
  });

  it('still quotes cells with separators', () => {
    expect(generateCsv([{ note: '=A1,"x"' }])).toBe(`note\n"'=A1,""x"""`);
  });
});
