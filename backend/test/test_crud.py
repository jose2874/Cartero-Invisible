import pytest
from main import app
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_update_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Nou", "destinatari": "Nou", "contingut": "Nou", "personatge": "Nou"}
        response = await ac.put("/cartas/1", json=payload)
        assert response.status_code == 200
        assert response.json()["remitent"] == "Nou"

@pytest.mark.asyncio
async def test_update_carta_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "X", "destinatari": "X", "contingut": "X", "personatge": "X"}
        response = await ac.put("/cartas/999", json=payload)
        assert response.status_code == 404
