from typing import Any

from app.services.external.integrations import (
    fetch_crypto_prices,
    fetch_market_news,
    fetch_reddit_meme,
    generate_ai_insight,
)


async def get_user_prices(assets: list[str]) -> list[dict[str, Any]]:
    return await fetch_crypto_prices(assets)


async def get_market_news() -> list[dict[str, Any]]:
    return await fetch_market_news()


async def get_crypto_meme() -> dict[str, Any]:
    return await fetch_reddit_meme()


async def get_ai_insight(
    investor_type: str | None,
    assets: list[str],
    content_types: list[str] | None = None,
) -> dict[str, Any]:
    return await generate_ai_insight(investor_type, assets, content_types)
