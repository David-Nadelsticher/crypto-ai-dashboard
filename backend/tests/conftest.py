import os

# Ensure Settings can load before any app modules are imported in tests.
os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017")
os.environ.setdefault("MONGODB_DB_NAME", "crypto_dashboard_test")
os.environ.setdefault(
    "JWT_SECRET_KEY",
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
)
