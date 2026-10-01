test('renderitza les cartes correctament', async () => {

    const { renderitzarCartes } = await import('../js/script.js');

    const cartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola!' },
        { id: 2, remitent: 'Joan', contingut: 'Com estàs?' }
    ];

    document.body.innerHTML = `<div id="contenidorCartes"></div>`;

    renderitzarCartes(cartes);

    const cartesElements = document.querySelectorAll('.carta');

    expect(cartesElements.length).toBe(2);

    expect(cartesElements[0].querySelector('h3').textContent)
        .toBe('De: Maria');

    expect(cartesElements[0].querySelector('p').textContent)
        .toBe('Hola!');
});