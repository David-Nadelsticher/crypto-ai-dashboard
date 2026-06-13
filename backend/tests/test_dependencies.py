from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch

import jwt
import pytest
from bson import ObjectId
from fastapi import HTTPException

from app.api.dependencies import get_current_user
from app.core.config import settings


def _make_token(sub: str, *, expired: bool = False) -> str:
    expire = datetime.now(timezone.utc) + (
        timedelta(hours=-1) if expired else timedelta(hours=1)
    )
    return jwt.encode(
        {"sub": sub, "exp": expire},
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


@pytest.fixture
def mock_user_repo():
    with patch("app.api.dependencies.user_repo") as repo:
        yield repo


class TestGetCurrentUser:
    @pytest.mark.asyncio
    async def test_valid_token_returns_user(self, mock_user_repo):
        user_id = str(ObjectId())
        user_doc = {"_id": ObjectId(user_id), "email": "alice@example.com"}
        mock_user_repo.get_user_by_id = AsyncMock(return_value=user_doc)

        result = await get_current_user(token=_make_token(user_id))

        assert result == user_doc
        mock_user_repo.get_user_by_id.assert_awaited_once_with(user_id)

    @pytest.mark.asyncio
    async def test_expired_token_returns_401(self, mock_user_repo):
        user_id = str(ObjectId())

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=_make_token(user_id, expired=True))

        assert exc_info.value.status_code == 401
        mock_user_repo.get_user_by_id.assert_not_called()

    @pytest.mark.asyncio
    async def test_malformed_token_returns_401(self, mock_user_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="not.a.valid.jwt")

        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_invalid_object_id_sub_returns_401(self, mock_user_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=_make_token("not-a-valid-objectid"))

        assert exc_info.value.status_code == 401
        mock_user_repo.get_user_by_id.assert_not_called()

    @pytest.mark.asyncio
    async def test_missing_user_returns_401(self, mock_user_repo):
        user_id = str(ObjectId())
        mock_user_repo.get_user_by_id = AsyncMock(return_value=None)

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=_make_token(user_id))

        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_missing_sub_claim_returns_401(self, mock_user_repo):
        token = jwt.encode(
            {"exp": datetime.now(timezone.utc) + timedelta(hours=1)},
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=token)

        assert exc_info.value.status_code == 401
