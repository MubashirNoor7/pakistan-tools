// Central rates file — ONE place for rates that change.
// Fuel is the only rate that changes often (OGRA, fortnightly / daily mechanism).
// Live site: FuelTool first tries /rates.json (public folder) so updating that
// one JSON file on the server updates every visitor WITHOUT a rebuild.
// If /rates.json cannot be fetched, these built-in values are used.
export const RATES = {
  fuelUpdated: '2026-11-05',
  fuelSource: 'OGRA notified rates, 5 Nov 2026',
  petrol: 362.00,
  diesel: 387.81,
};
export function fuelAgeDays(updatedISO) {
  try {
    const d = new Date(updatedISO + 'T00:00:00+05:00');
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  } catch { return 0; }
}
