// =========================================================
// API CONFIG
// When served by Express (port 5000), use relative URLs (same origin).
// When using Live Server (port 5500), point to the backend on port 5000.
// =========================================================
const API_BASE_URL = (window.location.port === '5000' || window.location.port === '')
    ? ''
    : 'http://localhost:5000';

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Contact form — submit to backend API
const contactForm = document.getElementById('contactForm');
const contactAlert = document.getElementById('contactAlert');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

function showContactAlert(message, type) {
    if (!contactAlert) return;
    contactAlert.textContent = message;
    contactAlert.className = `alert alert-${type}`;
    contactAlert.classList.remove('d-none');
}

function hideContactAlert() {
    if (!contactAlert) return;
    contactAlert.classList.add('d-none');
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideContactAlert();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showContactAlert('Please fill in all fields.', 'warning');
            return;
        }

        contactSubmitBtn.disabled = true;
        contactSubmitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(`${API_BASE_URL}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });

            const result = await response.json();

            if (!response.ok) {
                showContactAlert(result.message || 'Failed to send message.', 'danger');
                return;
            }

            showContactAlert(result.message, 'success');
            contactForm.reset();

            setTimeout(hideContactAlert, 6000);
        } catch (error) {
            console.error('Contact request failed:', error);
            showContactAlert(
                'Could not reach the server. Make sure the backend is running.',
                'danger'
            );
        } finally {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.textContent = 'Send Message';
        }
    });
}

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, section').forEach(el => {
    observer.observe(el);
});

// Active navigation link highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Event registration — open modal and submit to backend API
const registrationModalEl = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');
const registrationAlert = document.getElementById('registrationAlert');
const registrationSubmitBtn = document.getElementById('registrationSubmitBtn');
const registrationEventNameDisplay = document.getElementById('registrationEventName');
const regEventNameInput = document.getElementById('regEventName');

let registrationModal;

if (registrationModalEl) {
    registrationModal = new bootstrap.Modal(registrationModalEl);
}

function showRegistrationAlert(message, type) {
    if (!registrationAlert) return;

    registrationAlert.textContent = message;
    registrationAlert.className = `alert alert-${type}`;
    registrationAlert.classList.remove('d-none');
}

function hideRegistrationAlert() {
    if (!registrationAlert) return;
    registrationAlert.classList.add('d-none');
}

function openRegistrationModal(eventTitle) {
    hideRegistrationAlert();
    registrationForm.classList.remove('was-validated');
    registrationForm.reset();

    registrationEventNameDisplay.textContent = eventTitle;
    regEventNameInput.value = eventTitle;

    registrationModal.show();
}

document.querySelectorAll('.event-card .btn').forEach(button => {
    button.addEventListener('click', function() {
        const eventTitle = this.closest('.card-body').querySelector('.card-title').textContent;
        openRegistrationModal(eventTitle);
    });
});

if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideRegistrationAlert();

        if (!registrationForm.checkValidity()) {
            registrationForm.classList.add('was-validated');
            return;
        }

        const payload = {
            name: document.getElementById('regName').value.trim(),
            email: document.getElementById('regEmail').value.trim(),
            eventName: regEventNameInput.value,
        };

        registrationSubmitBtn.disabled = true;
        registrationSubmitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch(`${API_BASE_URL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.message || 'Registration failed. Please try again.';
                showRegistrationAlert(errorMessage, 'danger');
                return;
            }

            showRegistrationAlert(result.message || 'Registration successful!', 'success');
            registrationForm.reset();
            registrationForm.classList.remove('was-validated');

            setTimeout(() => {
                registrationModal.hide();
            }, 1500);
        } catch (error) {
            console.error('Registration request failed:', error);
            showRegistrationAlert(
                'Could not reach the server. Make sure the backend is running on port 5000.',
                'danger'
            );
        } finally {
            registrationSubmitBtn.disabled = false;
            registrationSubmitBtn.textContent = 'Submit Registration';
        }
    });
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.querySelector('footer p.mb-0');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `&copy; ${currentYear} Tech Club. All rights reserved.`;
    }
});