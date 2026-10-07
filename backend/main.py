from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# Model Pydantic
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str


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
    nova_carta = carta.dict()

    nova_carta["id"] = len(cartes) + 1

    cartes.append(nova_carta)

    return nova_carta