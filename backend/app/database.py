import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "crypto_dashboard")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI environment variable is not set")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]
users_collection: AsyncIOMotorCollection = db["users"]


async def init_db() -> None:
    await users_collection.create_index("email", unique=True)


async def close_db() -> None:
    client.close()
