// 1. IMPORTAR JEST: Obligatorio en entornos ES Modules ("type": "module")
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';


// 2. IMPORTAR TU FUNCIÓN: Ajusta la ruta si tu script está en otra carpeta
import { carregarCartes } from '../js/script.js';


// El DOM ya está preparado gracias a setup.js
global.alert = jest.fn();


beforeEach(() => {
    jest.clearAllMocks();
    // Solo limpiamos el contenido, pero los contenedores ya existen
    document.getElementById('contenidorCartes').innerHTML = '';
});


test('carregarCartes carrega les cartes correctament i actualitza el DOM', async () => {
    const mockCartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola' },
        { id: 2, remitent: 'Joan', contingut: 'Adéu' }
    ];


    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCartes,
    });


    await carregarCartes();


    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/cartas');
    const cartesElements = document.querySelectorAll('.carta');
    expect(cartesElements.length).toBe(2);
});

test('carregarCartes mostra un alert si falla la xarxa', async () => {
    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => { });


    try {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));


        await carregarCartes();


        expect(global.alert).toHaveBeenCalledWith(
            "No s'han pogut carregar les cartes. Comprova que el servidor està en marxa."
        );


        expect(consoleSpy).toHaveBeenCalledWith(
            'Error carregant cartes:',
            expect.any(Error)
        );
    } finally {
        consoleSpy.mockRestore();
    }
});

