# CARTERO INVISIBLE

## SEMANA 1

Full-stack project architecture overview.

📁 Project Structure & Inline Comments
```
projectoRaul/
├── .vscode/             # VS Code workspace settings, extensions, and debug configurations
├── backend/             # Python backend server module
│   ├── __pycache__/     # Compiled Python bytecode cache files (auto-generated)
│   ├── .env             # Environment variables (secrets, DB keys, API endpoints)
│   ├── .pytest_cache/   # Pytest cache directory for testing framework state
│   ├── test/            # Unit and integration tests for backend logic
│   ├── main.py          # Main entry point for the API server (e.g., FastAPI, Flask)
│   └── requirements.txt # List of required Python dependencies/packages
├── frontend/            # Client-side web interface module
│   ├── js/              # Frontend JavaScript source scripts and logic
│   ├── node_modules/    # Installed npm packages and external libraries
│   ├── style/           # Cascading Style Sheets (CSS/SCSS) for page design
│   ├── test/            # Frontend unit and UI tests
│   ├── index.html       # Primary HTML entry page
│   ├── package-lock.json# Auto-generated file locking exact npm package versions
│   └── package.json     # Node.js manifest file (dependencies, scripts, metadata)
├── .gitignore           # File specifying untracked files for Git to ignore
└── README.md            # Main project documentation and overview file
```

🚀 Quick Execution Commands

Backend

cd backend
python -m venv venv && source venv/bin/activate # Activate virtual environment
pip install -r requirements.txt                 # Install dependencies
python main.py                                  # Start backend server


Frontend

cd frontend
npm install                                     # Install npm dependencies
npm start                                       # Start frontend dev server



## SEMANA 2

We have to do a endpoint for get a cart by id
```
@app.get("/cartas/{id}")
def obtenir_carta(id: int):
    # Dades simulades (més endavant es llegiran de fitxer)
    cartes = [
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."}
    ]
    for c in cartes:
        if c["id"] == id:
            return c
    return {"error": "Carta no trobada"}, 404 
```

