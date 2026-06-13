import re

ALLOWED_ORIGIN_REGEX = re.compile(r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$")


def is_allowed_origin(origin: str | None) -> bool:
    return bool(origin and ALLOWED_ORIGIN_REGEX.fullmatch(origin))


def apply_cors_headers(response, origin: str | None) -> None:
    if is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
