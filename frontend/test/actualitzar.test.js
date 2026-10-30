import { jest } from '@jest/globals';
import { actualitzarCarta, eliminarCartaServidor } from '../js/script.js'; // Ajusta la ruta


// Mockeamos fetch globalmente para estos tests
global.fetch = jest.fn();


beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos las llamadas a fetch antes de cada test
});


// --- TEST 1: PUT (Actualizar) ---
test('actualitzarCarta fa una petició PUT amb les capçaleres i cos correctes', async () => {
    const dades = { remitent: 'Nou', destinatari: 'Nou', contingut: 'Nou', personatge: 'Nou' };
    
    // Simulamos que el servidor responde OK
    global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ...dades, id: 1 }),
    });


    await actualitzarCarta(1, dades);


    // Comprobamos URL, Método, Body (stringify) y Headers (Content-Type)
    expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/cartas/1',
        expect.objectContaining({ 
            method: 'PUT', 
            body: JSON.stringify(dades),
            headers: { 'Content-Type': 'application/json' } 
        })
    );
});


// --- TEST 2: DELETE (Eliminar) ---
test('eliminarCarta fa una petició DELETE a la URL correcta', async () => {
    global.fetch.mockResolvedValue({ 
        ok: true, 
        status: 204 // 204 No Content es típico en DELETE
    });



    await eliminarCartaServidor(5); // Probamos con ID 5


    expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/cartas/5',
        expect.objectContaining({ method: 'DELETE' })
    );
});


// --- TEST 3: Gestión de errores en PUT ---
test('actualitzarCarta llança error si el servidor respon 404', async () => {
    global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
    });


    // Esperamos que la función lance un error o lo gestione (depende de tu try/catch)
    // Si tu función hace throw new Error:
    await expect(actualitzarCarta(999, {})).rejects.toThrow('Error HTTP: 404');
});
