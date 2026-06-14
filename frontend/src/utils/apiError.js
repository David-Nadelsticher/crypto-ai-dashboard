const FIELD_LABELS = {
  password: "Password",
  name: "Name",
  email: "Email",
  assets: "Assets",
  investor_type: "Investor profile",
  content_types: "Content types",
};

const DETAIL_MESSAGE_MAP = {
  "Incorrect email or password":
    "That email or password doesn't look right. Please try again.",
  "A user with this email already exists":
    "An account with this email already exists. Try logging in instead.",
  "Could not validate credentials": "Your session expired. Please sign in again.",
  "User not found": "We couldn't find your account. Please sign in again.",
  "vote_value must be 1 (up) or -1 (down)": "Please choose thumbs up or thumbs down.",
};

function getFieldName(loc = []) {
  const field = loc[loc.length - 1];
  return typeof field === "string" ? field : null;
}

function stripValueErrorPrefix(message) {
  return message.replace(/^Value error,\s*/i, "");
}

function humanizeValidationItem(item) {
  const field = getFieldName(item.loc);
  const rawMessage = item.msg || "";
  const message = stripValueErrorPrefix(rawMessage);

  if (message !== rawMessage) {
    return message;
  }

  if (field === "password" && /at least \d+ character/i.test(rawMessage)) {
    return "Password should have at least 8 characters.";
  }

  if (field === "name") {
    if (/at least 1 character/i.test(rawMessage)) return "Please enter your name.";
    if (/at most 100 character/i.test(rawMessage)) return "Name must be 100 characters or fewer.";
  }

  if (field === "email" && /valid email/i.test(rawMessage)) {
    return "Please enter a valid email address.";
  }

  if (field === "assets") {
    if (/at least 1/i.test(rawMessage)) return "Pick at least one asset for Piggy to monitor.";
    if (/at most 10/i.test(rawMessage)) return "You can track up to 10 assets.";
  }

  if (field === "investor_type") {
    return "Select the investor profile that fits you best.";
  }

  if (field === "content_types") {
    if (/at least 1/i.test(rawMessage)) return "Pick at least one content type for your daily brief.";
    if (/at most 4/i.test(rawMessage)) return "You can choose up to 4 content types.";
  }

  const minLengthMatch = rawMessage.match(/String should have at least (\d+) characters?/i);
  if (minLengthMatch) {
    const label = FIELD_LABELS[field] || "This field";
    return `${label} should have at least ${minLengthMatch[1]} characters.`;
  }

  const maxLengthMatch = rawMessage.match(/String should have at most (\d+) characters?/i);
  if (maxLengthMatch) {
    const label = FIELD_LABELS[field] || "This field";
    return `${label} must be ${maxLengthMatch[1]} characters or fewer.`;
  }

  return message || rawMessage;
}

function humanizeString(detail) {
  return DETAIL_MESSAGE_MAP[detail] || detail;
}

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const detail = error?.response?.data?.detail;

  if (!detail) return fallback;
  if (typeof detail === "string") return humanizeString(detail);
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        typeof item === "string" ? humanizeString(item) : humanizeValidationItem(item),
      )
      .filter(Boolean);
    const unique = [...new Set(messages)];
    return unique.length > 0 ? unique.join(" ") : fallback;
  }
  return fallback;
}
