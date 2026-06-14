import api from "./client";

export async function submitVote({ section, item_reference, vote_value, content_snapshot = {} }) {
  const { data } = await api.post("/api/votes", {
    section,
    item_reference,
    vote_value,
    content_snapshot,
  });
  return data;
}
