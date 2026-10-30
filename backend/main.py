from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import json
import os
from fastapi.middleware.cors import CORSMiddleware

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

# Model Pydantic per al cos del POST
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: Optional[str] = ""

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

# Carreguem les cartes de la memòria/fitxer en iniciar
cartes = cargar_cartes()


# ----------------------------------------------------
# ENDPOINTS
# ----------------------------------------------------

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}


# GET /cartas
@app.get("/cartas", status_code=status.HTTP_200_OK)
def llistar_cartes(limit: int = 10, offset: int = 0, personatge: Optional[str] = None):
    # Assegurem que llegim les dades més actualitzades
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
def crear_carta(carta: Carta):
    global cartes
    cartes = cargar_cartes()

    nova_carta = carta.model_dump()
    
    # Generem un ID únic basat en el màxim ID existent per evitar duplicats
    nou_id = max([c.get("id", 0) for c in cartes], default=0) + 1
    nova_carta["id"] = nou_id

    cartes.append(nova_carta)
    guardar_cartes(cartes)

    return nova_carta

# PUT /cartas/{id}
@app.put("/cartas/{id}")
def actualitzar_carta(id: int, carta: Carta):
    for i, c in enumerate(cartes):
        if c["id"] == id:
            # Actualitza totes les dades excepte l'ID
            cartes[i] = {
                "id": id,
                "remitent": carta.remitent,
                "destinatari": carta.destinatari,
                "contingut": carta.contingut,
                "personatge": carta.personatge
            }
            guardar_cartes(cartes)          # ⭐ persisteix al fitxer
            return cartes[i]
    raise HTTPException(status_code=404, detail="Carta no trobada")

# DELETE /cartas/{id}
@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)          # ⭐ persisteix al fitxer
            return {"missatge": "Carta eliminada"}
    raise HTTPException(status_code=404, detail="Carta no trobada")