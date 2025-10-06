// Authentication system
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.initializeAuth();
    }

    initializeAuth() {
        this.checkExistingAuth();
        this.setupEventListeners();
        this.updateAuthUI();
    }

    setupEventListeners() {
        // Auth modal
        document.getElementById('authBtn').addEventListener('click', () => this.openAuthModal());
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target));
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    openAuthModal() {
        if (this.isLoggedIn) {
            // Show user profile instead of logout
            this.showUserProfile();
        } else {
            document.getElementById('authModal').style.display = 'flex';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    switchAuthTab(clickedTab) {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));
        
        clickedTab.classList.add('active');
        document.getElementById(clickedTab.dataset.tab).classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Login attempt:', { email, password });

        // Demo credentials
        if (email === 'admin' && password === '111111') {
            console.log('Admin login successful');
            this.login({
                name: 'Администратор',
                email: 'admin@vetclinic.ru',
                phone: '+7 (4742) 000-000',
                role: 'admin'
            });
        } else {
            // Regular user login (simulated)
            const users = JSON.parse(localStorage.getItem('vetUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('User login successful');
                this.login(user);
            } else {
                console.log('Login failed');
                this.showNotification('Неверный логин или пароль', 'error');
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            phone: document.getElementById('registerPhone').value,
            role: 'user'
        };

        // Save user to localStorage
        const users = JSON.parse(localStorage.getItem('vetUsers')) || [];
        
        // Check if user already exists
        if (users.find(u => u.email === formData.email)) {
            this.showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }

        users.push(formData);
        localStorage.setItem('vetUsers', JSON.stringify(users));
        
        this.login(formData);
    }

    login(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        localStorage.setItem('vetCurrentUser', JSON.stringify(user));
        
        this.closeModal(document.getElementById('authModal'));
        this.updateAuthUI();
        this.showNotification(`Добро пожаловать, ${user.name}!`, 'success');

        // Update admin panel if user is admin
        if (user.role === 'admin') {
            console.log('User is admin, showing admin panel');
            setTimeout(() => {
                if (window.adminSystem) {
                    window.adminSystem.showAdminPanel();
                } else {
                    console.error('Admin system not initialized');
                }
            }, 100);
        } else {
            console.log('User is not admin');
        }
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('vetCurrentUser');
        
        this.updateAuthUI();
        this.showNotification('Вы вышли из системы', 'info');

        // Hide admin panel and user profile
        if (window.adminSystem) {
            window.adminSystem.hideAdminPanel();
        }
        this.hideUserProfile();
    }

    checkExistingAuth() {
        const savedUser = localStorage.getItem('vetCurrentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isLoggedIn = true;
                
                console.log('Found existing user:', this.currentUser);
                
                // Show admin panel if user is admin
                if (this.currentUser.role === 'admin') {
                    console.log('Existing user is admin');
                    setTimeout(() => {
                        if (window.adminSystem) {
                            window.adminSystem.showAdminPanel();
                        }
                    }, 500);
                }
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('vetCurrentUser');
            }
        }
    }

    updateAuthUI() {
        const authBtn = document.getElementById('authBtn');
        if (!authBtn) return;

        if (this.isLoggedIn) {
            authBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${this.currentUser.name}</span>
            `;
            
            // Show admin link if user is admin
            const adminLink = document.querySelector('.admin-link');
            if (adminLink && this.currentUser.role === 'admin') {
                adminLink.style.display = 'block';
            } else {
                // Show user profile link for regular users
                this.createUserProfileLink();
            }
        } else {
            authBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Войти</span>
            `;
            
            // Hide admin and profile links
            const adminLink = document.querySelector('.admin-link');
            if (adminLink) {
                adminLink.style.display = 'none';
            }
            this.hideUserProfile();
        }
    }

    createUserProfileLink() {
        let profileLink = document.querySelector('.profile-link');
        if (!profileLink) {
            profileLink = document.createElement('a');
            profileLink.href = '#profile';
            profileLink.className = 'nav-link profile-link';
            profileLink.innerHTML = '<i class="fas fa-user-circle"></i> Мой профиль';
            
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.appendChild(profileLink);
            }
        }
        profileLink.style.display = 'block';
        
        // Add click event
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showUserProfile();
        });
    }

    hideUserProfile() {
        const profileLink = document.querySelector('.profile-link');
        if (profileLink) {
            profileLink.style.display = 'none';
        }
        
        const profileSection = document.getElementById('userProfile');
        if (profileSection) {
            profileSection.style.display = 'none';
        }
    }

    showUserProfile() {
        // Create or show user profile section
        let profileSection = document.getElementById('userProfile');
        if (!profileSection) {
            this.createUserProfileSection();
            profileSection = document.getElementById('userProfile');
        }
        
        if (profileSection) {
            profileSection.style.display = 'block';
            this.loadUserAppointments();
            
            // Scroll to profile section
            setTimeout(() => {
                profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }

    createUserProfileSection() {
        const profileHTML = `
            <section id="userProfile" class="user-profile" style="display: none;">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Мой профиль</h2>
                        <p class="section-subtitle">Управление вашими записями на прием</p>
                    </div>
                    
                    <div class="profile-content">
                        <div class="user-info-card">
                            <h3>Личная информация</h3>
                            <div class="user-details">
                                <div class="detail">
                                    <strong>ФИО:</strong> <span id="userFullName">${this.currentUser.name}</span>
                                </div>
                                <div class="detail">
                                    <strong>Email:</strong> <span id="userEmail">${this.currentUser.email}</span>
                                </div>
                                <div class="detail">
                                    <strong>Телефон:</strong> <span id="userPhone">${this.currentUser.phone}</span>
                                </div>
                            </div>
                            <button class="btn btn-outline btn-sm" onclick="window.authSystem.logout()">
                                <i class="fas fa-sign-out-alt"></i> Выйти
                            </button>
                        </div>
                        
                        <div class="user-appointments">
                            <div class="appointments-tabs">
                                <button class="appointment-tab active" data-tab="upcoming">Предстоящие приемы</button>
                                <button class="appointment-tab" data-tab="completed">Завершенные приемы</button>
                            </div>
                            
                            <div class="appointments-content">
                                <div id="upcomingAppointments" class="appointment-list active">
                                    <!-- Upcoming appointments will be loaded here -->
                                </div>
                                <div id="completedAppointments" class="appointment-list">
                                    <!-- Completed appointments will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert after contacts section
        const contactsSection = document.querySelector('#contacts');
        if (contactsSection) {
            contactsSection.insertAdjacentHTML('afterend', profileHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', profileHTML);
        }

        // Add tab event listeners
        document.querySelectorAll('.appointment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.appointment-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.appointment-list').forEach(l => l.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab + 'Appointments').classList.add('active');
            });
        });
    }

    loadUserAppointments() {
        if (!this.currentUser) return;

        const userAppointments = window.appointmentsSystem?.getAppointmentsByUser(this.currentUser.email) || [];
        
        // Upcoming appointments (pending, confirmed)
        const upcomingAppointments = userAppointments.filter(apt => 
            apt.status === 'pending' || apt.status === 'confirmed'
        ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
        
        // Completed appointments (completed, cancelled)
        const completedAppointments = userAppointments.filter(apt => 
            apt.status === 'completed' || apt.status === 'cancelled'
        ).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

        this.renderAppointmentsList('upcomingAppointments', upcomingAppointments, 'У вас нет предстоящих приемов');
        this.renderAppointmentsList('completedAppointments', completedAppointments, 'У вас нет завершенных приемов');
    }

    renderAppointmentsList(containerId, appointments, emptyMessage) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (appointments.length === 0) {
            container.innerHTML = `<p class="no-appointments">${emptyMessage}</p>`;
            return;
        }

        container.innerHTML = appointments.map(appointment => {
            const doctor = window.doctorsData?.getDoctorById(appointment.doctorId);
            const doctorName = doctor ? doctor.name : 'Неизвестный врач';
            const servicePrice = this.getServicePrice(appointment.service);
            const statusBadge = this.getStatusBadge(appointment.status);
            const isUpcoming = appointment.status === 'pending' || appointment.status === 'confirmed';

            return `
                <div class="user-appointment-item ${isUpcoming ? 'upcoming' : 'completed'}">
                    <div class="appointment-main-info">
                        <div class="pet-info">
                            <h4>${appointment.petName}</h4>
                            <span class="pet-type">${this.getPetTypeName(appointment.petType)}</span>
                        </div>
                        <div class="appointment-meta">
                            <div class="date-time">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDateTime(appointment.date, appointment.time)}
                            </div>
                            <div class="doctor">
                                <i class="fas fa-user-md"></i>
                                ${doctorName}
                            </div>
                            <div class="service">
                                <i class="fas fa-stethoscope"></i>
                                ${this.getServiceName(appointment.service)}
                            </div>
                        </div>
                    </div>
                    <div class="appointment-side-info">
                        <div class="price">${servicePrice.toLocaleString()} ₽</div>
                        ${statusBadge}
                        ${appointment.notes ? `
                            <div class="notes">
                                <strong>Примечания:</strong> ${appointment.notes}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    getServicePrice(service) {
        const prices = {
            consultation: 800,
            vaccination: 1200,
            surgery: 4500,
            dentistry: 1500,
            diagnostics: 2000
        };
        return prices[service] || 0;
    }

    getPetTypeName(petType) {
        const types = {
            cat: 'Кот/Кошка',
            dog: 'Собака',
            bird: 'Птица',
            rodent: 'Грызун',
            other: 'Другое'
        };
        return types[petType] || petType;
    }

    getServiceName(serviceKey) {
        const services = {
            consultation: 'Консультация',
            vaccination: 'Вакцинация',
            surgery: 'Хирургия',
            dentistry: 'Стоматология',
            diagnostics: 'Диагностика'
        };
        return services[serviceKey] || serviceKey;
    }

    getStatusBadge(status) {
        const statusConfig = {
            pending: { class: 'status-pending', text: 'Ожидание', icon: 'fas fa-clock' },
            confirmed: { class: 'status-confirmed', text: 'Подтвержден', icon: 'fas fa-check-circle' },
            completed: { class: 'status-completed', text: 'Завершен', icon: 'fas fa-check-double' },
            cancelled: { class: 'status-cancelled', text: 'Отменен', icon: 'fas fa-times-circle' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return `
            <div class="status-badge ${config.class}">
                <i class="${config.icon}"></i>
                ${config.text}
            </div>
        `;
    }

    formatDateTime(date, time) {
        const dateObj = new Date(date);
        return `${dateObj.toLocaleDateString('ru-RU')} в ${time}`;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                    border-left: 4px solid #4f46e5;
                }
                .notification-success { border-left-color: #10b981; }
                .notification-error { border-left-color: #ef4444; }
                .notification-warning { border-left-color: #f59e0b; }
                .notification-info { border-left-color: #4f46e5; }
                .notification-content {
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: 10px;
                    color: #6b7280;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}