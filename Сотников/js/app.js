// Main application logic
class VetClinicApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        console.log('Initializing VetClinicApp...');
        
        // Initialize core systems first
        this.initializeCoreSystems();
        
        // Then setup UI interactions
        this.setupNavigation();
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupGlobalEventListeners();
        
        console.log('VetClinicApp initialized successfully');
    }

    initializeCoreSystems() {
        // Initialize all systems in correct order
        window.authSystem = new AuthSystem();
        window.doctorsData = new DoctorsData();
        window.appointmentsSystem = new AppointmentsSystem();
        window.adminSystem = new AdminSystem();
        
        console.log('All core systems initialized');
    }

    setupNavigation() {
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }

                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (menu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking on links
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav') && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupGlobalEventListeners() {
        // Global click handler for dynamic content
        document.addEventListener('click', (e) => {
            // Handle service appointment buttons
            if (e.target.closest('.service-appointment-btn')) {
                e.preventDefault();
                if (window.appointmentsSystem) {
                    window.appointmentsSystem.openAppointmentModal();
                }
            }

            // Handle hero appointment button
            if (e.target.closest('#heroAppointmentBtn')) {
                e.preventDefault();
                if (window.appointmentsSystem) {
                    window.appointmentsSystem.openAppointmentModal();
                }
            }

            // Handle sidebar appointment button
            if (e.target.closest('.appointment-sidebar-btn')) {
                e.preventDefault();
                if (window.appointmentsSystem) {
                    window.appointmentsSystem.openAppointmentModal();
                }
            }
        });

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing application...');
    
    try {
        window.vetClinicApp = new VetClinicApp();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Fallback: basic functionality
        setupFallbackFunctionality();
    }
});

// Fallback functionality if main app fails
function setupFallbackFunctionality() {
    console.log('Setting up fallback functionality...');
    
    // Basic mobile menu
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
    
    // Basic smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Show error message to user
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        notification.innerHTML = `
            <strong>Внимание:</strong> Некоторые функции могут работать некорректно. 
            Пожалуйста, обновите страницу.
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }, 1000);
}