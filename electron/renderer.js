const appointments = [
  { id: 'elena', title: 'Cardiology visit', provider: 'Dr. Elena Martinez', date: 'Friday, September 4 • 10:30 AM', location: 'Main Campus • Building B, Floor 2', status: 'Confirmed', note: 'Bring your medication list and arrive 15 minutes early.' },
  { id: 'david', title: 'Primary care follow-up', provider: 'Dr. David Chen', date: 'Friday, September 18 • 9:00 AM', location: 'Main Campus • Building A, Floor 1', status: 'Confirmed', note: 'Review recent lab results and current medications.' },
  { id: 'vision', title: 'Vision Center evaluation', provider: 'Vision Center', date: 'Friday, October 2 • 1:30 PM', location: 'Vision Center • Suite 240', status: 'Needs action', note: 'Confirm transportation before the appointment.' },
];

const messages = [
  { id: 'lab', sender: 'Dr. David Chen', subject: 'Your lab results are available', date: 'Today • 8:42 AM', body: 'Your recent blood work is now available in CareConnect. Most results are within the expected range.', notice: 'Results reviewed by care team. No urgent follow-up is required.' },
  { id: 'reminder', sender: 'Care Team', subject: 'Reminder: upcoming appointment', date: 'Yesterday • 4:10 PM', body: 'Your next appointment is approaching. Review the visit details and arrange transportation if needed.' },
  { id: 'referral', sender: 'Vision Center', subject: 'Referral received', date: 'Aug 24 • 1:18 PM', body: 'The Vision Center has received your referral and will contact you with available appointment times.' },
  { id: 'billing', sender: 'Billing Support', subject: 'Statement available', date: 'Aug 19 • 2:03 PM', body: 'Your latest account statement is ready to review.' },
];

const notes = [
  { id: 'primary', title: 'Primary Care Follow-up', provider: 'Dr. David Chen', date: 'August 21, 2026', status: 'Reviewed', summary: 'Routine follow-up. Maya reports stable symptoms and no new concerns.', assessment: 'Blood pressure remains well controlled. Vitamin D level is mildly low.', plan: 'Continue current medications. Begin vitamin D supplement and repeat labs in 12 weeks.' },
  { id: 'cardiology', title: 'Cardiology Consultation', provider: 'Dr. Elena Martinez', date: 'July 30, 2026', status: 'New', summary: 'Consultation to review cardiac symptoms and current care plan.', assessment: 'No urgent findings were identified during the consultation.', plan: 'Continue care plan and attend the scheduled follow-up visit.' },
  { id: 'vision', title: 'Vision Center Evaluation', provider: 'Dr. Priya Shah', date: 'July 14, 2026', status: '', summary: 'Evaluation of current visual-support needs.', assessment: 'Updated visual aids were discussed.', plan: 'Follow up with the Vision Center as needed.' },
];

const state = {
  page: 'signIn',
  signedIn: false,
  appointment: appointments[0],
  message: messages[0],
  note: notes[0],
  textSize: 'Standard',
  highContrast: false,
  reducedClutter: false,
};

const content = document.querySelector('#page-content');
const dialog = document.querySelector('#shortcuts-dialog');
const toast = document.querySelector('#toast');
const menuPopup = document.querySelector('#menu-popup');
let toastTimer;
let menuTrigger;

const menus = {
  File: [{ label: 'Close window', action: 'close-window' }],
  View: [
    { label: 'Toggle high contrast', action: 'toggle-high-contrast' },
    { label: 'Standard text', action: 'set-text-standard' },
    { label: 'Large text', action: 'set-text-large' },
    { label: 'Extra Large text', action: 'set-text-extra-large' },
  ],
  Navigate: [
    { label: 'Home', action: 'page-home', shortcut: '⌘/Ctrl 1' },
    { label: 'Visits', action: 'page-visits', shortcut: '⌘/Ctrl 2' },
    { label: 'Messages', action: 'page-messages', shortcut: '⌘/Ctrl 3' },
    { label: 'Records', action: 'page-records', shortcut: '⌘/Ctrl 4' },
    { label: 'Settings', action: 'page-settings', shortcut: '⌘/Ctrl 5' },
  ],
  Help: [{ label: 'Keyboard shortcuts', action: 'shortcuts', shortcut: '⌘/Ctrl /' }],
};

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function closeMenu(restoreFocus = false) {
  menuPopup.hidden = true;
  document.querySelectorAll('[data-menu]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) menuTrigger?.focus();
  menuTrigger = undefined;
}

function openMenu(button) {
  const name = button.dataset.menu;
  if (!menuPopup.hidden && menuPopup.dataset.activeMenu === name) return closeMenu();
  menuTrigger = button;
  menuPopup.dataset.activeMenu = name;
  menuPopup.innerHTML = menus[name].map((item) => `<button type="button" role="menuitem" data-menu-action="${item.action}"><span>${item.label}</span>${item.shortcut ? `<kbd>${item.shortcut}</kbd>` : ''}</button>`).join('');
  const bounds = button.getBoundingClientRect();
  menuPopup.style.left = `${bounds.left}px`;
  menuPopup.style.top = `${bounds.bottom + 4}px`;
  menuPopup.hidden = false;
  document.querySelectorAll('[data-menu]').forEach((menuButton) => menuButton.setAttribute('aria-expanded', String(menuButton === button)));
  menuPopup.querySelector('button')?.focus();
}

function runMenuAction(action) {
  closeMenu();
  if (action.startsWith('page-')) return changePage(action.slice(5));
  if (action === 'toggle-high-contrast') { state.highContrast = !state.highContrast; updatePreferences(); return showToast(`High contrast ${state.highContrast ? 'enabled' : 'disabled'}.`); }
  if (action.startsWith('set-text-')) {
    state.textSize = action === 'set-text-standard' ? 'Standard' : action === 'set-text-large' ? 'Large' : 'Extra Large';
    updatePreferences();
    return showToast(`Text size set to ${state.textSize}.`);
  }
  if (action === 'shortcuts') return dialog.showModal();
  window.clearViewDesktop?.requestClose();
}

function actionButton(label, primary = false, extra = '') {
  return `<button class="button ${primary ? 'button-primary' : ''} ${extra}" type="button" data-feedback="${label}">${label}</button>`;
}

function renderHome() {
  const appointment = state.appointment;
  return `
    <section class="page" aria-labelledby="page-title">
      <div class="page-heading"><h1 id="page-title">Good morning, Maya</h1><p class="subheading">Thursday, August 27</p></div>
      <div class="dashboard-grid">
        <div class="stack">
          <section class="card" aria-labelledby="next-appointment-title">
            <h2 id="next-appointment-title">Next appointment</h2>
            <div class="appointment-summary"><div><p class="provider">${appointment.provider}</p><p class="summary-meta">Cardiology • Main Campus</p><p>${appointment.date}</p></div>${actionButton('View appointment', true, 'button-small')}</div>
          </section>
          <section class="card" aria-labelledby="preferences-title">
            <h2 id="preferences-title">Accessibility preferences</h2>
            <div class="status-line"><div class="preference-lines"><span>Text: ${state.textSize}</span><span>High contrast: ${state.highContrast ? 'On' : 'Off'}</span><span>Reduced clutter: ${state.reducedClutter ? 'On' : 'Off'}</span></div>${actionButton('Open settings', false, 'button-small')}</div>
          </section>
        </div>
        ${state.reducedClutter ? '' : `<section class="card quick-access" aria-labelledby="quick-access-title"><h2 id="quick-access-title">Quick access</h2><button class="quick-link" type="button" data-page="messages">Messages <span aria-hidden="true">•</span> 2 unread</button><button class="quick-link" type="button" data-page="records">Medical notes <span aria-hidden="true">•</span> 3 recent</button><button class="quick-link" type="button" data-feedback="Prescriptions">Prescriptions <span aria-hidden="true">•</span> 4 active</button><button class="quick-link" type="button" data-feedback="Referrals">Referrals <span aria-hidden="true">•</span> 1 pending</button></section>`}
      </div>
    </section>`;
}

function renderSignIn() {
  return `
    <section class="sign-in-card" aria-labelledby="page-title">
      <h1 id="page-title">Sign in to CareConnect</h1>
      <form id="sign-in-form">
        <div class="form-field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" value="maya.carter@example.com" autocomplete="email" required />
        </div>
        <div class="form-field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" value="ClearView1!" autocomplete="current-password" required />
        </div>
        <button class="button button-primary sign-in-button" type="submit">Sign in</button>
      </form>
      <button class="text-button" type="button" data-feedback="Forgot password">Forgot password?</button>
      <p class="sign-in-note">Accessibility preferences become available after sign-in.</p>
    </section>`;
}

function recordRow(record, selected, label, statusClass = '') {
  return `<button class="record-row ${selected ? 'is-selected' : ''}" type="button" data-select="${label}" data-id="${record.id}" aria-pressed="${selected}"><strong>${label === 'message' ? record.sender : record.title}</strong><p>${label === 'message' ? record.subject : label === 'appointment' ? record.status : record.provider}</p><p class="${statusClass}">${label === 'message' ? record.date : label === 'appointment' ? record.date : `${record.date}${record.status ? ` • ${record.status}` : ''}`}</p></button>`;
}

function renderVisits() {
  const appointment = state.appointment;
  return `<section class="page" aria-labelledby="page-title"><div class="page-heading"><h1 id="page-title">Appointments</h1></div><div class="toolbar"><p>Upcoming</p><div class="toolbar-actions">${actionButton('Filter', false, 'button-small')}${actionButton('Schedule appointment', true, 'button-small')}</div></div><div class="master-detail"><section class="list-card" aria-labelledby="visits-list-title"><h2 id="visits-list-title">Upcoming visits</h2><div class="record-list">${appointments.map((item) => recordRow(item, item.id === appointment.id, 'appointment', item.status === 'Confirmed' ? 'status-success' : 'status-warning')).join('')}</div></section><article class="detail-card" aria-labelledby="detail-title"><h2>Appointment details</h2><h3 id="detail-title">${appointment.title}</h3><p class="detail-meta">${appointment.provider}</p><div class="detail-section"><p>${appointment.date}</p><p>${appointment.location}</p><p>In-person follow-up</p></div><div class="detail-section"><p>${appointment.note}</p></div><div class="detail-actions">${actionButton('Get directions')}${actionButton('Reschedule')}</div></article></div></section>`;
}

function renderMessages() {
  const message = state.message;
  return `<section class="page" aria-labelledby="page-title"><div class="page-heading"><h1 id="page-title">Messages</h1></div><div class="toolbar"><p>2 unread</p><div class="toolbar-actions">${actionButton('Compose', true, 'button-small')}</div></div><div class="master-detail"><section class="list-card" aria-label="Message list"><div class="record-list">${messages.map((item) => recordRow(item, item.id === message.id, 'message')).join('')}</div></section><article class="detail-card" aria-labelledby="detail-title"><h2>${message.sender}</h2><p class="detail-meta">${message.date}</p><h3 id="detail-title">${message.subject}</h3><p>${message.body}</p>${message.notice ? `<div class="notice">✓ ${message.notice}</div>` : ''}<div class="detail-actions">${actionButton('View lab results')}${actionButton('Reply', true)}</div></article></div></section>`;
}

function renderRecords() {
  const note = state.note;
  return `<section class="page" aria-labelledby="page-title"><div class="page-heading"><h1 id="page-title">Medical Notes</h1></div><div class="toolbar"><p>Recent notes</p><div class="toolbar-actions">${actionButton('Filter', false, 'button-small')}</div></div><div class="master-detail"><section class="list-card" aria-label="Medical note list"><div class="record-list">${notes.map((item) => recordRow(item, item.id === note.id, 'note')).join('')}</div></section><article class="detail-card" aria-labelledby="detail-title"><h2 id="detail-title">${note.title}</h2><p class="detail-meta">${note.provider} • ${note.date}</p><section class="detail-section"><h3>Summary</h3><p>${note.summary}</p></section><section class="detail-section"><h3>Assessment</h3><p>${note.assessment}</p></section><section class="detail-section"><h3>Plan</h3><p>${note.plan}</p></section><div class="detail-actions">${actionButton('Message care team')}</div></article></div></section>`;
}

function renderSettings() {
  return `<section class="page" aria-labelledby="page-title"><div class="page-heading"><h1 id="page-title">Accessibility Settings</h1><p class="subheading">Make CareConnect easier to see and use.</p></div><div class="settings-grid"><section class="card settings-list" aria-label="Accessibility preferences"><button class="preference" type="button" data-preference="textSize"><span><strong>Text size</strong><p>Adjust text across the app</p></span><span class="preference-value">${state.textSize}</span></button><button class="preference" type="button" data-preference="highContrast"><span><strong>High contrast</strong><p>Increase contrast for text and controls</p></span><span class="preference-value">${state.highContrast ? 'On' : 'Off'}</span></button><button class="preference" type="button" data-preference="reducedClutter"><span><strong>Reduced clutter</strong><p>Show fewer secondary items</p></span><span class="preference-value">${state.reducedClutter ? 'On' : 'Off'}</span></button><button class="preference" type="button" data-feedback="Color preference"><span><strong>Color preference</strong><p>Use a calmer accent palette</p></span><span class="preference-value">Cool</span></button>${actionButton('Reset preferences')}</section><aside class="card live-preview" aria-labelledby="preview-title"><h2 id="preview-title">Live preview</h2><p>Appointments and messages remain readable at your selected settings.</p><div class="record-row"><strong>${appointments[0].provider}</strong><p>Sep 4 • 10:30 AM</p><p class="status-success">Confirmed</p></div></aside></div></section>`;
}

function renderPage() {
  const templates = { signIn: renderSignIn, home: renderHome, visits: renderVisits, messages: renderMessages, records: renderRecords, settings: renderSettings };
  document.body.classList.toggle('signed-out', !state.signedIn);
  content.innerHTML = templates[state.page]();
  content.querySelector('#page-title')?.setAttribute('tabindex', '-1');
  content.querySelector('#detail-title')?.setAttribute('tabindex', '-1');
  document.querySelectorAll('.nav-item').forEach((item) => {
    const selected = item.dataset.page === state.page;
    item.classList.toggle('is-active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function changePage(page) {
  if (!state.signedIn && page !== 'signIn') {
    showToast('Sign in to access your CareConnect information.');
    return;
  }
  closeMenu();
  state.page = page;
  renderPage();
  document.querySelector('#page-title')?.focus({ preventScroll: true });
}

function updatePreferences(focusPreference) {
  document.body.classList.toggle('text-large', state.textSize === 'Large');
  document.body.classList.toggle('text-extra-large', state.textSize === 'Extra Large');
  document.body.classList.toggle('high-contrast', state.highContrast);
  renderPage();
  if (focusPreference) content.querySelector(`[data-preference="${focusPreference}"]`)?.focus();
}

document.addEventListener('click', (event) => {
  const pageTrigger = event.target.closest('[data-page]');
  if (pageTrigger) return changePage(pageTrigger.dataset.page);

  const selected = event.target.closest('[data-select]');
  if (selected) {
    const items = selected.dataset.select === 'appointment' ? appointments : selected.dataset.select === 'message' ? messages : notes;
    state[selected.dataset.select] = items.find((item) => item.id === selected.dataset.id);
    closeMenu();
    renderPage();
    return content.querySelector('#detail-title')?.focus({ preventScroll: true });
  }

  const preference = event.target.closest('[data-preference]');
  if (preference) {
    if (preference.dataset.preference === 'textSize') {
      state.textSize = state.textSize === 'Standard' ? 'Large' : state.textSize === 'Large' ? 'Extra Large' : 'Standard';
    } else {
      state[preference.dataset.preference] = !state[preference.dataset.preference];
    }
    closeMenu();
    return updatePreferences(preference.dataset.preference);
  }

  if (event.target.closest('[data-close-dialog]')) return dialog.close();
  if (event.target.closest('#shortcuts-button')) return dialog.showModal();
  if (event.target.closest('#search-button')) return showToast('Search is a prototype control. Use Command or Control plus 1–5 to navigate.');
  const menu = event.target.closest('[data-menu]');
  if (menu) return openMenu(menu);
  const menuAction = event.target.closest('[data-menu-action]');
  if (menuAction) return runMenuAction(menuAction.dataset.menuAction);
  if (!menuPopup.hidden && !event.target.closest('#menu-popup')) closeMenu();
  const feedback = event.target.closest('[data-feedback]');
  if (feedback) {
    if (feedback.dataset.feedback === 'View appointment') return changePage('visits');
    if (feedback.dataset.feedback === 'Open settings') return changePage('settings');
    if (feedback.dataset.feedback === 'Reset preferences') {
      state.textSize = 'Standard'; state.highContrast = false; state.reducedClutter = false; updatePreferences(); return showToast('Accessibility preferences reset.');
    }
    return showToast(`${feedback.dataset.feedback} is available in the full CareConnect experience.`);
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'sign-in-form') return;
  event.preventDefault();
  state.signedIn = true;
  state.page = 'home';
  renderPage();
  document.querySelector('#page-title')?.focus({ preventScroll: true });
  showToast('Signed in. Dashboard is ready.');
});

document.addEventListener('keydown', (event) => {
  if (!menuPopup.hidden && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const items = [...menuPopup.querySelectorAll('[role="menuitem"]')];
    const currentIndex = items.indexOf(document.activeElement);
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
        : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    return items[nextIndex]?.focus();
  }
  const modifier = event.metaKey || event.ctrlKey;
  if (modifier && /^[1-5]$/.test(event.key)) {
    event.preventDefault();
    return changePage(['home', 'visits', 'messages', 'records', 'settings'][Number(event.key) - 1]);
  }
  if (modifier && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    return document.querySelector('#search-button').focus();
  }
  if (modifier && event.key === '/') {
    event.preventDefault();
    return dialog.showModal();
  }
  if (event.key === 'Escape') {
    if (dialog.open) dialog.close();
    closeMenu(true);
  }
});

window.clearViewDesktop?.onNavigate(changePage);
window.clearViewDesktop?.onOpenShortcuts(() => dialog.showModal());
window.clearViewDesktop?.onSetPreference((name, value) => {
  if (name === 'highContrast') state.highContrast = !state.highContrast;
  if (name === 'textSize') state.textSize = value;
  updatePreferences();
  showToast(name === 'highContrast' ? `High contrast ${state.highContrast ? 'enabled' : 'disabled'}.` : `Text size set to ${state.textSize}.`);
});

renderPage();
