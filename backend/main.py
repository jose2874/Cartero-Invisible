from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import json
import os

app = FastAPI()


# Model Pydantic
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str

# JSON file for storing cartas
DATA_FILE = "cartas.json"

# Emmagatzematge en memòria
cartes = [
    {
        "id": 1,
        "remitent": "Pau",
        "destinatari": "Anna",
        "contingut": "Hola Anna!",
        "personatge": "Einstein"
    },
    {
        "id": 2,
        "remitent": "Anna",
        "destinatari": "Pau",
        "contingut": "Hola Pau!",
        "personatge": "Newton"
    },
    {
        "id": 3,
        "remitent": "Marc",
        "destinatari": "Laura",
        "contingut": "Com estàs?",
        "personatge": "Einstein"
    },
    {
        "id": 4,
        "remitent": "Laura",
        "destinatari": "Marc",
        "contingut": "Molt bé!",
        "personatge": "Curie"
    }
]


# Endpoint de la ruta arrel
@app.get("/")
def root():
    return {"missatge": "Hola, món!"}


# GET /cartas
@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0, personatge: str = None):
    if personatge:
        cartesFiltrades = [
            c for c in cartes
            if c["remitent"] == personatge
        ]
    else:
        cartesFiltrades = cartes

    return cartesFiltrades[offset:offset + limit]


# GET /cartas/{id}
@app.get("/cartas/{id}")
def obtenir_carta(id: int):
    for carta in cartes:
        if carta["id"] == id:
            return carta

    raise HTTPException(
        status_code=404,
        detail="Carta no trobada"
    )


# POST /cartas
@app.post("/cartas")
def crear_carta(carta: Carta):
    nova_carta = carta.model_dump()
    nova_carta["id"] = len(cartes) + 1

    cartes.append(nova_carta)

    guardar_cartes(cartes)

    return nova_carta



def cargar_cartes():
    """Llegeix les cartes del fitxer. Si no existeix, torna una llista buida."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def guardar_cartes(cartes):
    """Escriu les cartes al fitxer."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cartes, f, indent=2, ensure_ascii=False)

@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    global cartes
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Carta no trobada"
    )