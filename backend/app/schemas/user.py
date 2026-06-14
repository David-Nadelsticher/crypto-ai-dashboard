from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

InvestorType = Literal["HODLer", "Day Trader", "NFT Collector"]
ContentType = Literal["Market News", "Charts", "Social", "Fun"]


class UserPreferences(BaseModel):
    assets: list[str] = Field(default_factory=list)
    investor_type: str | None = None
    content_types: list[str] = Field(default_factory=list)


class UserCreate(BaseModel):
    name: str = Field(max_length=100)
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Please enter your name.")
        if len(trimmed) > 100:
            raise ValueError("Name must be 100 characters or fewer.")
        return trimmed

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password should have at least 8 characters.")
        return value


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    onboarding_completed: bool
    preferences: UserPreferences


class OnboardingUpdate(BaseModel):
    assets: list[str] = Field(max_length=10)
    investor_type: InvestorType
    content_types: list[ContentType] = Field(max_length=4)

    @field_validator("assets")
    @classmethod
    def validate_assets(cls, value: list[str]) -> list[str]:
        if len(value) < 1:
            raise ValueError("Pick at least one asset for Piggy to monitor.")
        if len(value) > 10:
            raise ValueError("You can track up to 10 assets.")
        return value

    @field_validator("content_types")
    @classmethod
    def validate_content_types(cls, value: list[str]) -> list[str]:
        if len(value) < 1:
            raise ValueError("Pick at least one content type for your daily brief.")
        if len(value) > 4:
            raise ValueError("You can choose up to 4 content types.")
        return value
