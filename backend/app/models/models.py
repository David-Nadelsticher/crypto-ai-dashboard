from pydantic import BaseModel, EmailStr, Field


class UserPreferences(BaseModel):
    assets: list[str] = Field(default_factory=list)
    investor_type: str | None = None
    content_types: list[str] = Field(default_factory=list)


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    onboarding_completed: bool
    preferences: UserPreferences


class OnboardingUpdate(BaseModel):
    assets: list[str]
    investor_type: str
    content_types: list[str]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
