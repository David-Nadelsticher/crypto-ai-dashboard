import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getApiErrorMessage } from "./apiError.js";

describe("getApiErrorMessage", () => {
  it("humanizes weak password validation errors", () => {
    const message = getApiErrorMessage({
      response: {
        data: {
          detail: [
            {
              loc: ["body", "password"],
              msg: "String should have at least 8 characters",
              type: "string_too_short",
            },
          ],
        },
      },
    });

    assert.equal(message, "Password should have at least 8 characters.");
  });

  it("uses custom backend validation messages when provided", () => {
    const message = getApiErrorMessage({
      response: {
        data: {
          detail: [
            {
              loc: ["body", "password"],
              msg: "Value error, Password should have at least 8 characters.",
              type: "value_error",
            },
          ],
        },
      },
    });

    assert.equal(message, "Password should have at least 8 characters.");
  });

  it("humanizes common auth errors", () => {
    const message = getApiErrorMessage({
      response: {
        data: {
          detail: "Incorrect email or password",
        },
      },
    });

    assert.equal(
      message,
      "That email or password doesn't look right. Please try again.",
    );
  });

  it("returns fallback when detail is missing", () => {
    assert.equal(getApiErrorMessage({}, "Unable to log in."), "Unable to log in.");
  });
});
