document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const openFormBtn = document.getElementById('open-form-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const formStatus = document.getElementById('form-status');
   
    // Элементы формы
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const organizationInput = document.getElementById('organization');
    const messageInput = document.getElementById('message');
    const policyCheckbox = document.getElementById('policy-agreement');
   
    // Ключи для LocalStorage
    const STORAGE_KEYS = {
        FULLNAME: 'feedback_fullname',
        EMAIL: 'feedback_email',
        PHONE: 'feedback_phone',
        ORGANIZATION: 'feedback_organization',
        MESSAGE: 'feedback_message',
        POLICY: 'feedback_policy'
    };
   
    // URL для отправки формы (замените на ваш URL от formcarry.com или slapform.com)
    // Для примера используем форму из formcarry.com (нужно заменить на реальный URL)
    const FORM_SUBMIT_URL = 'https://formcarry.com/s/ВАШ_ID_ФОРМЫ';
   
    // Флаг для отслеживания состояния модального окна
    let isModalOpen = false;
   
    // Инициализация
    function init() {
        loadFormDataFromStorage();
        setupEventListeners();
    }
   
    // Настройка обработчиков событий
    function setupEventListeners() {
        // Открытие формы
        openFormBtn.addEventListener('click', openModal);
       
        // Закрытие формы
        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
       
        // Закрытие при клике вне формы
        feedbackModal.addEventListener('click', function(event) {
            if (event.target === feedbackModal) {
                closeModal();
            }
        });
       
        // Отправка формы
        feedbackForm.addEventListener('submit', handleFormSubmit);
       
        // Сохранение данных формы при вводе
        fullnameInput.addEventListener('input', () => saveToLocalStorage(STORAGE_KEYS.FULLNAME, fullnameInput.value));
        emailInput.addEventListener('input', () => saveToLocalStorage(STORAGE_KEYS.EMAIL, emailInput.value));
        phoneInput.addEventListener('input', () => saveToLocalStorage(STORAGE_KEYS.PHONE, phoneInput.value));
        organizationInput.addEventListener('input', () => saveToLocalStorage(STORAGE_KEYS.ORGANIZATION, organizationInput.value));
        messageInput.addEventListener('input', () => saveToLocalStorage(STORAGE_KEYS.MESSAGE, messageInput.value));
        policyCheckbox.addEventListener('change', () => saveToLocalStorage(STORAGE_KEYS.POLICY, policyCheckbox.checked));
       
        // Обработка нажатия кнопки "Назад" в браузере
        window.addEventListener('popstate', function(event) {
            if (isModalOpen) {
                closeModal();
            }
        });
    }
   
    // Открытие модального окна
    function openModal() {
        feedbackModal.style.display = 'flex';
        isModalOpen = true;
       
        // Добавляем запись в историю браузера
        history.pushState({ modalOpen: true }, '', '#feedback-form');
       
        // Фокус на первом поле формы
        setTimeout(() => {
            fullnameInput.focus();
        }, 100);
    }
   
    // Закрытие модального окна
    function closeModal() {
        feedbackModal.style.display = 'none';
        isModalOpen = false;
       
        // Возвращаемся к предыдущему состоянию URL
        if (window.location.hash === '#feedback-form') {
            history.back();
        }
       
        // Скрываем статус отправки
        hideFormStatus();
    }
   
    // Загрузка данных из LocalStorage
    function loadFormDataFromStorage() {
        fullnameInput.value = localStorage.getItem(STORAGE_KEYS.FULLNAME) || '';
        emailInput.value = localStorage.getItem(STORAGE_KEYS.EMAIL) || '';
        phoneInput.value = localStorage.getItem(STORAGE_KEYS.PHONE) || '';
        organizationInput.value = localStorage.getItem(STORAGE_KEYS.ORGANIZATION) || '';
        messageInput.value = localStorage.getItem(STORAGE_KEYS.MESSAGE) || '';
        policyCheckbox.checked = localStorage.getItem(STORAGE_KEYS.POLICY) === 'true';
    }
   
    // Сохранение в LocalStorage
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
   
    // Очистка данных формы в LocalStorage
    function clearFormStorage() {
        localStorage.removeItem(STORAGE_KEYS.FULLNAME);
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.PHONE);
        localStorage.removeItem(STORAGE_KEYS.ORGANIZATION);
        localStorage.removeItem(STORAGE_KEYS.MESSAGE);
        localStorage.removeItem(STORAGE_KEYS.POLICY);
    }
   
    // Валидация формы
    function validateForm() {
        let isValid = true;
       
        // Очистка предыдущих ошибок
        clearErrors();
       
        // Проверка ФИО
        if (!fullnameInput.value.trim()) {
            showError('fullname-error', 'Пожалуйста, введите ваше ФИО');
            isValid = false;
        }
       
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError('email-error', 'Пожалуйста, введите ваш email');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError('email-error', 'Пожалуйста, введите корректный email');
            isValid = false;
        }
       
        // Проверка телефона (необязательное поле, но если заполнено - проверяем формат)
        if (phoneInput.value.trim() && !/^[\d\s\-\+\(\)]+$/.test(phoneInput.value)) {
            showError('phone-error', 'Пожалуйста, введите корректный номер телефона');
            isValid = false;
        }
       
        // Проверка сообщения
        if (!messageInput.value.trim()) {
            showError('message-error', 'Пожалуйста, введите ваше сообщение');
            isValid = false;
        }
       
        // Проверка согласия с политикой
        if (!policyCheckbox.checked) {
            showError('policy-error', 'Необходимо согласие с политикой обработки персональных данных');
            isValid = false;
        }
       
        return isValid;
    }
   
    // Показать ошибку
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }
   
    // Очистить ошибки
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
   
    // Показать статус формы
    function showFormStatus(message, isSuccess) {
        formStatus.textContent = message;
        formStatus.className = isSuccess ? 'success' : 'error';
        formStatus.style.display = 'block';
       
        // Автоматическое скрытие статуса через 5 секунд
        if (isSuccess) {
            setTimeout(hideFormStatus, 5000);
        }
    }
   
    // Скрыть статус формы
    function hideFormStatus() {
        formStatus.style.display = 'none';
    }
   
    // Обработка отправки формы
    async function handleFormSubmit(event) {
        event.preventDefault();
       
        // Валидация формы
        if (!validateForm()) {
            return;
        }
       
        // Показываем индикатор загрузки
        const submitBtn = feedbackForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
       
        // Подготовка данных для отправки
        const formData = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim() || 'Не указано',
            organization: organizationInput.value.trim() || 'Не указано',
            message: messageInput.value.trim(),
            policyAgreed: policyCheckbox.checked,
            submittedAt: new Date().toISOString()
        };
       
        try {
            // Отправка данных на сервер с помощью fetch
            const response = await fetch(FORM_SUBMIT_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
           
            if (response.ok) {
                // Успешная отправка
                showFormStatus('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', true);
               
                // Очищаем форму
                feedbackForm.reset();
               
                // Очищаем LocalStorage
                clearFormStorage();
               
                // Закрываем форму через 3 секунды
                setTimeout(() => {
                    closeModal();
                }, 3000);
            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showFormStatus('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', false);
        } finally {
            // Восстанавливаем кнопку отправки
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }
   
    // Автоматическое форматирование телефона
    phoneInput.addEventListener('input', function(e) {
        let value = phoneInput.value.replace(/\D/g, '');
       
        if (value.length > 0) {
            // Форматирование для российских номеров
            if (value[0] === '7' || value[0] === '8') {
                value = '+7' + value.substring(1);
            } else if (value[0] === '9' && value.length <= 10) {
                value = '+7' + value;
            }
           
            // Форматирование с пробелами
            let formattedValue = value;
            if (value.length > 1) {
                formattedValue = value.substring(0, 2) + ' ' + value.substring(2);
            }
            if (value.length > 4) {
                formattedValue = formattedValue.substring(0, 6) + ' ' + formattedValue.substring(6);
            }
            if (value.length > 7) {
                formattedValue = formattedValue.substring(0, 10) + '-' + formattedValue.substring(10);
            }
            if (value.length > 9) {
                formattedValue = formattedValue.substring(0, 13) + '-' + formattedValue.substring(13);
            }
           
            phoneInput.value = formattedValue;
        }
    });
   
    // Открытие формы при загрузке страницы с хэшем #feedback-form
    if (window.location.hash === '#feedback-form') {
        // Небольшая задержка для корректного отображения
        setTimeout(openModal, 100);
    }
   
    // Инициализация приложения
    init();
});

