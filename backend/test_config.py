from app.core.config import settings


def mask_secret(secret: str) -> str:
    """Masks a secret string, revealing only the first 4 and last 4 characters."""
    if not secret:
        return "❌ NOT SET (Empty or Missing)"

    if len(secret) < 10:
        return "✅ SET (But unusually short)"

    return f"✅ SET (Starts with: {secret[:4]}... Ends with: {secret[-4:]})"


if __name__ == "__main__":
    print("=======================================")
    print("🔍 SECURE CONFIGURATION CHECK")
    print("=======================================\n")

    # Sensitive Data (Masked)
    print(f"MongoDB URI:          {mask_secret(settings.MONGODB_URI)}")
    print(f"JWT Secret Key:       {mask_secret(settings.JWT_SECRET_KEY)}")
    print(f"CCData API Key:       {mask_secret(settings.CCDATA_API_KEY)}")
    print(f"OpenRouter API Key:   {mask_secret(settings.OPENROUTER_API_KEY)}")

    print("\n--- Non-Sensitive Data ---")

    # Non-Sensitive Data (Plain text)
    print(f"Database Name:        {settings.MONGODB_DB_NAME}")
    print(f"OpenRouter Model:     {settings.OPENROUTER_MODEL}")
    print(f"Token Expiration:     {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    print("\n=======================================")