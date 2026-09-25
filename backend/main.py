from fastapi import FastAPI,  HTTPException

app = FastAPI()

# Afegeixo un endpoint per a la ruta arrel:
@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

# Afegeizo un endpoint per obtenir una carta per id:
@app.get("/cartas/{id}")
def obtenir_carta(id: int):
    cartes = [
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."}
    ]
    for c in cartes:
        if c["id"] == id:
            return c
    raise HTTPException(
        status_code=404,
        detail="Carta no trobada"
    )

# Afegeixo un endpoint per llistar cartes amb paginació:
@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0):
    cartes = [
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
        {"id": 3, "remitent": "Fauzia", "contingut": "Molt be!"},
        {"id": 4, "remitent": "Lluís", "contingut": "T'escric des del futur."},
        {"id": 5, "remitent": "Anna", "contingut": "Com va tot?"},
        {"id": 6, "remitent": "Pere", "contingut": "Et trobo a faltar."},
        {"id": 7, "remitent": "Laura", "contingut": "Ens veiem aviat!"},
        {"id": 8, "remitent": "Marc", "contingut": "T'escric des de la platja."},
        {"id": 9, "remitent": "Sofia", "contingut": "M'encanta la teva carta!"},
        {"id": 10, "remitent": "David", "contingut": "Fins aviat!"},
        {"id": 11, "remitent": "Clara", "contingut": "T'escric des de la muntanya."},
        {"id": 12, "remitent": "Jordi", "contingut": "Espero que estiguis bé."}
        
    ]
    return cartes[offset:offset+limit]