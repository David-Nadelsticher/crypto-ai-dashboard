from unittest.mock import AsyncMock, patch

import pytest
from bson import ObjectId
from fastapi.testclient import TestClient

from app.api.dependencies import get_current_user
from app.schemas.token import Token
from app.schemas.user import UserResponse, UserPreferences


def _sample_user_response(**overrides) -> UserResponse:
    data = {
        "id": str(ObjectId()),
        "name": "Alice",
        "email": "alice@example.com",
        "onboarding_completed": False,
        "preferences": UserPreferences(),
    }
    data.update(overrides)
    return UserResponse(**data)


@pytest.fixture
def client():
    with patch("app.db.database.init_db", new_callable=AsyncMock), patch(
        "app.db.database.close_db", new_callable=AsyncMock
    ):
        from app.main import app

        with TestClient(app) as test_client:
            yield test_client


class TestAuthRoutes:
    def test_signup_success(self, client):
        user_response = _sample_user_response()

        with patch(
            "app.api.routes.auth.auth_service.register_user",
            new_callable=AsyncMock,
            return_value=user_response,
        ):
            response = client.post(
                "/signup",
                json={
                    "name": "Alice",
                    "email": "alice@example.com",
                    "password": "password123",
                },
            )

        assert response.status_code == 201
        assert response.json()["email"] == "alice@example.com"

    def test_signup_weak_password_rejected(self, client):
        response = client.post(
            "/signup",
            json={
                "name": "Alice",
                "email": "alice@example.com",
                "password": "short",
            },
        )

        assert response.status_code == 422

    def test_login_success(self, client):
        token = Token(access_token="test-token", token_type="bearer")

        with patch(
            "app.api.routes.auth.auth_service.authenticate_user",
            new_callable=AsyncMock,
            return_value=token,
        ):
            response = client.post(
                "/login",
                data={"username": "alice@example.com", "password": "password123"},
            )

        assert response.status_code == 200
        assert response.json()["access_token"] == "test-token"

    def test_login_failure(self, client):
        from fastapi import HTTPException

        with patch(
            "app.api.routes.auth.auth_service.authenticate_user",
            new_callable=AsyncMock,
            side_effect=HTTPException(status_code=401, detail="Incorrect email or password"),
        ):
            response = client.post(
                "/login",
                data={"username": "alice@example.com", "password": "wrong"},
            )

        assert response.status_code == 401


class TestProtectedRoutes:
    def test_me_requires_auth(self, client):
        response = client.get("/me")
        assert response.status_code == 401

    def test_me_returns_profile(self, client):
        from app.main import app

        user_doc = {
            "_id": ObjectId(),
            "name": "Alice",
            "email": "alice@example.com",
            "onboarding_completed": True,
            "preferences": {
                "assets": ["Bitcoin"],
                "investor_type": "HODLer",
                "content_types": ["Market News"],
            },
        }

        async def override_current_user():
            return user_doc

        app.dependency_overrides[get_current_user] = override_current_user
        try:
            response = client.get("/me")
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["name"] == "Alice"

    def test_onboarding_invalid_investor_type_rejected(self, client):
        from app.main import app

        async def override_current_user():
            return {"_id": ObjectId(), "email": "alice@example.com"}

        app.dependency_overrides[get_current_user] = override_current_user
        try:
            response = client.post(
                "/onboarding",
                json={
                    "assets": ["Bitcoin"],
                    "investor_type": "Invalid Type",
                    "content_types": ["Market News"],
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 422

    def test_update_preferences_success(self, client):
        from app.main import app

        user_id = str(ObjectId())

        async def override_current_user():
            return {"_id": ObjectId(user_id), "email": "alice@example.com"}

        app.dependency_overrides[get_current_user] = override_current_user
        try:
            with patch(
                "app.api.routes.users.user_service.update_preferences",
                new_callable=AsyncMock,
                return_value={
                    "id": user_id,
                    "name": "Alice",
                    "email": "alice@example.com",
                    "onboarding_completed": True,
                    "preferences": {
                        "assets": ["Solana"],
                        "investor_type": "Day Trader",
                        "content_types": ["Charts"],
                    },
                },
            ):
                response = client.patch(
                    "/me/preferences",
                    json={
                        "assets": ["Solana"],
                        "investor_type": "Day Trader",
                        "content_types": ["Charts"],
                    },
                )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["preferences"]["content_types"] == ["Charts"]

    def test_vote_records_successfully(self, client):
        from app.main import app

        async def override_current_user():
            return {"_id": ObjectId()}

        app.dependency_overrides[get_current_user] = override_current_user
        try:
            with patch(
                "app.api.routes.votes.vote_service.record_vote",
                new_callable=AsyncMock,
                return_value={"message": "Vote recorded successfully"},
            ):
                response = client.post(
                    "/api/votes",
                    json={
                        "section": "news",
                        "item_reference": "article-1",
                        "vote_value": 1,
                        "content_snapshot": {"title": "Bitcoin update"},
                    },
                )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["message"] == "Vote recorded successfully"
