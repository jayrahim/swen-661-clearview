import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const appointments = [
  {
    id: "elena",
    title: "Cardiology visit",
    provider: "Dr. Elena Martinez",
    date: "Friday, September 4 • 10:30 AM",
    location: "Main Campus • Building B, Floor 2",
    status: "Confirmed",
    note: "Bring your medication list and arrive 15 minutes early.",
  },
  {
    id: "david",
    title: "Primary care follow-up",
    provider: "Dr. David Chen",
    date: "Friday, September 18 • 9:00 AM",
    location: "Main Campus • Building A, Floor 1",
    status: "Confirmed",
    note: "Review recent lab results and current medications.",
  },
  {
    id: "vision",
    title: "Vision Center evaluation",
    provider: "Vision Center",
    date: "Friday, October 2 • 1:30 PM",
    location: "Vision Center • Suite 240",
    status: "Needs action",
    note: "Confirm transportation before the appointment.",
  },
];

const messages = [
  {
    id: "lab",
    sender: "Dr. David Chen",
    subject: "Your lab results are available",
    date: "Today • 8:42 AM",
    body: "Your recent blood work is now available in CareConnect. Most results are within the expected range.",
    notice: "Results reviewed by care team. No urgent follow-up is required.",
  },
  {
    id: "reminder",
    sender: "Care Team",
    subject: "Reminder: upcoming appointment",
    date: "Yesterday • 4:10 PM",
    body: "Your next appointment is approaching. Review the visit details and arrange transportation if needed.",
  },
  {
    id: "referral",
    sender: "Vision Center",
    subject: "Referral received",
    date: "Aug 24 • 1:18 PM",
    body: "The Vision Center has received your referral and will contact you with available appointment times.",
  },
  {
    id: "billing",
    sender: "Billing Support",
    subject: "Statement available",
    date: "Aug 19 • 2:03 PM",
    body: "Your latest account statement is ready to review.",
  },
];

const notes = [
  {
    id: "primary",
    title: "Primary Care Follow-up",
    provider: "Dr. David Chen",
    date: "August 21, 2026",
    status: "Reviewed",
    summary:
      "Routine follow-up. Maya reports stable symptoms and no new concerns.",
    assessment:
      "Blood pressure remains well controlled. Vitamin D level is mildly low.",
    plan: "Continue current medications. Begin vitamin D supplement and repeat labs in 12 weeks.",
  },
  {
    id: "cardiology",
    title: "Cardiology Consultation",
    provider: "Dr. Elena Martinez",
    date: "July 30, 2026",
    status: "New",
    summary: "Consultation to review cardiac symptoms and current care plan.",
    assessment: "No urgent findings were identified during the consultation.",
    plan: "Continue care plan and attend the scheduled follow-up visit.",
  },
  {
    id: "vision",
    title: "Vision Center Evaluation",
    provider: "Dr. Priya Shah",
    date: "July 14, 2026",
    status: "",
    summary: "Evaluation of current visual-support needs.",
    assessment: "Updated visual aids were discussed.",
    plan: "Follow up with the Vision Center as needed.",
  },
];

const prototypeFeedback = {
  "Color preference": "Color preference is not available in this prototype.",
  Compose: "Composing messages is not available in this prototype.",
  Filter: "Filtering is not available in this prototype.",
  "Forgot password": "Password recovery is not available in this prototype.",
  "Get directions": "Directions are not available in this prototype.",
  Prescriptions: "Prescriptions are not available in this prototype.",
  Referrals: "Referrals are not available in this prototype.",
  Reply: "Reply is not available in this prototype.",
  Reschedule: "Rescheduling is not available in this prototype.",
  "Schedule appointment": "Scheduling is not available in this prototype.",
  Search: "Search is not available in this prototype.",
  "Message care team":
    "Messaging the care team is not available in this prototype.",
  "View lab results": "Lab results are not available in this prototype.",
};

const pageNames = ["home", "visits", "messages", "records", "settings"];

export function getPrototypeFeedback(action) {
  return (
    prototypeFeedback[action] ??
    `${action} is not available in this prototype.`
  );
}

function ActionButton({ children, primary = false, className = "", onClick }) {
  return (
    <button
      className={`button ${primary ? "button-primary" : ""} ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Header({
  onNavigate,
  onPreference,
  onShortcuts,
  onFeedback,
  onClose,
}) {
  const [menu, setMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuTrigger = useRef(null);
  const menuPopup = useRef(null);
  const closeMenu = (restoreFocus = false) => {
    setMenu(null);
    setMenuPosition(null);
    if (restoreFocus) menuTrigger.current?.focus();
  };
  const menus = {
    File: [{ label: "Close window", action: onClose }],
    View: [
      {
        label: "Toggle high contrast",
        action: () => onPreference("highContrast"),
      },
      {
        label: "Standard text",
        action: () => onPreference("textSize", "Standard"),
      },
      { label: "Large text", action: () => onPreference("textSize", "Large") },
      {
        label: "Extra Large text",
        action: () => onPreference("textSize", "Extra Large"),
      },
    ],
    Navigate: pageNames.map((page, index) => ({
      label:
        page === "records"
          ? "Records"
          : `${page[0].toUpperCase()}${page.slice(1)}`,
      shortcut: `⌘/Ctrl ${index + 1}`,
      action: () => onNavigate(page),
    })),
    Help: [
      {
        label: "Keyboard shortcuts",
        shortcut: "⌘/Ctrl /",
        action: onShortcuts,
      },
    ],
  };
  const runMenuAction = (action) => {
    closeMenu();
    action();
  };
  const moveMenuFocus = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = [
      ...event.currentTarget.querySelectorAll('[role="menuitem"]'),
    ];
    const current = items.indexOf(document.activeElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length;
    items[next]?.focus();
  };
  useEffect(() => {
    if (!menu) return undefined;
    menuPopup.current?.querySelector('[role="menuitem"]')?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onPointerDown = (event) => {
      if (
        !menuPopup.current?.contains(event.target) &&
        !menuTrigger.current?.contains(event.target)
      )
        closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menu]);

  return (
    <>
      <header className="app-header">
        <div className="brand">CareConnect ClearView</div>
        <nav aria-label="Application menu" className="menu-bar">
          {Object.keys(menus).map((name) => (
            <button
              key={name}
              className="menu-button"
              type="button"
              aria-haspopup="menu"
              aria-controls="menu-popup"
              aria-expanded={menu === name}
              onClick={(event) => {
                menuTrigger.current = event.currentTarget;
                const bounds = event.currentTarget.getBoundingClientRect();
                setMenuPosition(
                  menu === name
                    ? null
                    : { left: bounds.left, top: bounds.bottom + 4 },
                );
                setMenu(menu === name ? null : name);
              }}
            >
              {name}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="shortcut-button"
            type="button"
            aria-label="Search, Command or Control K"
            onClick={() => onFeedback("Search")}
          >
            <span aria-hidden="true">⌘K</span> Search
          </button>
        </div>
      </header>
      {menu && (
        <div
          ref={menuPopup}
          id="menu-popup"
          className="menu-popup"
          role="menu"
          style={menuPosition}
          onKeyDown={moveMenuFocus}
        >
          {menus[menu].map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => runMenuAction(item.action)}
            >
              <span>{item.label}</span>
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Navigation({ page, onNavigate, onShortcuts }) {
  return (
    <aside className="navigation-rail">
      <nav aria-label="Primary navigation">
        {pageNames.map((item) => (
          <button
            key={item}
            className={`nav-item ${page === item ? "is-active" : ""}`}
            type="button"
            aria-current={page === item ? "page" : undefined}
            onClick={() => onNavigate(item)}
          >
            {item === "records"
              ? "Records"
              : `${item[0].toUpperCase()}${item.slice(1)}`}
          </button>
        ))}
      </nav>
      <div className="rail-footer">
        <button className="rail-link" type="button" onClick={onShortcuts}>
          Keyboard shortcuts
        </button>
        <button
          className="rail-link"
          type="button"
          onClick={() => onNavigate("settings")}
        >
          Accessibility
        </button>
      </div>
    </aside>
  );
}

function SignIn({ onSignIn, onFeedback }) {
  return (
    <section className="sign-in-card" aria-labelledby="page-title">
      <h1 id="page-title">Sign in to CareConnect</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSignIn();
        }}
      >
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue="maya.carter@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="ClearView1!"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="button button-primary sign-in-button" type="submit">
          Sign in
        </button>
      </form>
      <button
        className="text-button"
        type="button"
        onClick={() => onFeedback("Forgot password")}
      >
        Forgot password?
      </button>
      <p className="sign-in-note">
        Accessibility preferences become available after sign-in.
      </p>
    </section>
  );
}

function Home({ appointment, preferences, onNavigate, onFeedback }) {
  return (
    <Page title="Good morning, Maya" subtitle="Thursday, August 27">
      <div className="dashboard-grid">
        <div className="stack">
          <section className="card" aria-labelledby="next-appointment-title">
            <h2 id="next-appointment-title">Next appointment</h2>
            <div className="appointment-summary">
              <div>
                <p className="provider">{appointment.provider}</p>
                <p className="summary-meta">Cardiology • Main Campus</p>
                <p>{appointment.date}</p>
              </div>
              <ActionButton
                primary
                className="button-small"
                onClick={() => onNavigate("visits")}
              >
                View appointment
              </ActionButton>
            </div>
          </section>
          <section className="card" aria-labelledby="preferences-title">
            <h2 id="preferences-title">Accessibility preferences</h2>
            <div className="status-line">
              <div className="preference-lines">
                <span>Text: {preferences.textSize}</span>
                <span>
                  High contrast: {preferences.highContrast ? "On" : "Off"}
                </span>
                <span>
                  Reduced clutter: {preferences.reducedClutter ? "On" : "Off"}
                </span>
              </div>
              <ActionButton
                className="button-small"
                onClick={() => onNavigate("settings")}
              >
                Open settings
              </ActionButton>
            </div>
          </section>
        </div>
        {!preferences.reducedClutter && (
          <section
            className="card quick-access"
            aria-labelledby="quick-access-title"
          >
            <h2 id="quick-access-title">Quick access</h2>
            <button
              className="quick-link"
              type="button"
              onClick={() => onNavigate("messages")}
            >
              Messages <span aria-hidden="true">•</span> 2 unread
            </button>
            <button
              className="quick-link"
              type="button"
              onClick={() => onNavigate("records")}
            >
              Medical notes <span aria-hidden="true">•</span> 3 recent
            </button>
            <button
              className="quick-link"
              type="button"
              onClick={() => onFeedback("Prescriptions")}
            >
              Prescriptions <span aria-hidden="true">•</span> 4 active
            </button>
            <button
              className="quick-link"
              type="button"
              onClick={() => onFeedback("Referrals")}
            >
              Referrals <span aria-hidden="true">•</span> 1 pending
            </button>
          </section>
        )}
      </div>
    </Page>
  );
}

function Page({ title, subtitle, children }) {
  return (
    <section className="page" aria-labelledby="page-title">
      <div className="page-heading">
        <h1 id="page-title" tabIndex="-1">
          {title}
        </h1>
        {subtitle && <p className="subheading">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function RecordRow({ record, selected, kind, onSelect }) {
  const isMessage = kind === "message";
  const secondary = isMessage
    ? record.subject
    : kind === "appointment"
      ? record.status
      : record.provider;
  const tertiary = isMessage
    ? record.date
    : kind === "appointment"
      ? record.date
      : `${record.date}${record.status ? ` • ${record.status}` : ""}`;
  return (
    <button
      className={`record-row ${selected ? "is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <strong>{isMessage ? record.sender : record.title}</strong>
      <p>{secondary}</p>
      <p
        className={
          kind === "appointment"
            ? record.status === "Confirmed"
              ? "status-success"
              : "status-warning"
            : ""
        }
      >
        {tertiary}
      </p>
    </button>
  );
}

function Visits({ appointment, onSelect, onFeedback }) {
  return (
    <Page title="Appointments">
      <Toolbar label="Upcoming">
        <ActionButton
          className="button-small"
          onClick={() => onFeedback("Filter")}
        >
          Filter
        </ActionButton>
        <ActionButton
          primary
          className="button-small"
          onClick={() => onFeedback("Schedule appointment")}
        >
          Schedule appointment
        </ActionButton>
      </Toolbar>
      <div className="master-detail">
        <section className="list-card" aria-labelledby="visits-list-title">
          <h2 id="visits-list-title">Upcoming visits</h2>
          <div className="record-list">
            {appointments.map((item) => (
              <RecordRow
                key={item.id}
                record={item}
                selected={item.id === appointment.id}
                kind="appointment"
                onSelect={() => onSelect(item)}
              />
            ))}
          </div>
        </section>
        <article className="detail-card" aria-labelledby="detail-title">
          <h2>Appointment details</h2>
          <h3 id="detail-title" tabIndex="-1">
            {appointment.title}
          </h3>
          <p className="detail-meta">{appointment.provider}</p>
          <div className="detail-section">
            <p>{appointment.date}</p>
            <p>{appointment.location}</p>
            <p>In-person follow-up</p>
          </div>
          <div className="detail-section">
            <p>{appointment.note}</p>
          </div>
          <div className="detail-actions">
            <ActionButton onClick={() => onFeedback("Get directions")}>
              Get directions
            </ActionButton>
            <ActionButton onClick={() => onFeedback("Reschedule")}>
              Reschedule
            </ActionButton>
          </div>
        </article>
      </div>
    </Page>
  );
}

function Messages({ message, onSelect, onFeedback }) {
  return (
    <Page title="Messages">
      <Toolbar label="2 unread">
        <ActionButton
          primary
          className="button-small"
          onClick={() => onFeedback("Compose")}
        >
          Compose
        </ActionButton>
      </Toolbar>
      <div className="master-detail">
        <section className="list-card" aria-label="Message list">
          <div className="record-list">
            {messages.map((item) => (
              <RecordRow
                key={item.id}
                record={item}
                selected={item.id === message.id}
                kind="message"
                onSelect={() => onSelect(item)}
              />
            ))}
          </div>
        </section>
        <article className="detail-card" aria-labelledby="detail-title">
          <h2>{message.sender}</h2>
          <p className="detail-meta">{message.date}</p>
          <h3 id="detail-title" tabIndex="-1">
            {message.subject}
          </h3>
          <p>{message.body}</p>
          {message.notice && <div className="notice">✓ {message.notice}</div>}
          <div className="detail-actions">
            <ActionButton onClick={() => onFeedback("View lab results")}>
              View lab results
            </ActionButton>
            <ActionButton primary onClick={() => onFeedback("Reply")}>
              Reply
            </ActionButton>
          </div>
        </article>
      </div>
    </Page>
  );
}

function Records({ note, onSelect, onFeedback }) {
  return (
    <Page title="Medical Notes">
      <Toolbar label="Recent notes">
        <ActionButton
          className="button-small"
          onClick={() => onFeedback("Filter")}
        >
          Filter
        </ActionButton>
      </Toolbar>
      <div className="master-detail">
        <section className="list-card" aria-label="Medical note list">
          <div className="record-list">
            {notes.map((item) => (
              <RecordRow
                key={item.id}
                record={item}
                selected={item.id === note.id}
                kind="note"
                onSelect={() => onSelect(item)}
              />
            ))}
          </div>
        </section>
        <article className="detail-card" aria-labelledby="detail-title">
          <h2 id="detail-title" tabIndex="-1">
            {note.title}
          </h2>
          <p className="detail-meta">
            {note.provider} • {note.date}
          </p>
          <section className="detail-section">
            <h3>Summary</h3>
            <p>{note.summary}</p>
          </section>
          <section className="detail-section">
            <h3>Assessment</h3>
            <p>{note.assessment}</p>
          </section>
          <section className="detail-section">
            <h3>Plan</h3>
            <p>{note.plan}</p>
          </section>
          <div className="detail-actions">
            <ActionButton onClick={() => onFeedback("Message care team")}>
              Message care team
            </ActionButton>
          </div>
        </article>
      </div>
    </Page>
  );
}

function Toolbar({ label, children }) {
  return (
    <div className="toolbar">
      <p>{label}</p>
      <div className="toolbar-actions">{children}</div>
    </div>
  );
}

function Settings({ preferences, onPreference, onFeedback, onReset }) {
  const textSize =
    preferences.textSize === "Standard"
      ? "Large"
      : preferences.textSize === "Large"
        ? "Extra Large"
        : "Standard";
  return (
    <Page
      title="Accessibility Settings"
      subtitle="Make CareConnect easier to see and use."
    >
      <div className="settings-grid">
        <section
          className="card settings-list"
          aria-label="Accessibility preferences"
        >
          <button
            className="preference"
            type="button"
            onClick={() => onPreference("textSize", textSize)}
          >
            <span>
              <strong>Text size</strong>
              <p>Adjust text across the app</p>
            </span>
            <span className="preference-value">{preferences.textSize}</span>
          </button>
          <button
            className="preference"
            type="button"
            onClick={() => onPreference("highContrast")}
          >
            <span>
              <strong>High contrast</strong>
              <p>Increase contrast for text and controls</p>
            </span>
            <span className="preference-value">
              {preferences.highContrast ? "On" : "Off"}
            </span>
          </button>
          <button
            className="preference"
            type="button"
            onClick={() => onPreference("reducedClutter")}
          >
            <span>
              <strong>Reduced clutter</strong>
              <p>Show fewer secondary items</p>
            </span>
            <span className="preference-value">
              {preferences.reducedClutter ? "On" : "Off"}
            </span>
          </button>
          <button
            className="preference"
            type="button"
            onClick={() => onFeedback("Color preference")}
          >
            <span>
              <strong>Color preference</strong>
              <p>Use a calmer accent palette</p>
            </span>
            <span className="preference-value">Cool</span>
          </button>
          <ActionButton onClick={onReset}>Reset preferences</ActionButton>
        </section>
        <aside className="card live-preview" aria-labelledby="preview-title">
          <h2 id="preview-title">Live preview</h2>
          <p>
            Appointments and messages remain readable at your selected settings.
          </p>
          <div className="record-row">
            <strong>{appointments[0].provider}</strong>
            <p>Sep 4 • 10:30 AM</p>
            <p className="status-success">Confirmed</p>
          </div>
        </aside>
      </div>
    </Page>
  );
}

function ShortcutsDialog({ open, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [open]);
  return (
    <dialog ref={dialog} aria-labelledby="shortcuts-title" onClose={onClose}>
      <div className="dialog-heading">
        <h2 id="shortcuts-title">Keyboard shortcuts</h2>
        <button
          className="icon-button"
          type="button"
          onClick={onClose}
          aria-label="Close keyboard shortcuts"
        >
          ×
        </button>
      </div>
      <p>Use these shortcuts from anywhere in the desktop prototype.</p>
      <dl className="shortcut-list">
        <div>
          <dt>
            <kbd>⌘/Ctrl</kbd> + <kbd>1–5</kbd>
          </dt>
          <dd>Open Home, Visits, Messages, Records, or Settings</dd>
        </div>
        <div>
          <dt>
            <kbd>⌘/Ctrl</kbd> + <kbd>K</kbd>
          </dt>
          <dd>Focus search</dd>
        </div>
        <div>
          <dt>
            <kbd>⌘/Ctrl</kbd> + <kbd>/</kbd>
          </dt>
          <dd>Open this shortcut reference</dd>
        </div>
        <div>
          <dt>
            <kbd>Esc</kbd>
          </dt>
          <dd>Close an open dialog or menu</dd>
        </div>
        <div>
          <dt>
            <kbd>Tab</kbd>
          </dt>
          <dd>Move through controls in reading order</dd>
        </div>
        <div>
          <dt>
            <kbd>Enter</kbd> / <kbd>Space</kbd>
          </dt>
          <dd>Activate the focused control</dd>
        </div>
      </dl>
      <ActionButton primary onClick={onClose}>
        Done
      </ActionButton>
    </dialog>
  );
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [page, setPage] = useState("signIn");
  const [appointment, setAppointment] = useState(appointments[0]);
  const [message, setMessage] = useState(messages[0]);
  const [note, setNote] = useState(notes[0]);
  const [preferences, setPreferences] = useState({
    textSize: "Standard",
    highContrast: false,
    reducedClutter: false,
  });
  const [toast, setToast] = useState("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const toastTimer = useRef();
  const notify = (value) => {
    setToast(value);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3500);
  };
  const navigate = (destination) => {
    if (!signedIn && destination !== "signIn")
      return notify("Sign in to access your CareConnect information.");
    setPage(destination);
    window.setTimeout(() =>
      document.querySelector("#page-title")?.focus({ preventScroll: true }),
    );
  };
  const changePreference = (name, value) =>
    setPreferences((current) => {
      const next = {
        ...current,
        [name]: value === undefined ? !current[name] : value,
      };
      notify(
        name === "highContrast"
          ? `High contrast ${next.highContrast ? "enabled" : "disabled"}.`
          : name === "textSize"
            ? `Text size set to ${next.textSize}.`
            : `Reduced clutter ${next.reducedClutter ? "enabled" : "disabled"}.`,
      );
      return next;
    });
  const select = (setter) => (value) => {
    setter(value);
    window.setTimeout(() =>
      document.querySelector("#detail-title")?.focus({ preventScroll: true }),
    );
  };
  const handlers = useRef({});
  handlers.current = { navigate, changePreference };

  useEffect(() => {
    const desktopApi = window.clearViewDesktop;
    const focusSearch = () => {
      // Run after any pending page-heading focus transfer from navigation.
      window.setTimeout(() =>
        document
          .querySelector('[aria-label="Search, Command or Control K"]')
          ?.focus(),
      );
    };
    const onKeyDown = (event) => {
      // Electron registers these accelerators in the native menu. Avoid a
      // second navigation/focus event when its menu action reaches the bridge.
      if (desktopApi) return;
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && /^[1-5]$/.test(event.key)) {
        event.preventDefault();
        handlers.current.navigate(pageNames[Number(event.key) - 1]);
      } else if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      } else if (modifier && event.key === "/") {
        event.preventDefault();
        setShortcutsOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    desktopApi?.onNavigate((destination) =>
      handlers.current.navigate(destination),
    );
    desktopApi?.onFocusSearch(focusSearch);
    desktopApi?.onOpenShortcuts(() => setShortcutsOpen(true));
    desktopApi?.onSetPreference((name, value) =>
      handlers.current.changePreference(name, value),
    );
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle(
      "text-large",
      preferences.textSize === "Large",
    );
    document.body.classList.toggle(
      "text-extra-large",
      preferences.textSize === "Extra Large",
    );
    document.body.classList.toggle("high-contrast", preferences.highContrast);
    window.clearViewDesktop?.updateMenuPreferences(preferences);
  }, [preferences]);

  const feedback = (action) => notify(getPrototypeFeedback(action));
  const pageContent =
    page === "signIn" ? (
      <SignIn
        onSignIn={() => {
          setSignedIn(true);
          setPage("home");
          window.setTimeout(() =>
            document
              .querySelector("#page-title")
              ?.focus({ preventScroll: true }),
          );
          notify("Signed in. Dashboard is ready.");
        }}
        onFeedback={feedback}
      />
    ) : page === "home" ? (
      <Home
        appointment={appointment}
        preferences={preferences}
        onNavigate={navigate}
        onFeedback={feedback}
      />
    ) : page === "visits" ? (
      <Visits
        appointment={appointment}
        onSelect={select(setAppointment)}
        onFeedback={feedback}
      />
    ) : page === "messages" ? (
      <Messages
        message={message}
        onSelect={select(setMessage)}
        onFeedback={feedback}
      />
    ) : page === "records" ? (
      <Records note={note} onSelect={select(setNote)} onFeedback={feedback} />
    ) : (
      <Settings
        preferences={preferences}
        onPreference={changePreference}
        onFeedback={feedback}
        onReset={() => {
          setPreferences({
            textSize: "Standard",
            highContrast: false,
            reducedClutter: false,
          });
          notify("Accessibility preferences reset.");
        }}
      />
    );
  return (
    <div className={signedIn ? "" : "signed-out"}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header
        onNavigate={navigate}
        onPreference={changePreference}
        onShortcuts={() => setShortcutsOpen(true)}
        onFeedback={feedback}
        onClose={() => window.clearViewDesktop?.requestClose()}
      />
      <div className="app-shell">
        {signedIn && (
          <Navigation
            page={page}
            onNavigate={navigate}
            onShortcuts={() => setShortcutsOpen(true)}
          />
        )}
        <main id="main-content" tabIndex="-1">
          {pageContent}
        </main>
      </div>
      <ShortcutsDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

const rootElement = document.querySelector("#app");
if (rootElement) createRoot(rootElement).render(<App />);

export { App };
