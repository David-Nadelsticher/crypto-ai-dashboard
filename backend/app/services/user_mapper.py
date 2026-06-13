from app.schemas.user import UserPreferences, UserResponse


def user_doc_to_response(user_doc: dict) -> UserResponse:
    preferences = user_doc.get("preferences", {})
    return UserResponse(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        onboarding_completed=user_doc.get("onboarding_completed", False),
        preferences=UserPreferences(
            assets=preferences.get("assets", []),
            investor_type=preferences.get("investor_type"),
            content_types=preferences.get("content_types", []),
        ),
    )
