import asyncio
from datetime import datetime, timezone

import certifi
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.core.security import hash_password


async def seed_database():
    print("Connecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where(),
    )
    db = client[settings.MONGODB_DB_NAME]
    users_collection = db.users

    test_email = settings.SEED_TEST_EMAIL
    test_password = settings.SEED_TEST_PASSWORD

    existing_user = await users_collection.find_one({"email": test_email.lower()})
    if existing_user:
        print(f"Test user {test_email} already exists in the database.")
        return

    now = datetime.now(timezone.utc)
    test_user = {
        "name": "Test User",
        "email": test_email.lower(),
        "password_hash": hash_password(test_password),
        "onboarding_completed": True,
        "preferences": {
            "assets": ["Bitcoin", "Ethereum"],
            "investor_type": "HODLer",
            "content_types": ["Market News", "Fun"],
        },
        "created_at": now,
        "updated_at": now,
    }

    print("Inserting test user into the database...")
    await users_collection.insert_one(test_user)

    print("\nDatabase seeded successfully!")
    print(f"Login email: {test_email}")
    print(f"Password: {test_password}")


if __name__ == "__main__":
    asyncio.run(seed_database())
