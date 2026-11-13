from fastapi import FastAPI, HTTPException, status, Request, Response
from pydantic import BaseModel
from typing import Optional, List
import json
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()   # carrega les variables del fitxer .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

app = FastAPI()

# Configuració del middleware CORS (M07)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Pydantic per al cos del POST / PUT
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: Optional[str] = ""
    usuari_id: str | None = None      # opcional

# Nom del fitxer de dades
DATA_FILE = "cartas.json"

# Funcions per llegir i escriure al fitxer JSON
def cargar_cartes() -> List[dict]:
    """Llegeix les cartes del fitxer JSON. Si no existeix o falla, carrega dades per defecte."""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    
    # Dades inicials si el fitxer no existeix
    cartes_inicials = [
        {"id": 1, "remitent": "Pau", "destinatari": "Anna", "contingut": "Hola Anna!", "personatge": "Einstein"},
        {"id": 2, "remitent": "Anna", "destinatari": "Pau", "contingut": "Hola Pau!", "personatge": "Newton"},
        {"id": 3, "remitent": "Marc", "destinatari": "Laura", "contingut": "Com estàs?", "personatge": "Einstein"},
        {"id": 4, "remitent": "Laura", "destinatari": "Marc", "contingut": "Molt bé!", "personatge": "Curie"}
    ]
    guardar_cartes(cartes_inicials)
    return cartes_inicials

def guardar_cartes(cartes_llista: List[dict]):
    """Escriu les cartes al fitxer JSON."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cartes_llista, f, indent=2, ensure_ascii=False)

def nou_id() -> int:
    """Genera un nou ID incremental basant-se en les cartes existents al fitxer JSON."""
    actuals = cargar_cartes()
    if not actuals:
        return 1
    return max(c["id"] for c in actuals) + 1

# Carreguem les cartes de la memòria/fitxer en iniciar
cartes = cargar_cartes()


# ----------------------------------------------------
# ENDPOINTS
# ----------------------------------------------------
@app.get("/config")
def config():
    return {
        "debug": DEBUG,
        "ia_configurada": GEMINI_API_KEY is not None and GEMINI_API_KEY != ""
    }

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}


# GET /cartas
@app.get("/cartas", status_code=status.HTTP_200_OK)
def llistar_cartes(limit: int = 10, offset: int = 0, personatge: Optional[str] = None):
    global cartes
    cartes = cargar_cartes()

    if personatge:
        cartes_filtrades = [c for c in cartes if c.get("personatge") == personatge]
    else:
        cartes_filtrades = cartes

    return cartes_filtrades[offset : offset + limit]


# GET /cartas/{id}
@app.get("/cartas/{id}", status_code=status.HTTP_200_OK)
def obtenir_carta(id: int):
    global cartes
    cartes = cargar_cartes()

    for carta in cartes:
        if carta["id"] == id:
            return carta

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Carta no trobada"
    )


# POST /cartas (Retorna status 201 Created)
@app.post("/cartas", status_code=status.HTTP_201_CREATED)
def crear_carta(carta: Carta, request: Request):
    global cartes
    cartes = cargar_cartes()

    nova_carta = carta.model_dump()
    nova_carta["id"] = nou_id()
    # La cookie té prioritat; si no arriba, ens quedem amb l'usuari_id que envia el client
    nova_carta["usuari_id"] = request.cookies.get("usuari_id") or carta.usuari_id

    cartes.append(nova_carta)
    guardar_cartes(cartes)
    return nova_carta


# PUT /cartas/{id}
@app.put("/cartas/{id}")
def actualitzar_carta(id: int, carta: Carta):
    global cartes
    cartes = cargar_cartes()

    for i, c in enumerate(cartes):
        if c["id"] == id:
            cartes[i] = {
                "id": id,
                "remitent": carta.remitent,
                "destinatari": carta.destinatari,
                "contingut": carta.contingut,
                "personatge": carta.personatge,
                "usuari_id": carta.usuari_id or c.get("usuari_id")
            }
            guardar_cartes(cartes)
            return cartes[i]

    raise HTTPException(status_code=404, detail="Carta no trobada")


# DELETE /cartas/{id}
@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    global cartes
    cartes = cargar_cartes()

    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}

    raise HTTPException(status_code=404, detail="Carta no trobada")


@app.post("/login")
def login_simulat(nom_usuari: str, response: Response):
    response.set_cookie(key="usuari_id", value=nom_usuari, max_age=30*24*60*60, path="/")
    return {"missatge": f"Benvingut, {nom_usuari}!"}


@app.get("/perfil")
def perfil(request: Request):
    global cartes
    cartes = cargar_cartes()

    usuari = request.cookies.get("usuari_id")
    if not usuari:
        raise HTTPException(status_code=401, detail="No hi ha sessió activa")

    cartes_usuari = [c for c in cartes if c.get("usuari_id") == usuari]
    return {"usuari_id": usuari, "cartes": cartes_usuari}


@app.delete("/logout")
def logout(response: Response):
    response.delete_cookie(key="usuari_id", path="/")
    return {"missatge": "Sessió tancada"}