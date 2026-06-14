import api from "./client";

export async function fetchCryptoPrices() {
  const { data } = await api.get("/api/crypto/prices");
  return data.data;
}

export async function fetchCryptoNews() {
  const { data } = await api.get("/api/crypto/news");
  return data.data;
}

export async function fetchCryptoMeme() {
  const { data } = await api.get("/api/crypto/meme");
  return data.data;
}

export async function fetchCryptoInsight() {
  const { data } = await api.get("/api/crypto/insight");
  return data.data;
}
