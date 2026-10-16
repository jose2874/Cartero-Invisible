//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////

let nom = "Pepe";
let edat = 30;

// Cartes simulades
const cartesSimulades = [
  { id: 1, remitent: "Maria", contingut: "Hola, com estàs? T'escric des del passat." },
  { id: 2, remitent: "Joan", contingut: "Avui he vist un carter misteriós." },
  { id: 3, remitent: "Laia", contingut: "Recorda que el temps és relatiu." }
];


//////////////////////////
// FUNCIONS             //
//////////////////////////

function saluda() {
  alert("Hola, món!");
}


export function renderitzarCartes(cartes) {

  const contenidor = document.querySelector("#contenidorCartes");
  const cosTaula = document.querySelector("#cosTaulaCartes");

  contenidor.innerHTML = "";   // 1. Buidem el taulell
  cosTaula.innerHTML = "";     // 1. Buidem el cos de la taula

  cartes.forEach(carta => {

    // 2. Fabriquem la carta
    const divCarta = document.createElement("div");
    divCarta.className = "carta";

    const titol = document.createElement("h3");
    titol.textContent = `De: ${carta.remitent}`;

    const paragraf = document.createElement("p");
    paragraf.textContent = carta.contingut;

    const idSpan = document.createElement("span");
    idSpan.textContent = `#${carta.id}`;
    idSpan.setAttribute("data-id", carta.id);


    // BOTÓ ELIMINAR
    const botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar";
    botoEliminar.className = "btn-eliminar";
    botoEliminar.setAttribute("data-id", carta.id);


    // 3. Muntem l'estructura
    divCarta.appendChild(titol);
    divCarta.appendChild(paragraf);
    divCarta.appendChild(idSpan);
    divCarta.appendChild(botoEliminar);

    // 4. Pengem la carta al taulell
    contenidor.appendChild(divCarta);

    // 5. Afegim la carta a la taula
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

    botoEliminarTaula.textContent = "Eliminar"; 
    botoEliminarTaula.className = "btn-eliminar"; 
    botoEliminarTaula.setAttribute("data-id", carta.id); 
    botoEliminarTaula.type = "button"; 
    cel·laAccions.appendChild(botoEliminarTaula); 


    fila.appendChild(cel·laId); 
    fila.appendChild(cel·laRemitent); 
    fila.appendChild(cel·laDestinatari); 
    fila.appendChild(cel·laContingut); 
    fila.appendChild(cel·laAccions); 

    cosTaula.appendChild(fila);

  });
}

function toggleTaula() { 
  
  const taula = document.getElementById("taulaCartes"); 
  const boto = document.getElementById("btnMostrarCartes"); 
  
  if (!taula || !boto) { 
    return; 
  }
  const estaOculta = getComputedStyle(taula).display === "none"; 
  
  if (estaOculta) { 
      taula.style.display = "table"; boto.textContent = "Ocultar taula"; 
    } 
  
  else { 
    taula.style.display = "none"; boto.textContent = "Mostrar taula"; 
  } 
}

function inicialitzar() {

  // Botó Saluda
  const boto = document.getElementById("btnSaluda");
  if (boto) {
    boto.addEventListener("click", saluda);
  }


  // Títol
  const titol = document.querySelector("#titolPrincipal");

  if (titol) {
    titol.textContent = "📮 El Cartero Invisible – Setmana 3";
    titol.setAttribute("data-role", "banner");
  }


  // Contenidor
  const contenidor = document.querySelector("#contenidorCartes");
  const cosTaula = document.querySelector("#cosTaulaCartes");

  if (contenidor) {
    contenidor.innerHTML += "<p>Cartes pendents: 0</p>";
  }


  // Info
  const info = document.querySelector(".info");

  if (info) {
    info.style.color = "#2c3e50";
  }


  // Renderitzar les cartes
  renderitzarCartes(cartesSimulades);


  // Boto per afegir una carta
  const btnAfegir = document.querySelector("#btnAfegir");

  if (btnAfegir) {

    btnAfegir.addEventListener("click", () => {

      cartesSimulades.push({

        id: cartesSimulades.length + 1,

        remitent: "Carter " + (cartesSimulades.length + 1),

        contingut: "Aquesta carta s'acaba de crear dinàmicament!"

      });

      renderitzarCartes(cartesSimulades);

    });

  }


  // FORMULARI - SETMANA 4
  const form = document.getElementById("formCarta");

  if (form) {

    form.addEventListener("submit", (event) => {

      event.preventDefault();


      const remitent = document
        .querySelector("#remitent")
        .value
        .trim();


      if (remitent === "") {

        alert("El camp remitent no pot estar buit!");

        return;

      }


      const destinatari = document
        .querySelector("#destinatari").value.trim();


      if (destinatari === "") {

        alert("El camp destinatari no pot estar buit!");

        return;

      }


      const contingut = document.querySelector("#contingut").value.trim();

      if (contingut === "") {
        alert("El camp contingut no pot estar buit!");
        return;
      }

      cartesSimulades.push({
        id: cartesSimulades.length + 1,
        remitent: remitent,
        contingut: contingut
      });


      renderitzarCartes(cartesSimulades);

      form.reset();

    });

  }


  // DELEGACIÓ D'ESDEVENIMENTS
  // Un únic listener per a tots els botons eliminar
  
  
    function eliminarCarta(event) {
       if (event.target.classList.contains("btn-eliminar")) { 
        
      // Agafem l'id de la carta 
       const id = Number(event.target.getAttribute("data-id")); 
       
       // Busquem la posició de la carta 
       const index = cartesSimulades.findIndex( carta => carta.id === id ); 
       
       // Si existeix, l'eliminem 
       if (index !== -1) { 
          cartesSimulades.splice(index, 1); 
        
      // Tornem a renderitzar les cartes i la taula 
        renderitzarCartes(cartesSimulades); 
      } 
      } 
    } // Botons eliminar de les cartes 
      
    if (contenidor) { contenidor.addEventListener("click", eliminarCarta); } // Botons eliminar de la taula 
    if (cosTaula) { cosTaula.addEventListener("click", eliminarCarta); }


  const btnMostrarCartes = document.getElementById("btnMostrarCartes"); 

  if (btnMostrarCartes) { 
    btnMostrarCartes.addEventListener("click", toggleTaula); 
  }

}

//////////////////////////
// CODI                 //
//////////////////////////

// Executa-ho només si estem al navegador
// (evitant problemes a Node/Jest)

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", inicialitzar);
}