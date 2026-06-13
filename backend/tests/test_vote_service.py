from unittest.mock import AsyncMock, patch

import pytest
from bson import ObjectId
from fastapi import HTTPException

from app.schemas.vote import VoteCreate
from app.services import vote_service


@pytest.fixture
def mock_vote_repo():
    with patch.object(vote_service, "vote_repo") as repo:
        repo.upsert_vote = AsyncMock()
        yield repo


class TestRecordVote:
    @pytest.mark.asyncio
    async def test_record_vote_success(self, mock_vote_repo):
        user_id = str(ObjectId())
        vote = VoteCreate(
            section="news",
            item_reference="article-1",
            vote_value=1,
            content_snapshot={"title": "Bitcoin news"},
        )

        result = await vote_service.record_vote(user_id, vote)

        assert result == {"message": "Vote recorded successfully"}
        mock_vote_repo.upsert_vote.assert_awaited_once_with(
            user_id=user_id,
            section="news",
            item_reference="article-1",
            vote_value=1,
            content_snapshot={"title": "Bitcoin news"},
        )

    @pytest.mark.asyncio
    async def test_record_vote_invalid_value(self, mock_vote_repo):
        vote = VoteCreate(
            section="news",
            item_reference="article-1",
            vote_value=0,
        )

        with pytest.raises(HTTPException) as exc_info:
            await vote_service.record_vote(str(ObjectId()), vote)

        assert exc_info.value.status_code == 400
        mock_vote_repo.upsert_vote.assert_not_called()

    @pytest.mark.asyncio
    async def test_record_vote_default_content_snapshot(self, mock_vote_repo):
        user_id = str(ObjectId())
        vote = VoteCreate(
            section="meme",
            item_reference="meme-1",
            vote_value=-1,
        )

        await vote_service.record_vote(user_id, vote)

        mock_vote_repo.upsert_vote.assert_awaited_once_with(
            user_id=user_id,
            section="meme",
            item_reference="meme-1",
            vote_value=-1,
            content_snapshot={},
        )
