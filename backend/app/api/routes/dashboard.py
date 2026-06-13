from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.services import dashboard_service

router = APIRouter(prefix="/api/crypto", tags=["dashboard"])


@router.get("/prices")
async def get_crypto_prices(current_user: dict = Depends(get_current_user)):
    preferences = current_user.get("preferences", {})
    assets = preferences.get("assets", [])
    prices = await dashboard_service.get_user_prices(assets)
    return {"data": prices}


@router.get("/news")
async def get_crypto_news(current_user: dict = Depends(get_current_user)):
    _ = current_user
    news = await dashboard_service.get_market_news()
    return {"data": news}


@router.get("/meme")
async def get_crypto_meme(current_user: dict = Depends(get_current_user)):
    _ = current_user
    meme = await dashboard_service.get_crypto_meme()
    return {"data": meme}


@router.get("/insight")
async def get_crypto_insight(current_user: dict = Depends(get_current_user)):
    preferences = current_user.get("preferences", {})
    assets = preferences.get("assets", [])
    investor_type = preferences.get("investor_type")
    content_types = preferences.get("content_types", [])
    insight = await dashboard_service.get_ai_insight(investor_type, assets, content_types)
    return {"data": insight}
