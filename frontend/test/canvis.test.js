test('canvia el text i l\'estil del títol', () => {
  document.body.innerHTML = `<h1 id="titol">El Cartero Invisible</h1>`;
  const titol = document.getElementById('titol');

  // Simula l'execució del teu codi
  titol.textContent = '📮 El Cartero Invisible – Setmana 2';
  titol.style.color = '#2c3e50';
  titol.setAttribute('data-role', 'banner');

  expect(titol.textContent).toBe('📮 El Cartero Invisible – Setmana 2');
  expect(titol.style.color).toBe('rgb(44, 62, 80)');
  expect(titol.getAttribute('data-role')).toBe('banner');
});
