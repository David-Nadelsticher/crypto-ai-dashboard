from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import auth, dashboard, users, votes
from app.core.cors import apply_cors_headers, is_allowed_origin
from app.core.limiter import limiter
from app.db.database import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    headers = dict(exc.headers) if exc.headers else {}
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=headers,
    )
    apply_cors_headers(response, request.headers.get("origin"))
    return response


@app.middleware("http")
async def ensure_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        origin = request.headers.get("origin")
        if is_allowed_origin(origin):
            response = await call_next(request)
            apply_cors_headers(response, origin)
            response.headers.setdefault("Access-Control-Allow-Methods", "*")
            response.headers.setdefault("Access-Control-Allow-Headers", "*")
            return response

    response = await call_next(request)
    apply_cors_headers(response, request.headers.get("origin"))
    return response


@app.get("/")
async def read_root():
    return {"message": "Hello Moveo! The FastAPI server is running."}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(votes.router)
