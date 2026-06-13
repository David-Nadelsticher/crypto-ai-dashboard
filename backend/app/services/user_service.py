from fastapi import HTTPException, status

from app.db.repositories.user_repo import UserRepository
from app.schemas.user import OnboardingUpdate, UserResponse
from app.services.user_mapper import user_doc_to_response

user_repo = UserRepository()


async def complete_onboarding(user_id: str, onboarding: OnboardingUpdate) -> UserResponse:
    preferences = {
        "assets": onboarding.assets,
        "investor_type": onboarding.investor_type,
        "content_types": onboarding.content_types,
    }

    updated_user = await user_repo.complete_onboarding(user_id, preferences)
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user_doc_to_response(updated_user)


async def update_preferences(user_id: str, onboarding: OnboardingUpdate) -> UserResponse:
    preferences = {
        "assets": onboarding.assets,
        "investor_type": onboarding.investor_type,
        "content_types": onboarding.content_types,
    }

    updated_user = await user_repo.update_user_preferences(user_id, preferences)
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user_doc_to_response(updated_user)


def get_user_profile(user_doc: dict) -> UserResponse:
    return user_doc_to_response(user_doc)
