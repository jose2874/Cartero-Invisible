//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////

let nom = "Pepe";
let edat = 30;

//////////////////////////
// FUNCIONS             //
//////////////////////////

function saluda() {
  alert("Hola, món!");
}

// 1. Carregar cartes des del servidor (GET)
export async function carregarCartes() {
  try {
    const response = await fetch('http://127.0.0.1:8000/cartas');
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const cartes = await response.json();
    renderitzarCartes(cartes);
  } catch (error) {
    console.error('Error carregant cartes:', error);
    alert("No s'han pogut carregar les cartes. Comprova que el servidor està en marxa.");
  }
}

// 2. Renderitzar les cartes a la interfície
export function renderitzarCartes(cartes) {
  const contenidor = document.querySelector("#contenidorCartes");
  const cosTaula = document.querySelector("#cosTaulaCartes");

  if (contenidor) contenidor.innerHTML = "";
  if (cosTaula) cosTaula.innerHTML = "";

  if (!cartes || cartes.length === 0) {
    if (contenidor) contenidor.innerHTML = "<p>No hi ha cartes per mostrar.</p>";
    return;
  }

  cartes.forEach(carta => {
    // --- Renderitzar Targetes ---
    if (contenidor) {
      const divCarta = document.createElement("div");
      divCarta.className = "carta";

      const titol = document.createElement("h3");
      titol.textContent = `De: ${carta.remitent}`;

      const paragraf = document.createElement("p");
      paragraf.textContent = carta.contingut;

      const idSpan = document.createElement("span");
      idSpan.textContent = `#${carta.id}`;
      idSpan.setAttribute("data-id", carta.id);

      const botoEliminar = document.createElement("button");
      botoEliminar.type = "button"; // Evitem comportaments per defecte de formulari
      botoEliminar.textContent = "Eliminar";
      botoEliminar.className = "btn-eliminar";
      botoEliminar.setAttribute("data-id", carta.id);

      divCarta.appendChild(titol);
      divCarta.appendChild(paragraf);
      divCarta.appendChild(idSpan);
      divCarta.appendChild(botoEliminar);

      contenidor.appendChild(divCarta);
    }

    // --- Renderitzar Taula ---
    if (cosTaula) {
      const fila = document.createElement("tr");

      const cel·laId = document.createElement("td");
      cel·laId.textContent = carta.id;

      const cel·laRemitent = document.createElement("td");
      cel·laRemitent.textContent = carta.remitent;

      const cel·laDestinatari = document.createElement("td");
      cel·laDestinatari.textContent = carta.destinatari || "Sense destinatari";

      const cel·laContingut = document.createElement("td");
      cel·laContingut.className = "contingut-cell";
      cel·laContingut.textContent = carta.contingut;

      const cel·laAccions = document.createElement("td");
      const botoEliminarTaula = document.createElement("button");
      botoEliminarTaula.type = "button";
      botoEliminarTaula.textContent = "Eliminar";
      botoEliminarTaula.className = "btn-eliminar";
      botoEliminarTaula.setAttribute("data-id", carta.id);

      cel·laAccions.appendChild(botoEliminarTaula);

      fila.appendChild(cel·laId);
      fila.appendChild(cel·laRemitent);
      fila.appendChild(cel·laDestinatari);
      fila.appendChild(cel·laContingut);
      fila.appendChild(cel·laAccions);

      cosTaula.appendChild(fila);
    }
  });
}

// 3. Eliminar carta al servidor (DELETE)
async function eliminarCartaServidor(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Error HTTP en eliminar: ${response.status}`);
    }

    // Refresquem les cartes del servidor
    await carregarCartes();
  } catch (error) {
    console.error('Error eliminant la carta:', error);
    alert("No s'ha pogut eliminar la carta.");
  }
}

// 4. Mostrar / Ocultar Taula
function toggleTaula() {
  const taula = document.getElementById("taulaCartes");
  const boto = document.getElementById("btnMostrarCartes");

  if (!taula || !boto) return;

  const estaOculta = getComputedStyle(taula).display === "none";

  if (estaOculta) {
    taula.style.display = "table";
    boto.textContent = "Ocultar taula";
  } else {
    taula.style.display = "none";
    boto.textContent = "Mostrar taula";
  }
}

//////////////////////////
// INICIALITZACIÓ       //
//////////////////////////

function inicialitzar() {
  // Botó Saluda
  const boto = document.getElementById("btnSaluda");
  if (boto) boto.addEventListener("click", saluda);

  // Títol
  const titol = document.querySelector("#titolPrincipal");
  if (titol) {
    titol.textContent = "📮 El Cartero Invisible – Setmana 3";
    titol.setAttribute("data-role", "banner");
  }

  // Info
  const info = document.querySelector(".info");
  if (info) info.style.color = "#2c3e50";

  // FORMULARI - Enviar carta al servidor (POST)
  const form = document.getElementById("formCarta");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const remitent = document.querySelector("#remitent")?.value.trim();
      const destinatari = document.querySelector("#destinatari")?.value.trim();
      const contingut = document.querySelector("#contingut")?.value.trim();
      const personatge = document.querySelector("#personatge")?.value.trim() || "";

      if (!remitent || !destinatari || !contingut) {
        alert("Tots els camps són obligatoris!");
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/cartas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remitent: remitent, destinatari: destinatari, contingut: contingut, personatge: personatge })
        });

        if (!response.ok) throw new Error('Error al guardar la carta');

        form.reset();
        await carregarCartes(); // Refresquem la llista
      } catch (error) {
        console.error('Error enviant la carta:', error);
        alert("No s'ha pogut guardar la carta al servidor.");
      }
    });
  }

  // DELEGACIÓ D'ESDEVENIMENTS (Eliminar)
  const contenidor = document.querySelector("#contenidorCartes");
  const cosTaula = document.querySelector("#cosTaulaCartes");

  function manejarEliminar(event) {
    if (event.target.classList.contains("btn-eliminar")) {
      const id = event.target.getAttribute("data-id");
      if (id) {
        eliminarCartaServidor(id);
      }
    }
  }

  if (contenidor) contenidor.addEventListener("click", manejarEliminar);
  if (cosTaula) cosTaula.addEventListener("click", manejarEliminar);

  // Botó Mostrar / Ocultar Taula
  const btnMostrarCartes = document.getElementById("btnMostrarCartes");
  if (btnMostrarCartes) {
    btnMostrarCartes.type = "button";
    btnMostrarCartes.addEventListener("click", toggleTaula);
  }
}

//////////////////////////
// CODI EXECUTABLE      //
//////////////////////////

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    inicialitzar();
    carregarCartes(); // Carrega les cartes inicials des de l'API
  });
}