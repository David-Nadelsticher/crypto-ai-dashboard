from contextlib import asynccontextmanager
from datetime import datetime, timezone

import jwt
from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.database import close_db, init_db, users_collection
from app.models.models import OnboardingUpdate, Token, UserCreate, UserPreferences, UserResponse
from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(lifespan=lifespan)


def _user_doc_to_response(user_doc: dict) -> UserResponse:
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


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise credentials_exception
        return user
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception


@app.get("/")
def read_root():
    return {"message": "Hello Moveo! The FastAPI server is running."}


@app.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    now = datetime.now(timezone.utc)
    user_doc = {
        "name": user.name,
        "email": user.email.lower(),
        "password_hash": hash_password(user.password),
        "onboarding_completed": False,
        "preferences": {
            "assets": [],
            "investor_type": None,
            "content_types": [],
        },
        "created_at": now,
        "updated_at": now,
    }

    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return _user_doc_to_response(user_doc)


@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username.lower()})
    if user is None or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return Token(access_token=access_token, token_type="bearer")


@app.post("/onboarding", response_model=UserResponse)
async def complete_onboarding(
    onboarding: OnboardingUpdate,
    current_user: dict = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    preferences = {
        "assets": onboarding.assets,
        "investor_type": onboarding.investor_type,
        "content_types": onboarding.content_types,
    }

    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "preferences": preferences,
                "onboarding_completed": True,
                "updated_at": now,
            }
        },
    )

    updated_user = await users_collection.find_one({"_id": current_user["_id"]})
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return _user_doc_to_response(updated_user)
