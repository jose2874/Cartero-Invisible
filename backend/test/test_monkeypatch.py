import main
import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_config_no_exposa_la_clau(monkeypatch):
    # Simulem una clau configurada, sense dependre del teu .env real
    monkeypatch.setattr(main, "GEMINI_API_KEY", "clau_secreta_de_prova")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/config")
        assert response.status_code == 200
        assert response.json()["ia_configurada"] is True
        # La clau MAI ha d'aparèixer a la resposta
        assert "clau_secreta_de_prova" not in response.text


@pytest.mark.asyncio
async def test_config_sense_clau(monkeypatch):
    monkeypatch.setattr(main, "GEMINI_API_KEY", None)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/config")
        assert response.json()["ia_configurada"] is False
