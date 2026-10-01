import pytest
from main import app
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_create_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Pau", "destinatari": "Anna", "contingut": "Hola Anna!", "personatge": "Einstein"}
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 200   # o 201 si l'has configurat
        assert response.json()["id"] is not None
        assert response.json()["remitent"] == "Pau"

@pytest.mark.asyncio
async def test_create_carta_invalid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Pau"}   # falten camps obligatoris
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 422
