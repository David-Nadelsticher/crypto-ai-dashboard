import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getFirstIncompleteStep,
  getFocusedStep,
  getOnboardingStepCompletion,
  getProgressSummary,
} from "./onboardingSteps.js";

describe("onboarding step helpers", () => {
  it("tracks completion from form state", () => {
    assert.deepEqual(
      getOnboardingStepCompletion({
        assets: ["Bitcoin"],
        investorType: "",
        contentTypes: [],
      }),
      [true, false, false],
    );
  });

  it("finds the first incomplete step", () => {
    assert.equal(getFirstIncompleteStep([true, false, false]), 2);
    assert.equal(getFirstIncompleteStep([true, true, true]), null);
  });

  it("flags when the user scrolls ahead of incomplete steps", () => {
    const summary = getProgressSummary(3, [false, false, false]);

    assert.equal(summary.status, "ahead-warning");
    assert.equal(summary.completedCount, 0);
  });

  it("uses a neutral status while working through steps in order", () => {
    const summary = getProgressSummary(1, [false, false, false]);

    assert.equal(summary.status, "current-incomplete");
    assert.equal(summary.completedCount, 0);
  });

  it("marks all-done when every step is complete", () => {
    const summary = getProgressSummary(3, [true, true, true]);

    assert.equal(summary.status, "all-done");
    assert.equal(summary.completedCount, 3);
  });

  it("maps the focused section id to a step number", () => {
    assert.equal(getFocusedStep("onboarding-step-content"), 3);
    assert.equal(getFocusedStep("unknown"), 1);
  });
});
