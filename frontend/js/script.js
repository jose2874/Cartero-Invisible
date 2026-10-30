//////////////////////////
// FUNCIONS PRINCIPALS  //
//////////////////////////

function saluda() {
  alert("Hola, món!");
}

// 1. Carregar cartes des del servidor (GET /cartas)
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

// 2. Renderitzar la interfície amb les cartes
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
    // --- Targetes (Vista Taulell) ---
    if (contenidor) {
      const divCarta = document.createElement("div");
      divCarta.className = "carta";

      const titol = document.createElement("h3");
      titol.textContent = `De: ${carta.remitent}`;

      const paragraf = document.createElement("p");
      paragraf.textContent = carta.contingut;

      // Contenidor per als botons
      const divAccions = document.createElement("div");
      divAccions.className = "accions-carta";

      // BOTÓ EDITAR
      const botoEditar = document.createElement("button");
      botoEditar.type = "button";
      botoEditar.textContent = "Editar";
      botoEditar.className = "btn-editar";
      botoEditar.setAttribute("data-id", carta.id);

      // BOTÓ ELIMINAR
      const botoEliminar = document.createElement("button");
      botoEliminar.type = "button";
      botoEliminar.textContent = "Eliminar";
      botoEliminar.className = "btn-eliminar";
      botoEliminar.setAttribute("data-id", carta.id);

      divAccions.appendChild(botoEditar);
      divAccions.appendChild(botoEliminar);

      divCarta.appendChild(titol);
      divCarta.appendChild(paragraf);
      divCarta.appendChild(divAccions);

      contenidor.appendChild(divCarta);
    }

    // --- Taula ---
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
      
      const botoEditarTaula = document.createElement("button");
      botoEditarTaula.type = "button";
      botoEditarTaula.textContent = "Editar";
      botoEditarTaula.className = "btn-editar";
      botoEditarTaula.setAttribute("data-id", carta.id);

      const botoEliminarTaula = document.createElement("button");
      botoEliminarTaula.type = "button";
      botoEliminarTaula.textContent = "Eliminar";
      botoEliminarTaula.className = "btn-eliminar";
      botoEliminarTaula.setAttribute("data-id", carta.id);

      cel·laAccions.appendChild(botoEditarTaula);
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

// 3. Eliminar carta al servidor (DELETE /cartas/{id})
export async function eliminarCartaServidor(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 404) {
      alert("La carta ja no existeix al servidor.");
      return;
    }

    if (!response.ok) {
      throw new Error(`Error HTTP en eliminar: ${response.status}`);
    }

    await carregarCartes();
  } catch (error) {
    console.error('Error eliminant la carta:', error);
    alert("No s'ha pogut eliminar la carta.");
  }
}

// 4. Carregar dades d'una carta concreta i obrir el Modal d'Edició
async function obrirModalEditar(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`);
    if (!response.ok) throw new Error("Error en carregar la carta");

    const carta = await response.json();

    // Assignem els valors al formulari del modal (l'ID s'amaga al camp hidden)
    document.querySelector("#edit-id").value = carta.id;
    document.querySelector("#edit-remitent").value = carta.remitent;
    document.querySelector("#edit-destinatari").value = carta.destinatari || "";
    document.querySelector("#edit-contingut").value = carta.contingut;
    document.querySelector("#edit-personatge").value = carta.personatge || "";

    // Mostrem el modal
    const modal = document.querySelector("#modalEditar");
    if (modal) modal.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("No s'han pogut carregar les dades de la carta per editar.");
  }
}

// 5. Mostrar / Ocultar Taula
function toggleTaula() {
  const taula = document.getElementById("taulaCartes");
  const boto = document.getElementById("btnMostrarCartes");

  if (!taula || !boto) return;

  const estaOculta = getComputedStyle(taula).display === "none";

  if (estaOculta) {
    taula.style.display = "table";
    boto.textContent = "Ocultar cartes";
  } else {
    taula.style.display = "none";
    boto.textContent = "Mostrar cartes";
  }
}

// 6. Actualitzar carta al servidor (PUT /cartas/{id})
export async function actualitzarCarta(id, dades) {
  const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dades)
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response;
}

//////////////////////////
// INICIALITZACIÓ       //
//////////////////////////

function inicialitzar() {
  // Botó Saluda
  const btnSaluda = document.getElementById("btnSaluda");
  if (btnSaluda) btnSaluda.addEventListener("click", saluda);

  // Títol Principal
  const titol = document.querySelector("#titolPrincipal");
  if (titol) {
    titol.textContent = "📮 El Cartero Invisible";
    titol.setAttribute("data-role", "banner");
  }

  // FORMULARI PRINCIPAL - Enviar nova carta (POST /cartas)
  const form = document.getElementById("formCarta");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const remitent = document.querySelector("#remitent")?.value.trim();
      const destinatari = document.querySelector("#destinatari")?.value.trim();
      const contingut = document.querySelector("#contingut")?.value.trim();
      const personatge = document.querySelector("#personatge")?.value.trim() || "";

      if (!remitent || !destinatari || !contingut) {
        alert("Tots els camps principals són obligatoris!");
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/cartas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            remitent: remitent,
            destinatari: destinatari,
            contingut: contingut,
            personatge: personatge
          })
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        form.reset();
        await carregarCartes(); // Actualitzem la llista
      } catch (error) {
        console.error('Error enviant la carta:', error);
        alert("No s'ha pogut guardar la carta al servidor.");
      }
    });
  }

  // FORMULARI MODAL - Guardar canvis d'edició (PUT /cartas/{id})
  const formEditar = document.querySelector("#formEditarCarta");
  if (formEditar) {
    formEditar.addEventListener("submit", async (event) => {
      event.preventDefault();

      const id = document.querySelector("#edit-id")?.value;
      const remitent = document.querySelector("#edit-remitent")?.value.trim();
      const destinatari = document.querySelector("#edit-destinatari")?.value.trim();
      const contingut = document.querySelector("#edit-contingut")?.value.trim();
      const personatge = document.querySelector("#edit-personatge")?.value.trim() || "";

      try {
        await actualitzarCarta(id, {
          remitent,
          destinatari,
          contingut,
          personatge
        });

        // Ocultem el modal i refresquem les cartes
        const modal = document.querySelector("#modalEditar");
        if (modal) modal.style.display = "none";

        await carregarCartes();
      } catch (error) {
        console.error('Error guardant canvis:', error);
        alert("No s'han pogut desar els canvis de la carta.");
      }
    });
  }

  // DELEGACIÓ D'ESDEVENIMENTS (Editar i Eliminar)
  const manejarClics = (event) => {
    const id = event.target.getAttribute("data-id");
    if (!id) return;

    if (event.target.classList.contains("btn-editar")) {
      obrirModalEditar(id);
    } else if (event.target.classList.contains("btn-eliminar")) {
      eliminarCartaServidor(id);
    }
  };

  const contenidor = document.querySelector("#contenidorCartes");
  const cosTaula = document.querySelector("#cosTaulaCartes");

  if (contenidor) contenidor.addEventListener("click", manejarClics);
  if (cosTaula) cosTaula.addEventListener("click", manejarClics);

  // CONTROL DEL MODAL (Tancar amb X o clic fora)
  const modal = document.querySelector("#modalEditar");
  const btnTancarModal = document.querySelector("#btnTancarModal");

  if (btnTancarModal) {
    btnTancarModal.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Botó Mostrar / Ocultar Taula
  const btnMostrarCartes = document.getElementById("btnMostrarCartes");
  if (btnMostrarCartes) {
    btnMostrarCartes.addEventListener("click", toggleTaula);
  }
}

//////////////////////////
// CODI EXECUTABLE      //
//////////////////////////

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    inicialitzar();
    carregarCartes();
  });
}