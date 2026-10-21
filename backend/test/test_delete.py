import pytest
import json
from main import app
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_persistencia_post():
    with open("cartas.json", "r") as f:
        dades_abans = json.load(f)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Test", "destinatari": "Test", "contingut": "Test", "personatge": "Test"}
        await ac.post("/cartas", json=payload)

    with open("cartas.json", "r") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1

@pytest.mark.asyncio
async def test_delete_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete("/cartas/4")
        assert response.status_code == 200

    with open("cartas.json", "r") as f:
        dades = json.load(f)
    assert not any(c["id"] == 3 for c in dades)
