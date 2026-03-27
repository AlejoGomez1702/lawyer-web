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

// Validación básica del formulario y envío directo por FormSubmit.
if (form && formStatus) {
	const submitButton = form.querySelector('button[type="submit"]');
	const recipientEmail = 'milervill86@gmail.com';
	const formEndpoint = `https://formsubmit.co/ajax/${recipientEmail}`;

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

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = 'Enviando...';
		}

		formStatus.textContent = 'Enviando tu consulta...';
		formStatus.className = 'mt-5 text-sm font-semibold text-slate-600';

		fetch(formEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				name,
				email,
				message,
				_subject: 'Nueva consulta legal desde el sitio web',
				_template: 'table',
				_captcha: 'false'
			})
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error('No fue posible enviar el formulario.');
				}

				return response.json();
			})
			.then(() => {
				formStatus.textContent = 'Tu consulta fue enviada correctamente. Pronto recibirás respuesta.';
				formStatus.className = 'mt-5 text-sm font-semibold text-emerald-600';
				form.reset();
			})
			.catch(() => {
				formStatus.textContent = 'No se pudo enviar el formulario en este momento. Intenta de nuevo o escríbenos por WhatsApp.';
				formStatus.className = 'mt-5 text-sm font-semibold text-red-600';
			})
			.finally(() => {
				if (submitButton) {
					submitButton.disabled = false;
					submitButton.textContent = 'Enviar mensaje';
				}
			});
	});
}
