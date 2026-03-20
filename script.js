// Elementos principales de interacción.
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const yearElement = document.getElementById('year');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const revealElements = document.querySelectorAll('[data-reveal]');

if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

// Menú móvil accesible.
if (menuToggle && mobileMenu) {
	menuToggle.addEventListener('click', () => {
		const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!isExpanded));
		mobileMenu.hidden = isExpanded;
	});

	mobileLinks.forEach((link) => {
		link.addEventListener('click', () => {
			menuToggle.setAttribute('aria-expanded', 'false');
			mobileMenu.hidden = true;
		});
	});
}

// Revelado sutil al hacer scroll.
if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		(entries, currentObserver) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add('is-visible');
				currentObserver.unobserve(entry.target);
			});
		},
		{
			threshold: 0.18,
			rootMargin: '0px 0px -40px 0px'
		}
	);

	revealElements.forEach((element) => observer.observe(element));
} else {
	revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Validación básica del formulario para demo estática.
if (form && formStatus) {
	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const name = String(formData.get('name') || '').trim();
		const email = String(formData.get('email') || '').trim();
		const message = String(formData.get('message') || '').trim();
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

		if (!name || !email || !message) {
			formStatus.textContent = 'Por favor completa todos los campos antes de enviar tu consulta.';
			formStatus.className = 'mt-5 text-sm font-semibold text-red-600';
			return;
		}

		if (!isEmailValid) {
			formStatus.textContent = 'Introduce un correo electrónico válido para poder contactarte.';
			formStatus.className = 'mt-5 text-sm font-semibold text-red-600';
			return;
		}

		formStatus.textContent = 'Gracias. Tu mensaje ha sido preparado correctamente. Integra este formulario con tu backend o proveedor de email para recibir solicitudes reales.';
		formStatus.className = 'mt-5 text-sm font-semibold text-emerald-600';
		form.reset();
	});
}
