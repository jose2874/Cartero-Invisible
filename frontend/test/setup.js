// test/setup.js
// Este código se ejecuta ANTES de que se evalúe cualquier import en tus tests
import { jest } from '@jest/globals';


document.body.innerHTML = `
    <div id="contenidorCartes"></div>
    <table id="taulaCartes"></table>
`;