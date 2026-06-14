import logging
import ssl
from typing import Any

import certifi
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT = 15.0

def _build_ssl_verify() -> bool | str | ssl.SSLContext:
    try:
        import truststore

        return truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    except ImportError:
        return certifi.where()


SSL_VERIFY = _build_ssl_verify()

# SSL and transport failures are not always wrapped as httpx.HTTPError on Windows.
EXTERNAL_REQUEST_ERRORS = (httpx.HTTPError, OSError)


def _build_http_client(**kwargs: Any) -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=REQUEST_TIMEOUT, verify=SSL_VERIFY, **kwargs)

ASSET_TO_COINGECKO_ID: dict[str, str] = {
    "bitcoin": "bitcoin",
    "ethereum": "ethereum",
    "solana": "solana",
    "cardano": "cardano",
}

COINGECKO_ID_TO_LABEL: dict[str, str] = {
    "bitcoin": "Bitcoin",
    "ethereum": "Ethereum",
    "solana": "Solana",
    "cardano": "Cardano",
}

STATIC_NEWS_FALLBACK: list[dict[str, Any]] = [
    {
        "id": "fallback-1",
        "title": "Bitcoin holds steady as markets watch macro data",
        "url": "https://www.coindesk.com/",
        "source": "CoinDesk",
        "published_at": None,
    },
    {
        "id": "fallback-2",
        "title": "Ethereum developers discuss upcoming network upgrades",
        "url": "https://ethereum.org/",
        "source": "Ethereum Foundation",
        "published_at": None,
    },
    {
        "id": "fallback-3",
        "title": "Solana ecosystem activity remains in focus for traders",
        "url": "https://solana.com/news",
        "source": "Solana",
        "published_at": None,
    },
    {
        "id": "fallback-4",
        "title": "Cardano community reviews governance proposals",
        "url": "https://cardano.org/news/",
        "source": "Cardano",
        "published_at": None,
    },
    {
        "id": "fallback-5",
        "title": "Crypto markets digest: volatility, regulation, and adoption trends",
        "url": "https://www.coingecko.com/",
        "source": "CoinGecko",
        "published_at": None,
    },
]

STATIC_MEME_FALLBACK: dict[str, Any] = {
    "id": "fallback-meme",
    "title": "When you check your portfolio at 3 AM",
    "image_url": "https://i.imgur.com/8Km9tLL.jpg",
    "permalink": None,
    "source": "fallback",
}


def _normalize_asset_name(asset: str) -> str:
    return asset.strip().lower()


def _assets_to_coingecko_ids(assets: list[str]) -> list[str]:
    ids: list[str] = []
    for asset in assets:
        normalized = _normalize_asset_name(asset)
        coin_id = ASSET_TO_COINGECKO_ID.get(normalized)
        if coin_id and coin_id not in ids:
            ids.append(coin_id)
    return ids


def _build_simulated_insight(
    investor_type: str | None,
    assets: list[str],
    content_types: list[str] | None = None,
) -> str:
    asset_text = ", ".join(assets) if assets else "major cryptocurrencies"
    profile = investor_type or "crypto investor"
    content_text = ", ".join(content_types) if content_types else "general market updates"
    return (
        f"As a {profile} tracking {asset_text}, today's market looks mixed with "
        f"sentiment driven by liquidity flows and headline risk. Given your interest in "
        f"{content_text}, focus on the sections that match your daily reading preferences. "
        "Watch key support levels and keep position sizes aligned with your time horizon. "
        "This is educational commentary, not financial advice."
    )


def _downsample_series(values: list[float], max_points: int = 32) -> list[float]:
    if len(values) <= max_points:
        return values

    step = (len(values) - 1) / (max_points - 1)
    sampled: list[float] = []
    for index in range(max_points):
        position = round(index * step)
        position = min(position, len(values) - 1)
        sampled.append(float(values[position]))
    return sampled


def _parse_sparkline_7d(coin_data: dict[str, Any]) -> list[float] | None:
    sparkline = coin_data.get("sparkline_in_7d")
    if not isinstance(sparkline, dict):
        return None

    prices = sparkline.get("price")
    if not isinstance(prices, list) or len(prices) < 2:
        return None

    numeric_prices = [float(price) for price in prices if isinstance(price, (int, float))]
    if len(numeric_prices) < 2:
        return None

    return _downsample_series(numeric_prices)


async def fetch_crypto_prices(assets: list[str]) -> list[dict[str, Any]]:
    coin_ids = _assets_to_coingecko_ids(assets)
    if not coin_ids:
        logger.info("No supported assets provided for price lookup.")
        return []

    params = {
        "ids": ",".join(coin_ids),
        "vs_currencies": "usd",
        "include_24hr_change": "true",
        "include_24hr_vol": "true",
        "sparkline": "true",
    }

    try:
        coingecko_url = "https://api.coingecko.com/api/v3/simple/price"
        logger.debug(
            "CoinGecko request starting: url=%s params=%s",
            coingecko_url,
            params,
        )
        async with _build_http_client() as client:
            response = await client.get(
                coingecko_url,
                params=params,
            )
            response.raise_for_status()
            payload = response.json()
        logger.debug(
            "CoinGecko request succeeded: status_code=%s coin_count=%s",
            response.status_code,
            len(payload),
        )
    except EXTERNAL_REQUEST_ERRORS as exc:
        logger.warning("CoinGecko request failed: %s", exc)
        return []

    prices: list[dict[str, Any]] = []
    for coin_id in coin_ids:
        coin_data = payload.get(coin_id)
        if not coin_data:
            continue
        coin_record: dict[str, Any] = {
                "id": coin_id,
                "symbol": coin_id,
                "name": COINGECKO_ID_TO_LABEL.get(coin_id, coin_id.title()),
                "price_usd": coin_data.get("usd"),
                "change_24h": coin_data.get("usd_24h_change"),
                "volume_24h": coin_data.get("usd_24h_vol"),
            }
        sparkline_7d = _parse_sparkline_7d(coin_data)
        if sparkline_7d is not None:
            coin_record["sparkline_7d"] = sparkline_7d
        prices.append(coin_record)

    logger.debug("CoinGecko parsed %s price records", len(prices))
    return prices


async def fetch_market_news() -> list[dict[str, Any]]:
    url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
    headers: dict[str, str] = {}
    if settings.CCDATA_API_KEY:
        headers["authorization"] = f"Apikey {settings.CCDATA_API_KEY}"

    try:
        logger.debug(
            "CCData news request starting: url=%s authenticated=%s",
            url,
            bool(settings.CCDATA_API_KEY),
        )
        async with _build_http_client() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            payload = response.json()
        logger.debug(
            "CCData news request succeeded: status_code=%s article_count=%s",
            response.status_code,
            len(payload.get("Data", []))
            if isinstance(payload.get("Data"), list)
            else 0,
        )
    except EXTERNAL_REQUEST_ERRORS as exc:
        logger.warning("CCData news request failed: %s", exc)
        return STATIC_NEWS_FALLBACK

    raw_data = payload.get("Data")
    if not isinstance(raw_data, list):
        logger.info(
            "CCData returned unexpected Data type (%s). Using static news fallback.",
            type(raw_data).__name__,
        )
        return STATIC_NEWS_FALLBACK

    results: list[dict[str, Any]] = []
    for item in raw_data[:5]:
        if not isinstance(item, dict):
            continue
        results.append(
            {
                "id": str(item.get("id")),
                "title": item.get("title"),
                "url": item.get("url"),
                "source": item.get("source_info", {}).get("name"),
                "published_at": item.get("published_on"),
            }
        )

    if not results:
        logger.info("CCData returned no articles. Using static news fallback.")
        return STATIC_NEWS_FALLBACK

    logger.debug("CCData parsed %s news articles", len(results))
    return results


async def fetch_reddit_meme() -> dict[str, Any]:
    meme_api_url = "https://meme-api.com/gimme/CryptoCurrencyMemes"

    try:
        logger.debug("Meme API request starting: url=%s", meme_api_url)
        async with _build_http_client() as client:
            response = await client.get(meme_api_url)
            response.raise_for_status()
            payload = response.json()
        logger.debug(
            "Meme API request succeeded: status_code=%s title=%s",
            response.status_code,
            payload.get("title"),
        )
    except EXTERNAL_REQUEST_ERRORS as exc:
        logger.warning("Meme API request failed: %s", exc)
        return STATIC_MEME_FALLBACK

    image_url = payload.get("url")
    if not image_url:
        logger.info("Meme API returned no image URL. Using static meme fallback.")
        return STATIC_MEME_FALLBACK

    post_link = payload.get("postLink") or ""
    path_parts = [part for part in post_link.rstrip("/").split("/") if part]
    meme_id = path_parts[-1] if path_parts else "fallback-meme"
    selected_meme = {
        "id": meme_id,
        "title": payload.get("title") or "Crypto meme",
        "image_url": image_url,
        "permalink": post_link or None,
        "source": "meme-api",
    }
    logger.debug("Meme API meme selected: id=%s", selected_meme.get("id"))
    return selected_meme


async def generate_ai_insight(
        investor_type: str | None,
        assets: list[str],
        content_types: list[str] | None = None,
) -> dict[str, Any]:
    model = settings.OPENROUTER_MODEL

    asset_text = ", ".join(assets) if assets else "major cryptocurrencies"
    profile = investor_type or "crypto investor"
    content_text = ", ".join(content_types) if content_types else "general market updates"

    # User prompt - contains only the dynamic data and a call to action
    prompt = (
        f"Assets to analyze: {asset_text}.\n"
        f"Target audience: {profile}.\n"
        f"Preferred focus areas: {content_text}.\n"
        "Provide your 3-sentence insight now."
    )

    if not settings.OPENROUTER_API_KEY:
        logger.info("OPENROUTER_API_KEY is not set. Returning simulated AI insight.")
        return {
            "insight": _build_simulated_insight(investor_type, assets, content_types),
            "source": "simulated",
            "model": None,
        }

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.OPENROUTER_SITE_URL,
        "X-Title": settings.OPENROUTER_APP_NAME,
    }

    # System prompt - contains the strict rules, persona, and formatting constraints
    system_content = (
        "You are a professional crypto financial analyst providing educational daily insights. "
        "You must respond strictly with exactly 3 sentences.\n"
        "Sentence 1: Provide the definitive bottom-line market sentiment (Bullish/Bearish/Neutral) for the requested assets.\n"
        "Sentences 2 and 3: Provide concise justification, touching on trends, focus areas, and risk awareness.\n"
        "Do not provide direct financial advice. Do not include any introductory filler or conversational text."
    )

    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_content},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 150,  # Lowered slightly to strictly enforce the 3-sentence limit
        "temperature": 0.5,  # Lowered temperature for more deterministic and structured outputs
    }

    try:
        openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        logger.debug(
            "OpenRouter insight request starting: url=%s model=%s",
            openrouter_url,
            model,
        )
        async with _build_http_client() as client:
            response = await client.post(
                openrouter_url,
                headers=headers,
                json=body,
            )
            response.raise_for_status()
            payload = response.json()
        logger.debug(
            "OpenRouter insight request succeeded: status_code=%s choice_count=%s",
            response.status_code,
            len(payload.get("choices", [])),
        )
    except EXTERNAL_REQUEST_ERRORS as exc:
        logger.warning("OpenRouter request failed: %s", exc)
        return {
            "insight": _build_simulated_insight(investor_type, assets, content_types),
            "source": "simulated",
            "model": model,
        }

    choices = payload.get("choices", [])
    message_content = ""
    if choices:
        message_content = choices[0].get("message", {}).get("content", "").strip()

    if not message_content:
        logger.info("OpenRouter returned an empty insight. Using simulated fallback.")
        return {
            "insight": _build_simulated_insight(investor_type, assets, content_types),
            "source": "simulated",
            "model": model,
        }

    return {
        "insight": message_content,
        "source": "openrouter",
        "model": model,
    }
