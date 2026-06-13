import asyncio

from datetime import datetime, timezone



from fastapi import HTTPException, status

from pymongo.errors import DuplicateKeyError



from app.core.security import create_access_token, hash_password, verify_password

from app.db.repositories.user_repo import UserRepository

from app.schemas.token import Token

from app.schemas.user import UserCreate, UserResponse

from app.services.user_mapper import user_doc_to_response



user_repo = UserRepository()





async def register_user(user_data: UserCreate) -> UserResponse:

    existing_user = await user_repo.get_user_by_email(user_data.email)

    if existing_user:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="A user with this email already exists",

        )



    password_hash = await asyncio.to_thread(hash_password, user_data.password)

    now = datetime.now(timezone.utc)

    user_doc = {

        "name": user_data.name,

        "email": user_data.email.lower(),

        "password_hash": password_hash,

        "onboarding_completed": False,

        "preferences": {

            "assets": [],

            "investor_type": None,

            "content_types": [],

        },

        "created_at": now,

        "updated_at": now,

    }



    try:

        created_user = await user_repo.create_user(user_doc)

    except DuplicateKeyError:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="A user with this email already exists",

        )



    return user_doc_to_response(created_user)





async def authenticate_user(email: str, password: str) -> Token:

    user = await user_repo.get_user_by_email(email)

    if user is None:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Incorrect email or password",

            headers={"WWW-Authenticate": "Bearer"},

        )



    valid = await asyncio.to_thread(verify_password, password, user["password_hash"])

    if not valid:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Incorrect email or password",

            headers={"WWW-Authenticate": "Bearer"},

        )



    access_token = create_access_token(data={"sub": str(user["_id"])})

    return Token(access_token=access_token, token_type="bearer")

