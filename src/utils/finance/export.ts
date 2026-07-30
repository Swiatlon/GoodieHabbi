export const generateCsv = (rows: Array<Record<string, unknown>>, headers?: string[]) => {
  if (!rows || rows.length === 0) return '';
  const cols = headers ?? Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('\r') || s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [cols.join(',')];
  for (const r of rows) {
    const cells = cols.map(c => escape(r[c]));
    lines.push(cells.join(','));
  }
  return lines.join('\n');
};
