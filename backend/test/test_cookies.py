import pytest
from main import app
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_set_cookie_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/login", params={"nom_usuari": "user_test"})
        assert response.status_code == 200
        assert "set-cookie" in response.headers      # ⭐ el servidor estableix la cookie

@pytest.mark.asyncio
async def test_get_cookie_perfil():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        ac.cookies.set("usuari_id", "user_test")     # simulem que el navegador envia la cookie
        response = await ac.get("/perfil")
        assert response.status_code == 200
        assert response.json()["usuari_id"] == "user_test"

@pytest.mark.asyncio
async def test_perfil_sense_cookie():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/perfil")
        assert response.status_code == 401           # sense cookie, no hi ha perfil

@pytest.mark.asyncio
async def test_post_associa_la_carta_a_l_usuari():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        ac.cookies.set("usuari_id", "user_test")
        payload = {"remitent": "Pau", "destinatari": "Anna", "contingut": "Hola", "personatge": "Einstein"}
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 201
        assert response.json()["usuari_id"] == "user_test"
        perfil = (await ac.get("/perfil")).json()
        assert [c["id"] for c in perfil["cartes"]] == [response.json()["id"]]
