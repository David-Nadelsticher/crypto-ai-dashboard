from typing import Any

from pydantic import BaseModel, Field


class VoteCreate(BaseModel):
    section: str = Field(min_length=1, max_length=50)
    item_reference: str = Field(min_length=1, max_length=200)
    vote_value: int
    content_snapshot: dict[str, Any] = Field(default_factory=dict)
