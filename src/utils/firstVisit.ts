// Utility to check if this is the user's first visit (simple localStorage flag)
export function isFirstVisit() {
  if (typeof window === 'undefined') return false;
  const visited = localStorage.getItem('pos_first_visit');
  if (visited) return false;
  localStorage.setItem('pos_first_visit', '1');
  return true;
}
