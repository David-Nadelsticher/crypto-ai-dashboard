from fastapi import APIRouter, Depends, Request, status

from fastapi.security import OAuth2PasswordRequestForm



from app.core.limiter import limiter

from app.schemas.token import Token

from app.schemas.user import UserCreate, UserResponse

from app.services import auth_service



router = APIRouter(tags=["auth"])





@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)

@limiter.limit("10/minute")

async def signup(request: Request, user: UserCreate):

    return await auth_service.register_user(user)





@router.post("/login", response_model=Token)

@limiter.limit("10/minute")

async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):

    return await auth_service.authenticate_user(form_data.username, form_data.password)

