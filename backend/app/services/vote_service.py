from fastapi import HTTPException, status

from app.db.repositories.vote_repo import VoteRepository
from app.schemas.vote import VoteCreate

vote_repo = VoteRepository()


async def record_vote(user_id: str, vote: VoteCreate) -> dict[str, str]:
    if vote.vote_value not in (1, -1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="vote_value must be 1 (up) or -1 (down)",
        )

    await vote_repo.upsert_vote(
        user_id=user_id,
        section=vote.section,
        item_reference=vote.item_reference,
        vote_value=vote.vote_value,
        content_snapshot=vote.content_snapshot,
    )

    return {"message": "Vote recorded successfully"}
