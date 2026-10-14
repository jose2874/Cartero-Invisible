import userEvent from '@testing-library/user-event';


// 1. Añade 'async' a la función del test
test('delegació d\'events: elimina carta en clicar el botó', async () => {
    document.body.innerHTML = `
        <div id="contenidorCartes">
            <div class="carta" data-id="1">
                <button class="btn-eliminar">Eliminar</button>
            </div>
        </div>
    `;


    const contenidor = document.getElementById('contenidorCartes');
    contenidor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const carta = e.target.closest('.carta');
            carta.remove();
        }
    });


    const btn = document.querySelector('.btn-eliminar');
    
    // 2. Configura userEvent (Recomendado para v14+)
    const user = userEvent.setup();
    
    // 3. Añade 'await' antes del clic
    await user.click(btn);


    expect(document.querySelectorAll('.carta').length).toBe(0);
});
