from typing import Literal



from pydantic import BaseModel, EmailStr, Field



InvestorType = Literal["HODLer", "Day Trader", "NFT Collector"]

ContentType = Literal["Market News", "Charts", "Social", "Fun"]





class UserPreferences(BaseModel):

    assets: list[str] = Field(default_factory=list)

    investor_type: str | None = None

    content_types: list[str] = Field(default_factory=list)





class UserCreate(BaseModel):

    name: str = Field(min_length=1, max_length=100)

    email: EmailStr

    password: str = Field(min_length=8)





class UserResponse(BaseModel):

    id: str

    name: str

    email: EmailStr

    onboarding_completed: bool

    preferences: UserPreferences





class OnboardingUpdate(BaseModel):

    assets: list[str] = Field(min_length=1, max_length=10)

    investor_type: InvestorType

    content_types: list[ContentType] = Field(min_length=1, max_length=4)

