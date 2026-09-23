// Initialize particles.js
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: {
      type: 'circle',
      stroke: { width: 0, color: '#000000' },
      polygon: { nb_sides: 5 },
      image: { src: 'img/github.svg', width: 100, height: 100 }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 600 }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
});

// Event management
let events = JSON.parse(localStorage.getItem('taskmasterEvents')) || [];
let selectedIcon = '🎯';

// DOM Elements
const eventForm = document.getElementById('event-form');
const eventTitleInput = document.getElementById('event-title');
const eventDateInput = document.getElementById('event-date');
const eventTypeSelect = document.getElementById('event-type');
const eventColorInput = document.getElementById('event-color');
const iconButtons = document.querySelectorAll('.icon-btn');
const eventPreview = document.getElementById('event-preview');
const eventsContainer = document.getElementById('events-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const featuresBtn = document.getElementById('features-btn');
const startNowBtn = document.getElementById('start-now-btn');
const customizationSection = document.getElementById('customization');
const featuresSection = document.getElementById('features');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  setupEventListeners();
  setupIconSelection();
  setupFormPreview();
});

// Event Listeners
function setupEventListeners() {
  eventForm.addEventListener('submit', handleEventSubmit);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.dataset.filter);
    });
  });

  getStartedBtn.addEventListener('click', () => {
    customizationSection.scrollIntoView({ behavior: 'smooth' });
  });

  featuresBtn.addEventListener('click', () => {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  });

  startNowBtn.addEventListener('click', () => {
    customizationSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Icon Selection
function setupIconSelection() {
  iconButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      iconButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIcon = btn.dataset.icon;
      updatePreview();
    });
  });
}

// Form Preview
function setupFormPreview() {
  const formFields = [eventTitleInput, eventDateInput, eventTypeSelect, eventColorInput];
  formFields.forEach(field => {
    field.addEventListener('input', updatePreview);
  });
}

// Handle Event Submit
function handleEventSubmit(e) {
  e.preventDefault();

  const title = eventTitleInput.value.trim();
  const date = eventDateInput.value;
  const type = eventTypeSelect.value;
  const color = eventColorInput.value;

  if (!title || !date) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    date: new Date(date).toISOString(),
    type,
    color,
    icon: selectedIcon
  };

  events.push(newEvent);
  saveEvents();
  renderEvents();

  // Reset form
  eventForm.reset();
  eventColorInput.value = '#ff6b6b';
  selectedIcon = '🎯';
  iconButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector('[data-icon="🎯"]').classList.add('active');
  updatePreview();

  // Show success message
  showToast('Событие добавлено!', 'success');
}

// Save Events
function saveEvents() {
  localStorage.setItem('taskmasterEvents', JSON.stringify(events));
}

// Render Events
function renderEvents(filter = 'all') {
  eventsContainer.innerHTML = '';

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.type === filter);

  if (filteredEvents.length === 0) {
    eventsContainer.innerHTML = `
      <div class="no-events">
        <h3>Нет событий для отображения</h3>
        <p>${filter === 'all' ? 'Добавьте свое первое событие!' : `Нет событий типа "${filter}"`}</p>
      </div>
    `;
    return;
  }

  filteredEvents.forEach(event => {
    const eventElement = createEventElement(event);
    eventsContainer.appendChild(eventElement);
  });
}

// Create Event Element
function createEventElement(event) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const eventDiv = document.createElement('div');
  eventDiv.className = 'event-item';
  eventDiv.style.setProperty('--event-color', event.color);

  eventDiv.innerHTML = `
    <div class="event-header">
      <div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <span class="event-icon">${event.icon}</span>
          <span class="event-date">${formattedDate}</span>
          <span class="event-type" style="background: ${event.color}">${event.type}</span>
        </div>
      </div>
    </div>
    <div class="event-actions">
      <button class="btn-edit" onclick="editEvent(${event.id})">Редактировать</button>
      <button class="btn-delete" onclick="deleteEvent(${event.id})">Удалить</button>
    </div>
  `;

  return eventDiv;
}

// Edit Event
function editEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;

  eventTitleInput.value = event.title;
  eventDateInput.value = new Date(event.date).toISOString().slice(0, 16);
  eventTypeSelect.value = event.type;
  eventColorInput.value = event.color;
  selectedIcon = event.icon;

  // Update UI
  iconButtons.forEach(btn => btn.classList.remove('active'));
  const iconBtn = document.querySelector(`[data-icon="${event.icon}"]`);
  if (iconBtn) iconBtn.classList.add('active');

  // Remove event from list
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderEvents();

  updatePreview();
  eventTitleInput.focus();

  showToast('Готово к редактированию!', 'info');
}

// Delete Event
function deleteEvent(id) {
  if (confirm('Вы уверены, что хотите удалить это событие?')) {
    events = events.filter(e => e.id !== id);
    saveEvents();
    renderEvents();
    showToast('Событие удалено', 'warning');
  }
}

// Update Preview
function updatePreview() {
  const title = eventTitleInput.value || 'Название события';
  const date = eventDateInput.value ? new Date(eventDateInput.value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Дата и время';
  const type = eventTypeSelect.value || 'Тип';
  const color = eventColorInput.value;
  const icon = selectedIcon;

  eventPreview.innerHTML = `
    <div class="preview-event" style="border-left: 4px solid ${color}; background: rgba(255,255,255,0.03);">
      <div class="event-header">
        <div>
          <h3 class="event-title">${title}</h3>
          <div class="event-meta">
            <span class="event-icon">${icon}</span>
            <span class="event-date">${date}</span>
            <span class="event-type" style="background: ${color}">${type}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // If empty, show placeholder
  if (!eventTitleInput.value && !eventDateInput.value) {
    eventPreview.innerHTML = '<div class="preview-empty">Добавьте событие, чтобы увидеть предпросмотр</div>';
  }
}

// Show Toast Notification
function showToast(message, type = 'info') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Trigger reflow for animation
  toast.offsetWidth;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    max-width: 300px;
  }

  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }

  .toast-info { background: linear-gradient(45deg, #4ecdc4, #44a08d); }
  .toast-success { background: linear-gradient(45deg, #ff9a9e, #fad0c4); }
  .toast-warning { background: linear-gradient(45deg, #ffeaa7, #fab1a0); }
  .toast-error { background: linear-gradient(45deg, #ff6b6b, #ff5252); }
`;
document.head.appendChild(toastStyle);