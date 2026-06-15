import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from app.core.config import settings

client = AsyncIOMotorClient(
    settings.MONGODB_URI,
    tlsCAFile=certifi.where(),
)
db = client[settings.MONGODB_DB_NAME]
users_collection: AsyncIOMotorCollection = db["users"]
votes_collection: AsyncIOMotorCollection = db["votes"]


async def init_db() -> None:
    await users_collection.create_index("email", unique=True)
    await votes_collection.create_index(
        [("user_id", 1), ("section", 1), ("item_reference", 1)],
        unique=True,
    )


async def close_db() -> None:
    client.close()
