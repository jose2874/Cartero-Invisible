function saluda() {
  alert("Hola, món!");
}

const boto = document.getElementById("btnSaluda");
if (boto) {
  boto.addEventListener("click", saluda);
}

const titol = document.querySelector("#titolPrincipal");
if (titol) {
  titol.textContent = "📮 El Cartero Invisible – Setmana 3";
  titol.setAttribute("data-role", "banner");
}

const contenidor = document.querySelector("#contenidorCartes");
if (contenidor) {
  contenidor.innerHTML += "<p>Cartes pendents: 0</p>";
}

const info = document.querySelector(".info");
if (info) {
  info.style.color = "#2c3e50";
}

//Setmana 3
const cartesSimulades = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs? T'escric des del passat." },
    { id: 2, remitent: "Joan", contingut: "Avui he vist un carter misteriós." },
    { id: 3, remitent: "Laia", contingut: "Recorda que el temps és relatiu." }
]

function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    contenidor.innerHTML = "";   // 1. Buidem el taulell

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

         // 3. Muntem l'estructura
        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);

        // 4. Pengem la carta al taulell
        contenidor.appendChild(divCarta);

    });

    // Crida-la en carregar la pàgina
    document.addEventListener("DOMContentLoaded", () => {
        renderitzarCartes(cartesSimulades);
    });

}

//Boto per afegir al final de l'array una nova carta simulada i tornar a renderitzar el taulell
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

export { renderitzarCartes };