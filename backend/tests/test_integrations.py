from unittest.mock import AsyncMock, patch
import ssl

import httpx
import pytest

from app.services.external import integrations


def _make_response(
    *,
    status_code: int = 200,
    json_data: dict | list | None = None,
    method: str = "GET",
    url: str = "https://example.com",
) -> httpx.Response:
    request = httpx.Request(method, url)
    return httpx.Response(status_code=status_code, json=json_data, request=request)


def _mock_async_client(response: httpx.Response) -> AsyncMock:
    mock_client = AsyncMock()
    mock_client.get.return_value = response
    mock_client.post.return_value = response
    return mock_client


def _mock_async_client_context(
    response: httpx.Response,
    *,
    method: str = "GET",
    url: str = "https://example.com",
):
    if response.request is None:
        response = _make_response(
            status_code=response.status_code,
            json_data=response.json() if response.content else None,
            method=method,
            url=url,
        )

    mock_client = _mock_async_client(response)

    mock_context = AsyncMock()
    mock_context.__aenter__.return_value = mock_client
    mock_context.__aexit__.return_value = None

    return patch(
        "app.services.external.integrations.httpx.AsyncClient",
        return_value=mock_context,
    )


class TestFetchCryptoPrices:
    """Tests for CoinGecko price fetching."""

    @pytest.mark.asyncio
    async def test_fetch_crypto_prices_success(self):
        """Returns parsed price data when CoinGecko responds successfully."""
        sparkline_prices = [96000 + index * 50 for index in range(64)]
        response = _make_response(
            json_data={
                "bitcoin": {
                    "usd": 97500.12,
                    "usd_24h_change": 1.25,
                    "usd_24h_vol": 32000000000,
                    "sparkline_in_7d": {"price": sparkline_prices},
                },
                "ethereum": {
                    "usd": 3500.5,
                    "usd_24h_change": -0.75,
                    "usd_24h_vol": 15000000000,
                },
            },
            url="https://api.coingecko.com/api/v3/simple/price",
        )

        with _mock_async_client_context(response):
            result = await integrations.fetch_crypto_prices(["Bitcoin", "Ethereum"])

        assert len(result) == 2
        assert result[0]["id"] == "bitcoin"
        assert result[0]["name"] == "Bitcoin"
        assert result[0]["price_usd"] == 97500.12
        assert result[0]["change_24h"] == 1.25
        assert result[0]["sparkline_7d"] == integrations._downsample_series(sparkline_prices)
        assert len(result[0]["sparkline_7d"]) == 32
        assert result[1]["id"] == "ethereum"
        assert "sparkline_7d" not in result[1]

    @pytest.mark.asyncio
    async def test_fetch_crypto_prices_http_error_returns_empty_list(self):
        """Returns an empty list when CoinGecko raises an HTTP error."""
        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.HTTPStatusError(
            "Not Found",
            request=httpx.Request("GET", "https://api.coingecko.com/api/v3/simple/price"),
            response=httpx.Response(status_code=404),
        )

        mock_context = AsyncMock()
        mock_context.__aenter__.return_value = mock_client
        mock_context.__aexit__.return_value = None

        with patch(
            "app.services.external.integrations.httpx.AsyncClient",
            return_value=mock_context,
        ):
            result = await integrations.fetch_crypto_prices(["Bitcoin"])

        assert result == []


class TestFetchMarketNews:
    """Tests for CCData news fetching."""

    @pytest.mark.asyncio
    async def test_fetch_market_news_success(self):
        """Returns parsed news articles when CCData responds successfully."""
        response = _make_response(
            json_data={
                "Data": [
                    {
                        "id": 12345,
                        "title": "Bitcoin reaches new milestone",
                        "url": "https://example.com/bitcoin-news",
                        "source_info": {"name": "CryptoNews"},
                        "published_on": 1710000000,
                    },
                    {
                        "id": 67890,
                        "title": "Ethereum upgrade update",
                        "url": "https://example.com/eth-news",
                        "source_info": {"name": "ETH Daily"},
                        "published_on": 1710003600,
                    },
                ]
            },
            url="https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
        )

        with _mock_async_client_context(response):
            result = await integrations.fetch_market_news()

        assert len(result) == 2
        assert result[0]["id"] == "12345"
        assert result[0]["title"] == "Bitcoin reaches new milestone"
        assert result[0]["url"] == "https://example.com/bitcoin-news"
        assert result[0]["source"] == "CryptoNews"
        assert result[0]["published_at"] == 1710000000

    @pytest.mark.asyncio
    async def test_fetch_market_news_http_error_returns_static_fallback(self):
        """Returns static fallback news when CCData raises an HTTP error."""
        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.HTTPStatusError(
            "Forbidden",
            request=httpx.Request(
                "GET",
                "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
            ),
            response=httpx.Response(status_code=403),
        )

        mock_context = AsyncMock()
        mock_context.__aenter__.return_value = mock_client
        mock_context.__aexit__.return_value = None

        with patch(
            "app.services.external.integrations.httpx.AsyncClient",
            return_value=mock_context,
        ):
            result = await integrations.fetch_market_news()

        assert result == integrations.STATIC_NEWS_FALLBACK

    @pytest.mark.asyncio
    async def test_fetch_market_news_ssl_error_returns_static_fallback(self):
        """Returns static fallback news when CCData raises an SSL error."""
        mock_client = AsyncMock()
        mock_client.get.side_effect = ssl.SSLError("certificate verify failed")

        mock_context = AsyncMock()
        mock_context.__aenter__.return_value = mock_client
        mock_context.__aexit__.return_value = None

        with patch(
            "app.services.external.integrations.httpx.AsyncClient",
            return_value=mock_context,
        ):
            result = await integrations.fetch_market_news()

        assert result == integrations.STATIC_NEWS_FALLBACK

    @pytest.mark.asyncio
    async def test_fetch_market_news_unexpected_data_shape_returns_static_fallback(self):
        """Returns static fallback when CCData Data field is not a list."""
        response = _make_response(
            json_data={
                "Data": {
                    "error": "Rate limit exceeded",
                }
            },
            url="https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
        )

        with _mock_async_client_context(response):
            result = await integrations.fetch_market_news()

        assert result == integrations.STATIC_NEWS_FALLBACK


class TestFetchRedditMeme:
    """Tests for Reddit meme fetching."""

    @pytest.mark.asyncio
    async def test_fetch_reddit_meme_success(self):
        """Returns a parsed meme when Reddit responds with image posts."""
        response = _make_response(
            json_data={
                "data": {
                    "children": [
                        {
                            "data": {
                                "id": "abc123",
                                "title": "HODL meme",
                                "url": "https://i.redd.it/example.png",
                                "permalink": "/r/CryptoCurrencyMemes/comments/abc123/hodl/",
                            }
                        }
                    ]
                }
            },
            url="https://www.reddit.com/r/CryptoCurrencyMemes/hot.json",
        )

        with _mock_async_client_context(response):
            with patch(
                "app.services.external.integrations.random.choice",
                side_effect=lambda items: items[0],
            ):
                result = await integrations.fetch_reddit_meme()

        assert result["id"] == "abc123"
        assert result["title"] == "HODL meme"
        assert result["image_url"] == "https://i.redd.it/example.png"
        assert result["source"] == "reddit"
        assert result["permalink"] == (
            "https://www.reddit.com/r/CryptoCurrencyMemes/comments/abc123/hodl/"
        )

    @pytest.mark.asyncio
    async def test_fetch_reddit_meme_http_error_returns_static_fallback(self):
        """Returns static meme fallback when Reddit raises an HTTP error."""
        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.HTTPStatusError(
            "Unauthorized",
            request=httpx.Request(
                "GET",
                "https://www.reddit.com/r/CryptoCurrencyMemes/hot.json",
            ),
            response=httpx.Response(status_code=401),
        )

        mock_context = AsyncMock()
        mock_context.__aenter__.return_value = mock_client
        mock_context.__aexit__.return_value = None

        with patch(
            "app.services.external.integrations.httpx.AsyncClient",
            return_value=mock_context,
        ):
            result = await integrations.fetch_reddit_meme()

        assert result == integrations.STATIC_MEME_FALLBACK


class TestGenerateAiInsight:
    """Tests for OpenRouter AI insight generation."""

    @pytest.mark.asyncio
    async def test_generate_ai_insight_success(self):
        """Returns OpenRouter insight text when the API responds successfully."""
        response = _make_response(
            method="POST",
            json_data={
                "choices": [
                    {
                        "message": {
                            "content": "Markets are consolidating with cautious sentiment.",
                        }
                    }
                ]
            },
            url="https://openrouter.ai/api/v1/chat/completions",
        )

        with patch.object(integrations.settings, "OPENROUTER_API_KEY", "test-openrouter-key"):
            with patch.object(integrations.settings, "OPENROUTER_MODEL", "test-model"):
                with _mock_async_client_context(response):
                    result = await integrations.generate_ai_insight(
                        "HODLer",
                        ["Bitcoin"],
                    )

        assert result["insight"] == "Markets are consolidating with cautious sentiment."
        assert result["source"] == "openrouter"
        assert result["model"] == "test-model"

    @pytest.mark.asyncio
    async def test_generate_ai_insight_http_error_returns_simulated_fallback(self):
        """Returns simulated insight when OpenRouter raises an HTTP error."""
        mock_client = AsyncMock()
        mock_client.post.side_effect = httpx.HTTPStatusError(
            "Service Unavailable",
            request=httpx.Request(
                "POST",
                "https://openrouter.ai/api/v1/chat/completions",
            ),
            response=httpx.Response(status_code=503),
        )

        mock_context = AsyncMock()
        mock_context.__aenter__.return_value = mock_client
        mock_context.__aexit__.return_value = None

        with patch.object(integrations.settings, "OPENROUTER_API_KEY", "test-openrouter-key"):
            with patch.object(integrations.settings, "OPENROUTER_MODEL", "test-model"):
                with patch(
                    "app.services.external.integrations.httpx.AsyncClient",
                    return_value=mock_context,
                ):
                    result = await integrations.generate_ai_insight(
                        "Day Trader",
                        ["Ethereum"],
                    )

        assert result["source"] == "simulated"
        assert result["model"] == "test-model"
        assert "Ethereum" in result["insight"]
        assert "Day Trader" in result["insight"]

    @pytest.mark.asyncio
    async def test_generate_ai_insight_missing_api_key_returns_simulated_insight(self):
        """Returns simulated insight without calling OpenRouter when API key is missing."""
        with patch.object(integrations.settings, "OPENROUTER_API_KEY", ""):
            with patch(
                "app.services.external.integrations.httpx.AsyncClient",
            ) as mock_client_class:
                result = await integrations.generate_ai_insight(
                    "HODLer",
                    ["Bitcoin"],
                )

        mock_client_class.assert_not_called()
        assert result["source"] == "simulated"
        assert result["model"] is None
        assert "Bitcoin" in result["insight"]
