import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolvePostAuthPath } from "./resolvePostAuthPath.js";

describe("resolvePostAuthPath", () => {
  it("returns login when unauthenticated", () => {
    assert.equal(resolvePostAuthPath({ isAuthenticated: false, user: null }), "/login");
  });

  it("returns onboarding when authenticated but onboarding incomplete", () => {
    assert.equal(
      resolvePostAuthPath({ isAuthenticated: true, user: { onboarding_completed: false } }),
      "/onboarding",
    );
  });

  it("returns dashboard when authenticated and onboarding complete", () => {
    assert.equal(
      resolvePostAuthPath({ isAuthenticated: true, user: { onboarding_completed: true } }),
      "/dashboard",
    );
  });
});
