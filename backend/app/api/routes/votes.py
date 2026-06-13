from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.schemas.vote import VoteCreate
from app.services import vote_service

router = APIRouter(prefix="/api", tags=["votes"])


@router.post("/votes")
async def create_vote(
    vote: VoteCreate,
    current_user: dict = Depends(get_current_user),
):
    return await vote_service.record_vote(str(current_user["_id"]), vote)
