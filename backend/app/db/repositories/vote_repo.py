from datetime import datetime, timezone

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from app.db.database import votes_collection


class VoteRepository:
    def __init__(self, collection: AsyncIOMotorCollection | None = None) -> None:
        self.collection = collection or votes_collection

    async def upsert_vote(
        self,
        user_id: str,
        section: str,
        item_reference: str,
        vote_value: int,
        content_snapshot: dict,
    ) -> None:
        now = datetime.now(timezone.utc)
        await self.collection.update_one(
            {
                "user_id": ObjectId(user_id),
                "section": section,
                "item_reference": item_reference,
            },
            {
                "$set": {
                    "vote_value": vote_value,
                    "content_snapshot": content_snapshot,
                    "timestamp": now,
                }
            },
            upsert=True,
        )
