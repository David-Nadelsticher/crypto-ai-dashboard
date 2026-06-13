import secrets


def generate_keys():
    print("=======================================")
    print("🔑 Secure Cryptographic Key Generator")
    print("=======================================\n")

    # Generates a 256-bit (64-character) hex string, perfect for JWT_SECRET_KEY
    jwt_secret = secrets.token_hex(32)
    print(f"JWT_SECRET_KEY={jwt_secret}\n")

    # Generates a URL-safe base64 string, great for general API keys or salts
    url_safe_key = secrets.token_urlsafe(32)
    print(f"GENERIC_API_KEY={url_safe_key}\n")

    print("=======================================")
    print("Copy the required keys and paste them into your .env file.")


if __name__ == "__main__":
    generate_keys()