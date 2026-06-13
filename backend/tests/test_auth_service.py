from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch

import jwt
import pytest
from bson import ObjectId
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app.core.config import settings
from app.schemas.user import UserCreate
from app.services import auth_service


@pytest.fixture
def mock_user_repo():
    with patch.object(auth_service, "user_repo") as repo:
        repo.get_user_by_email = AsyncMock()
        repo.create_user = AsyncMock()
        yield repo


def _sample_user_doc(**overrides):
    doc = {
        "_id": ObjectId(),
        "name": "Alice",
        "email": "alice@example.com",
        "password_hash": "$2b$12$placeholder",
        "onboarding_completed": False,
        "preferences": {
            "assets": [],
            "investor_type": None,
            "content_types": [],
        },
    }
    doc.update(overrides)
    return doc


class TestRegisterUser:
    @pytest.mark.asyncio
    async def test_register_user_success(self, mock_user_repo):
        mock_user_repo.get_user_by_email.return_value = None
        mock_user_repo.create_user.return_value = _sample_user_doc()

        result = await auth_service.register_user(
            UserCreate(name="Alice", email="alice@example.com", password="password123")
        )

        assert result.name == "Alice"
        assert result.email == "alice@example.com"
        assert result.onboarding_completed is False
        mock_user_repo.create_user.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_register_user_duplicate_email(self, mock_user_repo):
        mock_user_repo.get_user_by_email.return_value = _sample_user_doc()

        with pytest.raises(HTTPException) as exc_info:
            await auth_service.register_user(
                UserCreate(name="Alice", email="alice@example.com", password="password123")
            )

        assert exc_info.value.status_code == 400
        assert "already exists" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_register_user_duplicate_key_error(self, mock_user_repo):
        mock_user_repo.get_user_by_email.return_value = None
        mock_user_repo.create_user.side_effect = DuplicateKeyError("duplicate email")

        with pytest.raises(HTTPException) as exc_info:
            await auth_service.register_user(
                UserCreate(name="Alice", email="alice@example.com", password="password123")
            )

        assert exc_info.value.status_code == 400
        assert "already exists" in exc_info.value.detail


class TestAuthenticateUser:
    @pytest.mark.asyncio
    async def test_authenticate_user_success(self, mock_user_repo):
        from app.core.security import hash_password

        password_hash = hash_password("password123")
        user_id = ObjectId()
        mock_user_repo.get_user_by_email.return_value = _sample_user_doc(
            _id=user_id,
            password_hash=password_hash,
        )

        token = await auth_service.authenticate_user("alice@example.com", "password123")

        assert token.token_type == "bearer"
        assert token.access_token

    @pytest.mark.asyncio
    async def test_authenticate_user_wrong_password(self, mock_user_repo):
        from app.core.security import hash_password

        mock_user_repo.get_user_by_email.return_value = _sample_user_doc(
            password_hash=hash_password("password123"),
        )

        with pytest.raises(HTTPException) as exc_info:
            await auth_service.authenticate_user("alice@example.com", "wrong-password")

        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_authenticate_user_unknown_email(self, mock_user_repo):
        mock_user_repo.get_user_by_email.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await auth_service.authenticate_user("missing@example.com", "password123")

        assert exc_info.value.status_code == 401
