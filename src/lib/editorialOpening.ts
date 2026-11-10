export const EDITORIAL_OPENING_KEY = 'niel.editorial-opening.v1';
export const EDITORIAL_OPENING_DURATION_MS = 1500;

export function shouldShowEditorialOpening({seen,reducedMotion,hash,managerRequest}: {
  seen: boolean; reducedMotion: boolean; hash: string; managerRequest: boolean;
}) {
  return !seen && !reducedMotion && !managerRequest && ['', '#', '#top'].includes(hash);
}
