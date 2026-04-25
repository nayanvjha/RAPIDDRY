export const WAITLIST_SECTORS = [
  'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5',
  'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 'Sector 10',
  'Sector 11', 'Sector 12', 'Sector 13', 'Sector 14', 'Sector 15',
  'Sector 34', 'Sector 35', 'Sector 36', 'Sector 37', 'Sector 38',
  'Sector 39', 'Sector 40', 'Sector 41', 'Sector 42', 'Sector 43',
  'Sector 44', 'Sector 45', 'Sector 46', 'Sector 47', 'Sector 48',
  'Sector 104', 'Sector 105',
];

export function toCoverageSectorLabel(value) {
  const match = String(value).match(/Sector\s+(\d+)/i);
  if (!match) {
    return null;
  }

  return `SEC ${Number(match[1])}`;
}
