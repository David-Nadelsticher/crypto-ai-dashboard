export const AUTH_EXPIRED_EVENT = "piggy:auth-expired";

let voluntaryLogout = false;

export function markVoluntaryLogout() {
  voluntaryLogout = true;
}

export function dispatchAuthExpired() {
  if (voluntaryLogout) {
    voluntaryLogout = false;
    return;
  }
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
