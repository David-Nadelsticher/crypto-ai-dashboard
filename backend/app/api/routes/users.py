from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.schemas.user import OnboardingUpdate, UserResponse
from app.services import user_service

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return user_service.get_user_profile(current_user)


@router.post("/onboarding", response_model=UserResponse)
async def complete_onboarding(
    onboarding: OnboardingUpdate,
    current_user: dict = Depends(get_current_user),
):
    return await user_service.complete_onboarding(str(current_user["_id"]), onboarding)


@router.patch("/me/preferences", response_model=UserResponse)
async def update_preferences(
    preferences: OnboardingUpdate,
    current_user: dict = Depends(get_current_user),
):
    return await user_service.update_preferences(str(current_user["_id"]), preferences)
