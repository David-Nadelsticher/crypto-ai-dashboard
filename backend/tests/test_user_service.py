from unittest.mock import AsyncMock, patch

import pytest
from bson import ObjectId
from fastapi import HTTPException

from app.schemas.user import OnboardingUpdate
from app.services import user_service


@pytest.fixture
def mock_user_repo():
    with patch.object(user_service, "user_repo") as repo:
        yield repo


def _sample_user_doc(**overrides):
    doc = {
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
    doc.update(overrides)
    return doc


class TestCompleteOnboarding:
    @pytest.mark.asyncio
    async def test_complete_onboarding_success(self, mock_user_repo):
        user_id = str(ObjectId())
        updated_doc = _sample_user_doc(
            _id=ObjectId(user_id),
            preferences={
                "assets": ["Bitcoin", "Ethereum"],
                "investor_type": "HODLer",
                "content_types": ["Market News", "Charts"],
            },
        )
        mock_user_repo.complete_onboarding = AsyncMock(return_value=updated_doc)

        onboarding = OnboardingUpdate(
            assets=["Bitcoin", "Ethereum"],
            investor_type="HODLer",
            content_types=["Market News", "Charts"],
        )

        result = await user_service.complete_onboarding(user_id, onboarding)

        assert result.onboarding_completed is True
        assert result.preferences.assets == ["Bitcoin", "Ethereum"]
        mock_user_repo.complete_onboarding.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_complete_onboarding_user_not_found(self, mock_user_repo):
        mock_user_repo.complete_onboarding = AsyncMock(return_value=None)

        onboarding = OnboardingUpdate(
            assets=["Bitcoin"],
            investor_type="Day Trader",
            content_types=["Social"],
        )

        with pytest.raises(HTTPException) as exc_info:
            await user_service.complete_onboarding(str(ObjectId()), onboarding)

        assert exc_info.value.status_code == 404


class TestGetUserProfile:
    def test_get_user_profile_maps_response(self):
        user_doc = _sample_user_doc()

        result = user_service.get_user_profile(user_doc)

        assert result.name == "Alice"
        assert result.email == "alice@example.com"
        assert result.preferences.investor_type == "HODLer"
