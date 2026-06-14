export const AUTH_EXPIRED_EVENT = "piggy:auth-expired";

export function dispatchAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
