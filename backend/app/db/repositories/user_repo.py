from datetime import datetime, timezone

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from app.db.database import users_collection


class UserRepository:
    def __init__(self, collection: AsyncIOMotorCollection | None = None) -> None:
        self.collection = collection or users_collection

    async def get_user_by_email(self, email: str) -> dict | None:
        return await self.collection.find_one({"email": email.lower()})

    async def get_user_by_id(self, user_id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    async def create_user(self, user_doc: dict) -> dict:
        result = await self.collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return user_doc

    async def update_user_preferences(self, user_id: str, preferences: dict) -> dict | None:
        now = datetime.now(timezone.utc)
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "preferences": preferences,
                    "updated_at": now,
                }
            },
        )
        return await self.get_user_by_id(user_id)

    async def complete_onboarding(self, user_id: str, preferences: dict) -> dict | None:
        now = datetime.now(timezone.utc)
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "preferences": preferences,
                    "onboarding_completed": True,
                    "updated_at": now,
                }
            },
        )
        return await self.get_user_by_id(user_id)
