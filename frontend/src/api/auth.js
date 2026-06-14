import api from "./client";

export async function signup({ name, email, password }) {
  const { data } = await api.post("/signup", { name, email, password });
  return data;
}

export async function login({ email, password }) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const { data } = await api.post("/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/me");
  return data;
}

export async function submitOnboarding({ assets, investor_type, content_types }) {
  const { data } = await api.post("/onboarding", {
    assets,
    investor_type,
    content_types,
  });
  return data;
}

export async function updatePreferences({ assets, investor_type, content_types }) {
  const { data } = await api.patch("/me/preferences", {
    assets,
    investor_type,
    content_types,
  });
  return data;
}
