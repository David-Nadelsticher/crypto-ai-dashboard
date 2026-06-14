export function resolvePostAuthPath({ isAuthenticated, user }) {
  if (!isAuthenticated) {
    return "/login";
  }

  if (!user?.onboarding_completed) {
    return "/onboarding";
  }

  return "/dashboard";
}
