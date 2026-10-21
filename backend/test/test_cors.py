import pytest
from main import app
from httpx import ASGITransport, AsyncClient


@pytest.mark.asyncio
async def test_cors_headers():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas", headers={"Origin": "http://127.0.0.1:5500"})
        assert "access-control-allow-origin" in response.headers

@pytest.mark.asyncio
async def test_get_cartes():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
