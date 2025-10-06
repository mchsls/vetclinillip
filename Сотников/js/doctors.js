// Doctors data and management
class DoctorsData {
    constructor() {
        this.doctors = this.getDoctorsData();
        this.initializeDoctors();
    }

    getDoctorsData() {
        // Try to load doctors from localStorage first
        const savedDoctors = localStorage.getItem('vetClinicDoctors');
        if (savedDoctors) {
            try {
                const doctors = JSON.parse(savedDoctors);
                if (doctors && doctors.length > 0) {
                    return doctors;
                }
            } catch (error) {
                console.error('Error loading saved doctors:', error);
            }
        }

        // Default doctors data with local image paths
        return [
            {
                id: 'doc_1',
                name: 'Иванова Анна Сергеевна',
                specialization: 'Хирург, терапевт',
                experience: 12,
                education: 'Московская государственная академия ветеринарной медицины',
                bio: 'Специализируется на сложных хирургических операциях и лечении внутренних болезней. Прошла стажировку в ведущих ветеринарных клиниках Европы. Более 12 лет успешной практики.',
                skills: ['Хирургия', 'Терапия', 'Эндоскопия', 'УЗИ-диагностика', 'Онкология'],
                photo: 'Иванова.webp',
                phone: '+7 (4742) 123-001',
                email: 'ivanova@vetclinic.ru',
                schedule: 'Пн-Пт: 9:00-18:00',
                status: 'active'
            },
            {
                id: 'doc_2',
                name: 'Петров Дмитрий Владимирович',
                specialization: 'Стоматолог, хирург',
                experience: 8,
                education: 'Санкт-Петербургская государственная академия ветеринарной медицины',
                bio: 'Эксперт в области ветеринарной стоматологии. Проводит сложные стоматологические операции и протезирование. Автор научных работ по стоматологии мелких животных.',
                skills: ['Стоматология', 'Хирургия', 'Ортодонтия', 'Чистка зубов', 'Имплантация'],
                photo: 'Петров.webp',
                phone: '+7 (4742) 123-002',
                email: 'petrov@vetclinic.ru',
                schedule: 'Вт-Сб: 10:00-19:00',
                status: 'active'
            },
            {
                id: 'doc_3',
                name: 'Сидорова Елена Михайловна',
                specialization: 'Дерматолог, аллерголог',
                experience: 10,
                education: 'Казанская государственная академия ветеринарной медицины',
                bio: 'Специалист по кожным заболеваниям и аллергическим реакциям у животных. Разрабатывает индивидуальные схемы лечения. Постоянный участник международных конференций по дерматологии.',
                skills: ['Дерматология', 'Аллергология', 'Лабораторная диагностика', 'Микроскопия', 'Иммунология'],
                photo: 'Грейнджер.webp',
                phone: '+7 (4742) 123-003',
                email: 'sidorova@vetclinic.ru',
                schedule: 'Пн-Ср-Пт: 8:00-17:00',
                status: 'active'
            },
            {
                id: 'doc_4',
                name: 'Козлов Алексей Николаевич',
                specialization: 'Кардиолог, УЗИ-специалист',
                experience: 15,
                education: 'Новосибирский государственный аграрный университет',
                bio: 'Ведущий специалист по кардиологии и ультразвуковой диагностике. Имеет публикации в международных научных журналах. Специализируется на диагностике и лечении сердечных заболеваний у животных.',
                skills: ['Кардиология', 'УЗИ-диагностика', 'Эхокардиография', 'Функциональная диагностика', 'ЭКГ'],
                photo: 'Северус.webp',
                phone: '+7 (4742) 123-004',
                email: 'kozlov@vetclinic.ru',
                schedule: 'Вт-Чт-Сб: 9:00-18:00',
                status: 'active'
            },
            {
                id: 'doc_5',
                name: 'Орлов Максим Викторович',
                specialization: 'Невролог, реабилитолог',
                experience: 9,
                education: 'Московская государственная академия ветеринарной медицины и биотехнологии',
                bio: 'Специалист по неврологическим заболеваниям у животных. Проводит диагностику и лечение эпилепсии, нарушений координации, парезов и параличей. Разрабатывает индивидуальные программы реабилитации после неврологических травм и операций.',
                skills: ['Неврология', 'Реабилитация', 'Физиотерапия', 'ЭЭГ', 'Мануальная терапия', 'Иглорефлексотерапия'],
                photo: 'Орлов.jpg',
                phone: '+7 (4742) 123-005',
                email: 'orlov@vetclinic.ru',
                schedule: 'Пн-Вт-Чт-Пт: 10:00-19:00',
                status: 'active'
            },
            {
                id: 'doc_6',
                name: 'Волков Сергей Александрович',
                specialization: 'Офтальмолог, микрохирург',
                experience: 11,
                education: 'Санкт-Петербургская государственная академия ветеринарной медицины',
                bio: 'Эксперт в области ветеринарной офтальмологии. Проводит сложные микрохирургические операции на глазах: катаракта, глаукома, травмы роговицы. Владеет современными методами диагностики заболеваний глаз у животных.',
                skills: ['Офтальмология', 'Микрохирургия', 'Катаракта', 'Глаукома', 'Диагностика зрения', 'Лазерная терапия'],
                photo: 'волков.jpg',
                phone: '+7 (4742) 123-006',
                email: 'volkov@vetclinic.ru',
                schedule: 'Вт-Ср-Пт-Сб: 9:00-18:00',
                status: 'active'
            }
        ];
    }

    initializeDoctors() {
        this.displayDoctors();
        this.setupDoctorEventListeners();
    }

    displayDoctors() {
        const grid = document.querySelector('.doctors-grid');
        if (!grid) {
            console.error('Doctors grid not found');
            return;
        }

        const isAdmin = window.authSystem?.currentUser?.role === 'admin';

        grid.innerHTML = this.doctors.map(doctor => `
            <div class="doctor-card animate-scale" data-id="${doctor.id}">
                <div class="doctor-photo">
                    <img src="${doctor.photo}" alt="${doctor.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EwYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Qp9C10YDQvdC+0YHRjDwvdGV4dD48L3N2Zz4='; this.alt='Фото врача'">
                    <div class="doctor-status ${doctor.status}"></div>
                    ${isAdmin ? `
                        <div class="photo-upload-overlay">
                            <button class="btn btn-sm change-photo-btn" data-id="${doctor.id}">
                                <i class="fas fa-camera"></i> Сменить фото
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="doctor-specialization">${doctor.specialization}</p>
                    <p class="doctor-experience">Опыт работы: ${doctor.experience} лет</p>
                    <div class="doctor-skills">
                        ${doctor.skills.slice(0, 3).map(skill => 
                            `<span class="skill-tag">${skill}</span>`
                        ).join('')}
                    </div>
                    <div class="doctor-actions">
                        <button class="btn btn-outline btn-sm view-doctor-btn" data-id="${doctor.id}">
                            <i class="fas fa-eye"></i>
                            Подробнее
                        </button>
                        <button class="btn btn-primary btn-sm appointment-doctor-btn" data-id="${doctor.id}">
                            <i class="fas fa-calendar-check"></i>
                            Записаться
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log('Doctors displayed successfully');

        // Setup photo upload buttons for admin
        if (isAdmin) {
            this.setupPhotoUploadButtons();
        }
    }

    setupPhotoUploadButtons() {
        document.querySelectorAll('.change-photo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openPhotoUploadModal(btn.dataset.id);
            });
        });
    }

    openPhotoUploadModal(doctorId) {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor) return;

        // Create photo upload modal
        const modalHTML = `
            <div id="photoUploadModal" class="modal">
                <div class="modal-content photo-upload-modal">
                    <button class="close">&times;</button>
                    <h2>Смена фото врача</h2>
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <p>${doctor.specialization}</p>
                    </div>
                    
                    <div class="current-photo">
                        <h4>Текущее фото:</h4>
                        <img src="${doctor.photo}" alt="${doctor.name}" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EwYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Qp9C10YDQvdC+0YHRjDwvdGV4dD48L3N2Zz4='; this.alt='Фото врача'">
                    </div>
                    
                    <div class="upload-options">
                        <div class="upload-option">
                            <h4>Способ 1: Загрузить файл</h4>
                            <input type="file" id="photoFileInput" accept="image/*" class="file-input">
                            <label for="photoFileInput" class="btn btn-outline">
                                <i class="fas fa-upload"></i> Выбрать файл
                            </label>
                        </div>
                        
                        <div class="upload-option">
                            <h4>Способ 2: Указать URL</h4>
                            <div class="url-input-group">
                                <input type="url" id="photoUrlInput" 
                                       placeholder="https://example.com/photo.jpg"
                                       class="url-input">
                                <button class="btn btn-primary" id="useUrlBtn">
                                    Использовать URL
                                </button>
                            </div>
                        </div>
                        
                        <div class="upload-option">
                            <h4>Способ 3: Использовать локальный путь</h4>
                            <div class="path-input-group">
                                <input type="text" id="photoPathInput" 
                                       value="${doctor.photo}"
                                       placeholder="images/doctors/filename.jpg"
                                       class="path-input">
                                <button class="btn btn-primary" id="usePathBtn">
                                    Использовать путь
                                </button>
                            </div>
                            <small class="path-hint">
                                Путь относительно папки сайта. Например: images/doctors/doctor1.jpg
                            </small>
                        </div>
                    </div>
                    
                    <div class="preview-section" id="previewSection" style="display: none;">
                        <h4>Предпросмотр:</h4>
                        <div class="photo-preview" id="photoPreview"></div>
                    </div>
                    
                    <div class="upload-actions">
                        <button class="btn btn-primary" id="savePhotoBtn" disabled>
                            <i class="fas fa-save"></i> Сохранить фото
                        </button>
                        <button class="btn btn-outline" id="cancelUploadBtn">
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('photoUploadModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('photoUploadModal');
        modal.style.display = 'flex';

        this.setupPhotoUploadModalEvents(doctorId);
    }

    setupPhotoUploadModalEvents(doctorId) {
        const modal = document.getElementById('photoUploadModal');
        const fileInput = document.getElementById('photoFileInput');
        const urlInput = document.getElementById('photoUrlInput');
        const pathInput = document.getElementById('photoPathInput');
        const useUrlBtn = document.getElementById('useUrlBtn');
        const usePathBtn = document.getElementById('usePathBtn');
        const saveBtn = document.getElementById('savePhotoBtn');
        const cancelBtn = document.getElementById('cancelUploadBtn');
        const previewSection = document.getElementById('previewSection');
        const photoPreview = document.getElementById('photoPreview');

        let selectedPhoto = null;
        let selectedType = null; // 'file', 'url', 'path'

        // File input handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    selectedPhoto = URL.createObjectURL(file);
                    selectedType = 'file';
                    showPreview(selectedPhoto);
                    saveBtn.disabled = false;
                } else {
                    alert('Пожалуйста, выберите файл изображения (JPG, PNG, etc.)');
                    fileInput.value = '';
                }
            }
        });

        // URL handler
        useUrlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                selectedPhoto = url;
                selectedType = 'url';
                showPreview(url);
                saveBtn.disabled = false;
            } else {
                alert('Пожалуйста, введите URL изображения');
            }
        });

        // Path handler
        usePathBtn.addEventListener('click', () => {
            const path = pathInput.value.trim();
            if (path) {
                selectedPhoto = path;
                selectedType = 'path';
                showPreview(path);
                saveBtn.disabled = false;
            } else {
                alert('Пожалуйста, введите путь к файлу');
            }
        });

        // Save handler
        saveBtn.addEventListener('click', () => {
            if (selectedPhoto && selectedType) {
                this.updateDoctorPhoto(doctorId, selectedPhoto, selectedType);
                modal.style.display = 'none';
            }
        });

        // Cancel handler
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        function showPreview(src) {
            photoPreview.innerHTML = `
                <img src="${src}" alt="Предпросмотр" 
                     onerror="this.style.display='none'; document.getElementById('previewError').style.display='block';">
                <div id="previewError" style="display: none; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                    Не удалось загрузить изображение
                </div>
            `;
            previewSection.style.display = 'block';
        }
    }

    updateDoctorPhoto(doctorId, photoUrl, type) {
        const doctorIndex = this.doctors.findIndex(d => d.id === doctorId);
        if (doctorIndex === -1) return;

        // If it's a file, we need to handle it differently
        if (type === 'file') {
            // For files, we'll use the object URL temporarily
            // In a real application, you would upload the file to a server
            this.doctors[doctorIndex].photo = photoUrl;
        } else {
            this.doctors[doctorIndex].photo = photoUrl;
        }

        // Save to localStorage
        this.saveDoctorsToStorage();

        // Update display
        this.displayDoctors();

        // Show success message
        if (window.authSystem) {
            window.authSystem.showNotification('Фото врача успешно обновлено!', 'success');
        }
    }

    saveDoctorsToStorage() {
        localStorage.setItem('vetClinicDoctors', JSON.stringify(this.doctors));
    }

    setupDoctorEventListeners() {
        // Use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            // View doctor details
            if (e.target.closest('.view-doctor-btn')) {
                const btn = e.target.closest('.view-doctor-btn');
                this.showDoctorDetails(btn.dataset.id);
            }
            
            // Book appointment
            if (e.target.closest('.appointment-doctor-btn')) {
                const btn = e.target.closest('.appointment-doctor-btn');
                this.handleDoctorAppointment(btn.dataset.id);
            }
            
            // Click on card
            if (e.target.closest('.doctor-card') && !e.target.closest('button')) {
                const card = e.target.closest('.doctor-card');
                this.showDoctorDetails(card.dataset.id);
            }
        });
    }

    handleDoctorAppointment(doctorId) {
        if (window.appointmentsSystem) {
            window.appointmentsSystem.openAppointmentModal();
            setTimeout(() => {
                const doctorSelect = document.getElementById('appointmentDoctor');
                if (doctorSelect) {
                    doctorSelect.value = doctorId;
                }
            }, 100);
        } else {
            alert('Система записи недоступна. Пожалуйста, обновите страницу.');
        }
    }

    showDoctorDetails(doctorId) {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor) return;

        const modal = document.getElementById('doctorModal');
        const content = document.getElementById('doctorDetails');

        if (!modal || !content) {
            console.error('Doctor modal elements not found');
            return;
        }

        const isAdmin = window.authSystem?.currentUser?.role === 'admin';

        content.innerHTML = `
            <div class="doctor-detail-header">
                <div class="doctor-detail-photo">
                    <img src="${doctor.photo}" alt="${doctor.name}"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EwYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Qp9C10YDQvdC+0YHRjDwvdGV4dD48L3N2Zz4='; this.alt='Фото врача'">
                    ${isAdmin ? `
                        <button class="btn btn-outline btn-sm change-detail-photo-btn" data-id="${doctor.id}">
                            <i class="fas fa-camera"></i> Сменить фото
                        </button>
                    ` : ''}
                </div>
                <div class="doctor-detail-info">
                    <h2>${doctor.name}</h2>
                    <p class="specialization">${doctor.specialization}</p>
                    <div class="doctor-stats">
                        <div class="stat">
                            <i class="fas fa-briefcase"></i>
                            <span>${doctor.experience} лет опыта</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-phone"></i>
                            <span>${doctor.phone}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-envelope"></i>
                            <span>${doctor.email}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>${doctor.schedule}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="doctor-detail-content">
                <div class="detail-section">
                    <h3>Образование и квалификация</h3>
                    <p>${doctor.education}</p>
                </div>
                
                <div class="detail-section">
                    <h3>О специалисте</h3>
                    <p>${doctor.bio}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Навыки и специализации</h3>
                    <div class="skills-grid">
                        ${doctor.skills.map(skill => 
                            `<span class="skill-tag large">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="doctor-detail-actions">
                <button class="btn btn-primary" id="detailAppointmentBtn" data-id="${doctor.id}">
                    <i class="fas fa-calendar-check"></i>
                    Записаться к врачу
                </button>
            </div>
        `;

        // Add event listener to the appointment button in details
        const appointmentBtn = content.querySelector('#detailAppointmentBtn');
        if (appointmentBtn) {
            appointmentBtn.addEventListener('click', () => {
                this.handleDoctorAppointment(doctor.id);
                modal.style.display = 'none';
            });
        }

        // Add event listener for change photo button in details
        const changePhotoBtn = content.querySelector('.change-detail-photo-btn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openPhotoUploadModal(doctor.id);
                modal.style.display = 'none';
            });
        }

        modal.style.display = 'flex';
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    getDoctorById(id) {
        return this.doctors.find(doctor => doctor.id === id);
    }

    getDoctors() {
        return this.doctors;
    }

    getActiveDoctors() {
        return this.doctors.filter(doctor => doctor.status === 'active');
    }
}