// Admin panel functionality
class AdminSystem {
    constructor() {
        this.initialized = false;
        this.initializeAdminSystem();
    }

    initializeAdminSystem() {
        if (this.initialized) return;
        
        console.log('Initializing Admin System...');
        
        this.setupEventListeners();
        this.initialized = true;
        
        // Check if admin is already logged in
        const savedUser = localStorage.getItem('vetCurrentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user.role === 'admin') {
                    console.log('Admin user found on init');
                    setTimeout(() => {
                        this.showAdminPanel();
                    }, 100);
                }
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        }
    }

    setupEventListeners() {
        // Report generation
        const generateReportBtn = document.getElementById('generateReportBtn');
        const refreshStatsBtn = document.getElementById('refreshStatsBtn');
        const printReportBtn = document.getElementById('printReportBtn');
        const exportReportBtn = document.getElementById('exportReportBtn');

        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }
        if (refreshStatsBtn) {
            refreshStatsBtn.addEventListener('click', () => this.updateStats());
        }
        if (printReportBtn) {
            printReportBtn.addEventListener('click', () => this.printReport());
        }
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportReport());
        }

        console.log('Admin event listeners setup complete');
    }

    showAdminPanel() {
        console.log('Showing admin panel...');
        
        const panel = document.getElementById('adminPanel');
        const adminLink = document.querySelector('.admin-link');
        
        if (panel) {
            panel.style.display = 'block';
            console.log('Admin panel displayed');
            
            // Load appointments management
            this.loadAppointmentsManagement();
        } else {
            console.error('Admin panel element not found!');
        }
        
        if (adminLink) {
            adminLink.style.display = 'block';
            console.log('Admin link displayed');
        }
        
        this.updateStats();
        this.loadRecentReports();
        
        // Scroll to admin panel
        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    hideAdminPanel() {
        console.log('Hiding admin panel...');
        
        const panel = document.getElementById('adminPanel');
        const adminLink = document.querySelector('.admin-link');
        
        if (panel) {
            panel.style.display = 'none';
        }
        
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }

    loadAppointmentsManagement() {
        const adminPanel = document.getElementById('adminPanel');
        if (!adminPanel) return;

        // Check if appointments management already exists
        if (adminPanel.querySelector('.appointments-management')) return;

        const appointmentsManagementHTML = `
            <div class="appointments-management">
                <h3>Управление записями на прием</h3>
                <div class="appointments-filters">
                    <select id="appointmentFilter" class="filter-select">
                        <option value="all">Все записи</option>
                        <option value="pending">Ожидающие</option>
                        <option value="confirmed">Подтвержденные</option>
                        <option value="completed">Завершенные</option>
                        <option value="cancelled">Отмененные</option>
                    </select>
                    <button class="btn btn-outline btn-sm" id="refreshAppointmentsBtn">
                        <i class="fas fa-sync-alt"></i> Обновить
                    </button>
                </div>
                <div class="appointments-list" id="adminAppointmentsList">
                    <!-- Appointments will be loaded here -->
                </div>
            </div>
        `;

        // Insert after reports section
        const reportsSection = adminPanel.querySelector('.reports-section');
        if (reportsSection) {
            reportsSection.insertAdjacentHTML('beforebegin', appointmentsManagementHTML);
        } else {
            adminPanel.insertAdjacentHTML('beforeend', appointmentsManagementHTML);
        }

        // Add event listeners for new elements
        document.getElementById('appointmentFilter')?.addEventListener('change', () => this.loadAppointmentsList());
        document.getElementById('refreshAppointmentsBtn')?.addEventListener('click', () => this.loadAppointmentsList());

        // Load initial appointments list
        this.loadAppointmentsList();
    }

    loadAppointmentsList() {
        const appointmentsList = document.getElementById('adminAppointmentsList');
        if (!appointmentsList) return;

        const filter = document.getElementById('appointmentFilter')?.value || 'all';
        const allAppointments = window.appointmentsSystem?.getAppointments() || [];
        
        let filteredAppointments = allAppointments;
        if (filter !== 'all') {
            filteredAppointments = allAppointments.filter(apt => apt.status === filter);
        }

        // Sort by date (newest first)
        filteredAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filteredAppointments.length === 0) {
            appointmentsList.innerHTML = '<p class="no-appointments">Записей не найдено</p>';
            return;
        }

        appointmentsList.innerHTML = filteredAppointments.map(appointment => {
            const doctor = window.doctorsData?.getDoctorById(appointment.doctorId);
            const doctorName = doctor ? doctor.name : 'Неизвестный врач';
            const servicePrice = this.getServicePrice(appointment.service);
            const statusBadge = this.getStatusBadge(appointment.status);
            const canComplete = appointment.status === 'confirmed' || appointment.status === 'pending';
            const canDelete = appointment.status !== 'completed' && appointment.status !== 'cancelled';

            return `
                <div class="appointment-item" data-id="${appointment.id}">
                    <div class="appointment-header">
                        <div class="appointment-info">
                            <h4>${appointment.petName} (${this.getPetTypeName(appointment.petType)})</h4>
                            <span class="appointment-date">${this.formatDateTime(appointment.date, appointment.time)}</span>
                        </div>
                        <div class="appointment-actions">
                            ${canComplete ? `
                                <button class="btn btn-success btn-sm complete-appointment-btn" data-id="${appointment.id}">
                                    <i class="fas fa-check"></i> Завершить
                                </button>
                            ` : ''}
                            ${canDelete ? `
                                <button class="btn btn-danger btn-sm delete-appointment-btn" data-id="${appointment.id}">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            ` : ''}
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="appointment-details">
                        <div class="detail">
                            <strong>Врач:</strong> ${doctorName}
                        </div>
                        <div class="detail">
                            <strong>Услуга:</strong> ${this.getServiceName(appointment.service)}
                        </div>
                        <div class="detail">
                            <strong>Стоимость:</strong> ${servicePrice.toLocaleString()} ₽
                        </div>
                        ${appointment.notes ? `
                            <div class="detail">
                                <strong>Примечания:</strong> ${appointment.notes}
                            </div>
                        ` : ''}
                        <div class="detail">
                            <strong>Клиент:</strong> ${appointment.userId} (${appointment.userPhone || 'телефон не указан'})
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to action buttons
        appointmentsList.querySelectorAll('.complete-appointment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.completeAppointment(btn.dataset.id);
            });
        });

        appointmentsList.querySelectorAll('.delete-appointment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteAppointment(btn.dataset.id);
            });
        });
    }

    completeAppointment(appointmentId) {
        if (!confirm('Вы уверены, что хотите завершить этот прием?')) return;

        const appointments = window.appointmentsSystem?.getAppointments() || [];
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'completed';
            localStorage.setItem('vetAppointments', JSON.stringify(appointments));
            
            this.showNotification('Прием успешно завершен', 'success');
            this.loadAppointmentsList();
            this.updateStats();
        }
    }

    deleteAppointment(appointmentId) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

        const appointments = window.appointmentsSystem?.getAppointments() || [];
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('vetAppointments', JSON.stringify(appointments));
            
            this.showNotification('Запись успешно отменена', 'success');
            this.loadAppointmentsList();
            this.updateStats();
        }
    }

    getStatusBadge(status) {
        const statusConfig = {
            pending: { class: 'status-pending', text: 'Ожидание' },
            confirmed: { class: 'status-confirmed', text: 'Подтвержден' },
            completed: { class: 'status-completed', text: 'Завершен' },
            cancelled: { class: 'status-cancelled', text: 'Отменен' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return `<span class="status-badge ${config.class}">${config.text}</span>`;
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

    formatDateTime(date, time) {
        const dateObj = new Date(date);
        return `${dateObj.toLocaleDateString('ru-RU')} в ${time}`;
    }

    updateStats() {
        console.log('Updating admin stats...');
        
        if (!window.authSystem || !window.authSystem.currentUser || window.authSystem.currentUser.role !== 'admin') {
            console.log('Cannot update stats: user not admin');
            return;
        }

        const appointments = window.appointmentsSystem?.getAppointments() || [];
        const doctors = window.doctorsData?.getActiveDoctors() || [];
        const stats = window.appointmentsSystem?.getAppointmentsStats() || { revenue: 0 };

        console.log('Stats calculated:', { 
            patients: this.getUniquePatientsCount(),
            appointments: appointments.length,
            revenue: stats.revenue,
            doctors: doctors.length
        });

        const totalPatientsEl = document.getElementById('adminTotalPatients');
        const totalAppointmentsEl = document.getElementById('adminTotalAppointments');
        const totalRevenueEl = document.getElementById('adminTotalRevenue');
        const totalDoctorsEl = document.getElementById('adminTotalDoctors');

        if (totalPatientsEl) totalPatientsEl.textContent = this.getUniquePatientsCount();
        if (totalAppointmentsEl) totalAppointmentsEl.textContent = appointments.length;
        if (totalRevenueEl) totalRevenueEl.textContent = stats.revenue.toLocaleString() + ' ₽';
        if (totalDoctorsEl) totalDoctorsEl.textContent = doctors.length;
    }

    getUniquePatientsCount() {
        const appointments = window.appointmentsSystem?.getAppointments() || [];
        const uniquePets = new Set();
        
        appointments.forEach(apt => {
            uniquePets.add(apt.petName + apt.userId);
        });
        
        return uniquePets.size;
    }

    generateReport() {
        console.log('Generating report...');
        
        const startDate = document.getElementById('reportDateFrom')?.value;
        const endDate = document.getElementById('reportDateTo')?.value;
        
        const stats = window.appointmentsSystem?.getAppointmentsStats(startDate, endDate) || {
            total: 0,
            byStatus: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
            byService: {},
            byDoctor: {},
            revenue: 0
        };
        
        const doctors = window.doctorsData?.getDoctors() || [];
        
        this.displayReport(stats, doctors, startDate, endDate);
        
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
            reportModal.style.display = 'flex';
            console.log('Report modal displayed');
        }
    }

    displayReport(stats, doctors, startDate, endDate) {
        const content = document.getElementById('reportContent');
        if (!content) {
            console.error('Report content element not found!');
            return;
        }
        
        const periodText = startDate && endDate ? 
            `за период с ${this.formatDate(startDate)} по ${this.formatDate(endDate)}` : 
            'за все время';
        
        content.innerHTML = `
            <div class="report-header">
                <h3>Отчет по работе клиники</h3>
                <p>${periodText}</p>
                <div class="report-summary">
                    <div class="summary-item">
                        <span class="label">Всего приемов:</span>
                        <span class="value">${stats.total}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Общий доход:</span>
                        <span class="value">${stats.revenue.toLocaleString()} ₽</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Уникальных пациентов:</span>
                        <span class="value">${this.getUniquePatientsCount()}</span>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h4>Статистика по статусам приемов</h4>
                <div class="status-stats">
                    <div class="status-item confirmed">
                        <span class="status-label">Подтвержденные</span>
                        <span class="status-count">${stats.byStatus.confirmed}</span>
                    </div>
                    <div class="status-item pending">
                        <span class="status-label">Ожидающие</span>
                        <span class="status-count">${stats.byStatus.pending}</span>
                    </div>
                    <div class="status-item completed">
                        <span class="status-label">Завершенные</span>
                        <span class="status-count">${stats.byStatus.completed}</span>
                    </div>
                    <div class="status-item cancelled">
                        <span class="status-label">Отмененные</span>
                        <span class="status-count">${stats.byStatus.cancelled}</span>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h4>Распределение по услугам</h4>
                <div class="service-stats">
                    ${Object.entries(stats.byService).length > 0 ? 
                        Object.entries(stats.byService).map(([service, count]) => `
                            <div class="service-item">
                                <span class="service-name">${this.getServiceName(service)}</span>
                                <span class="service-count">${count}</span>
                            </div>
                        `).join('') : 
                        '<p>Нет данных о услугах</p>'
                    }
                </div>
            </div>
            
            <div class="report-section">
                <h4>Загрузка врачей</h4>
                <div class="doctors-stats">
                    ${Object.entries(stats.byDoctor).length > 0 ? 
                        Object.entries(stats.byDoctor).map(([doctor, count]) => `
                            <div class="doctor-item">
                                <span class="doctor-name">${doctor}</span>
                                <span class="doctor-count">${count} приемов</span>
                            </div>
                        `).join('') : 
                        '<p>Нет данных о врачах</p>'
                    }
                </div>
            </div>
            
            <div class="report-footer">
                <p>Отчет сгенерирован: ${new Date().toLocaleDateString('ru-RU')}</p>
                <p>Пользователь: ${window.authSystem.currentUser.name}</p>
            </div>
        `;
        
        // Save report to history
        this.saveReportToHistory(stats, startDate, endDate);
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

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ru-RU');
    }

    saveReportToHistory(stats, startDate, endDate) {
        const reports = JSON.parse(localStorage.getItem('vetReports')) || [];
        const report = {
            id: 'REP_' + Date.now(),
            generatedAt: new Date().toISOString(),
            period: { startDate, endDate },
            stats: stats,
            generatedBy: window.authSystem.currentUser.name
        };
        
        reports.unshift(report);
        localStorage.setItem('vetReports', JSON.stringify(reports.slice(0, 10)));
        
        this.loadRecentReports();
    }

    loadRecentReports() {
        const reports = JSON.parse(localStorage.getItem('vetReports')) || [];
        const grid = document.getElementById('reportsGrid');
        
        if (!grid) return;
        
        grid.innerHTML = reports.slice(0, 3).map(report => `
            <div class="report-card">
                <div class="report-card-header">
                    <h4>Отчет от ${this.formatDate(report.generatedAt)}</h4>
                    <span class="report-period">
                        ${report.period.startDate ? this.formatDate(report.period.startDate) + ' - ' + this.formatDate(report.period.endDate) : 'Все время'}
                    </span>
                </div>
                <div class="report-card-stats">
                    <div class="stat">
                        <span class="number">${report.stats.total}</span>
                        <span class="label">Приемов</span>
                    </div>
                    <div class="stat">
                        <span class="number">${report.stats.revenue.toLocaleString()} ₽</span>
                        <span class="label">Доход</span>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.adminSystem.viewReport('${report.id}')">
                    Просмотреть
                </button>
            </div>
        `).join('') || '<p>Нет сгенерированных отчетов</p>';
    }

    viewReport(reportId) {
        const reports = JSON.parse(localStorage.getItem('vetReports')) || [];
        const report = reports.find(r => r.id === reportId);
        
        if (report) {
            this.displayReport(report.stats, window.doctorsData.getDoctors(), report.period.startDate, report.period.endDate);
            document.getElementById('reportModal').style.display = 'flex';
        }
    }

    printReport() {
        window.print();
    }

    exportReport() {
        this.showNotification('Функция экспорта в PDF будет доступна в ближайшее время', 'info');
    }

    showNotification(message, type) {
        if (window.authSystem) {
            window.authSystem.showNotification(message, type);
        }
    }
}