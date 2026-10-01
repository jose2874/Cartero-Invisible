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
cartes = []


# Endpoint de la ruta arrel
@app.get("/")
def root():
    return {"missatge": "Hola, món!"}


# GET /cartas
# Retorna les cartes que hi ha en memòria
@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0):
    return cartes[offset:offset + limit]


# GET /cartas/{id}
# Obté una carta concreta per ID
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
# Crea una carta nova
@app.post("/cartas")
def crear_carta(carta: Carta):

    nova_carta = carta.dict()

    nova_carta["id"] = len(cartes) + 1

    cartes.append(nova_carta)

    return nova_carta