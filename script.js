// Interactividad: año, menú y envío de formulario
document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
toggle && toggle.addEventListener('click', () => {
  if (!nav) return;
  const shown = getComputedStyle(nav).display !== 'none';
  nav.style.display = shown ? 'none' : 'flex';
});

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Enviando...';
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      status.textContent = 'Gracias, tu mensaje ha sido recibido.';
      form.reset();
    } else {
      const err = await res.text();
      status.textContent = 'Error al enviar: ' + err;
    }
  } catch (err) {
    status.textContent = 'Error de red. Intenta de nuevo.';
  }
});