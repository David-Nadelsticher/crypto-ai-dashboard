from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    MONGODB_URI: str
    MONGODB_DB_NAME: str = "crypto_dashboard"
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CCDATA_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "meta-llama/llama-3-8b-instruct:free"
    OPENROUTER_SITE_URL: str = "http://localhost:5173"
    OPENROUTER_APP_NAME: str = "Crypto AI Dashboard"
    SEED_TEST_EMAIL: str = "test@example.com"
    SEED_TEST_PASSWORD: str = "password123"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @field_validator("JWT_SECRET_KEY")
    @classmethod
    def jwt_secret_must_be_strong(cls, value: str) -> str:
        if value == "change-me-in-production" or len(value) < 32:
            raise ValueError(
                "JWT_SECRET_KEY must be set via env and be at least 32 characters"
            )
        return value


settings = Settings()
