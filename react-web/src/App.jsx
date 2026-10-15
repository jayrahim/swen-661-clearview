import { useEffect, useRef, useState } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const navigationItems = [
  { label: "Home", to: "/dashboard" },
  { label: "Visits", to: "/visits" },
  { label: "Messages", to: "/messages" },
  { label: "Records", to: "/records" },
  { label: "Settings", to: "/settings" },
];

const appointments = [
  {
    id: "martinez",
    date: "Oct 20",
    title: "Cardiology visit",
    clinician: "Dr. Elena Martinez",
    time: "10:30 AM",
    place: "Main Campus",
    status: "Confirmed",
  },
  {
    id: "chen",
    date: "Nov 3",
    title: "Primary care follow-up",
    clinician: "Dr. David Chen",
    time: "9:00 AM",
    place: "North clinic",
    status: "Confirmed",
  },
  {
    id: "vision",
    date: "Nov 17",
    title: "Vision Center evaluation",
    clinician: "Vision Center",
    time: "1:30 PM",
    place: "Vision Center",
    status: "Needs action",
  },
];

const messages = [
  {
    id: "chen",
    sender: "Dr. David Chen",
    subject: "Lab results are available",
    preview: "Your recent blood work is now available in CareConnect.",
    date: "Today · 8:42 AM",
  },
  {
    id: "care",
    sender: "Care Team",
    subject: "Reminder: upcoming appointment",
    preview: "Please confirm your upcoming cardiology visit.",
    date: "Yesterday · 4:10 PM",
  },
  {
    id: "vision",
    sender: "Vision Center",
    subject: "Referral received",
    preview: "We received your referral and will be in touch.",
    date: "Oct 11 · 11:18 AM",
  },
  {
    id: "billing",
    sender: "Billing Support",
    subject: "Statement available",
    preview: "Your October statement is available to review.",
    date: "Oct 5 · 2:03 PM",
  },
];

const notes = [
  {
    id: "primary",
    title: "Primary Care Follow-up",
    clinician: "Dr. David Chen",
    date: "Oct 8 · Reviewed",
    summary: "Routine follow-up. Maya reports stable symptoms.",
    assessment: "Blood pressure remains controlled.",
    plan: "Continue current medication. Adjust plan as needed at next visit.",
  },
  {
    id: "cardiology",
    title: "Cardiology Consultation",
    clinician: "Dr. Elena Martinez",
    date: "Sep 30 · New",
    summary: "Cardiology consultation completed.",
    assessment: "No acute concerns reported.",
    plan: "Continue monitoring symptoms.",
  },
  {
    id: "vision",
    title: "Vision Center Evaluation",
    clinician: "Dr. Priya Shah",
    date: "Sep 14",
    summary: "Vision evaluation completed.",
    assessment: "Follow-up recommended.",
    plan: "Schedule next evaluation.",
  },
];

const titles = {
  "/sign-in": "Sign in",
  "/dashboard": "Dashboard",
  "/visits": "Appointments",
  "/messages": "Messages",
  "/records": "Medical Notes",
  "/settings": "Accessibility Settings",
};

const defaultPreferences = {
  text: "Large",
  contrast: "On",
  clutter: "Off",
  color: "Cool",
};

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${titles[pathname] ?? "ClearView"} | ClearView`;
  }, [pathname]);
  return null;
}

function RouteFocus() {
  const { pathname } = useLocation();
  const initialPath = useRef(pathname);
  useEffect(() => {
    const isInitialRedirect =
      ["/", "/login"].includes(initialPath.current) &&
      pathname === "/sign-in";

    if (initialPath.current !== pathname && !isInitialRedirect)
      document.querySelector("#main-content h1")?.focus();
    initialPath.current = pathname;
  }, [pathname]);
  return null;
}

function PageHeading({ title, children, actions }) {
  return (
    <header className="page-heading">
      <div>
        <h1 tabIndex="-1">{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

function Status({ children }) {
  return (
    <p className="status" role="status">
      {children}
    </p>
  );
}

function AppShell({ preferences, onPreferencesChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);
  const title = titles[location.pathname] ?? "ClearView";
  return (
    <div
      className={`app-shell ${preferences.text === "Large" ? "is-text-large" : ""} ${preferences.text === "Extra large" ? "is-text-extra-large" : ""} ${preferences.contrast === "On" ? "is-high-contrast" : ""} ${preferences.clutter === "On" ? "is-reduced-clutter" : ""} ${preferences.color === "Warm" ? "is-warm" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="mobile-header">
        <strong>ClearView</strong>
        <span>{title}</span>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close menu" : "Open menu"}
        </button>
      </header>
      <aside className="sidebar">
        <NavLink className="brand" to="/dashboard">
          ClearView
        </NavLink>
        <nav aria-label="Primary navigation">
          <Navigation />
        </nav>
      </aside>
      <nav
        className={`mobile-navigation ${menuOpen ? "mobile-navigation--open" : ""}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        <Navigation />
      </nav>
      <main className="page-content" id="main-content" tabIndex="-1">
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard preferences={preferences} />}
          />
          <Route path="/visits" element={<Visits />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/records" element={<MedicalNotes />} />
          <Route
            path="/settings"
            element={
              <Settings
                preferences={preferences}
                onPreferencesChange={onPreferencesChange}
              />
            }
          />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </main>
      <nav className="bottom-navigation" aria-label="Primary navigation">
        <Navigation />
      </nav>
    </div>
  );
}

function Navigation() {
  return (
    <ul>
      {navigationItems.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to}>{item.label}</NavLink>
        </li>
      ))}
    </ul>
  );
}

function Dashboard({ preferences }) {
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading title="Good morning, Maya">Thursday, October 14</PageHeading>
      <Status>{notice}</Status>
      <div className="dashboard-grid">
        <div className="dashboard-primary">
          <section className="panel" aria-labelledby="next-appointment">
            <h2 id="next-appointment">Next appointment</h2>
            <h3>Dr. Elena Martinez</h3>
            <p>Cardiology · Oct 20 · 10:30 AM</p>
            <button type="button" onClick={() => navigate("/visits")}>
              View details
            </button>
          </section>
          <section
            className="preferences-summary"
            aria-labelledby="preference-summary"
          >
            <h2 id="preference-summary">Accessibility preferences</h2>
            <p>
              {preferences.text} text · High contrast{" "}
              {preferences.contrast.toLowerCase()} · Reduced clutter{" "}
              {preferences.clutter.toLowerCase()}
            </p>
            <button
              className="button-secondary"
              type="button"
              onClick={() => navigate("/settings")}
            >
              Open settings
            </button>
          </section>
        </div>
        <section className="quick-access" aria-labelledby="quick-access">
          <h2 id="quick-access">Quick access</h2>
          <div className="quick-access__grid">
            <button type="button" onClick={() => navigate("/messages")}>
              Messages · 2 unread
            </button>
            <button type="button" onClick={() => navigate("/records")}>
              Medical Notes · 3 recent
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice("Prescriptions are not available in this prototype.")
              }
            >
              Prescriptions
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice("Referrals are not available in this prototype.")
              }
            >
              Referrals
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function Visits() {
  const [selected, setSelected] = useState(appointments[0]);
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading
        title="Appointments"
        actions={
          <>
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                setNotice("Filter options are not available in this prototype.")
              }
            >
              Filter
            </button>
            <button
              className="desktop-only"
              type="button"
              onClick={() =>
                setNotice("Scheduling is not available in this prototype.")
              }
            >
              Schedule appointment
            </button>
          </>
        }
      />
      <Status>{notice}</Status>
      <div className="master-detail">
        <section className="master-list" aria-labelledby="upcoming-visits">
          <h2 id="upcoming-visits">Upcoming</h2>
          {appointments.map((appointment) => (
            <button
              className={`list-card ${selected.id === appointment.id ? "list-card--selected" : ""}`}
              type="button"
              aria-pressed={selected.id === appointment.id}
              key={appointment.id}
              onClick={() => setSelected(appointment)}
            >
              <span>
                {appointment.date} · {appointment.clinician}
              </span>
              <strong>{appointment.status}</strong>
            </button>
          ))}
          <button
            className="mobile-only"
            type="button"
            onClick={() =>
              setNotice("Scheduling is not available in this prototype.")
            }
          >
            Schedule appointment
          </button>
        </section>
        <AppointmentDetail appointment={selected} onNotice={setNotice} />
      </div>
    </>
  );
}

function AppointmentDetail({ appointment, onNotice }) {
  return (
    <article className="detail-panel" aria-labelledby="appointment-detail">
      <h2 id="appointment-detail">Appointment details</h2>
      <h3>{appointment.title}</h3>
      <p>{appointment.clinician}</p>
      <p>
        {appointment.date} · {appointment.time}
      </p>
      <p>{appointment.place}</p>
      <p>Bring your medication list and arrive 15 minutes early.</p>
      <div className="detail-actions">
        <button
          className="button-secondary"
          type="button"
          onClick={() =>
            onNotice("Directions are not available in this prototype.")
          }
        >
          Get directions
        </button>
        <button
          className="button-secondary"
          type="button"
          onClick={() =>
            onNotice("Rescheduling is not available in this prototype.")
          }
        >
          Reschedule
        </button>
      </div>
    </article>
  );
}

function Messages() {
  const [selected, setSelected] = useState(messages[0]);
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading
        title="Messages"
        actions={
          <button
            type="button"
            onClick={() =>
              setNotice(
                "Composing a message is not available in this prototype.",
              )
            }
          >
            Compose
          </button>
        }
      />
      <p className="unread">2 unread</p>
      <Status>{notice}</Status>
      <div className="master-detail">
        <section className="master-list" aria-label="Message list">
          {messages.map((message) => (
            <button
              className={`list-card ${selected.id === message.id ? "list-card--selected" : ""}`}
              type="button"
              aria-pressed={selected.id === message.id}
              key={message.id}
              onClick={() => setSelected(message)}
            >
              <strong>{message.sender}</strong>
              <span>{message.subject}</span>
              <small>{message.date}</small>
            </button>
          ))}
        </section>
        <article className="detail-panel" aria-labelledby="message-detail">
          <p className="eyebrow">{selected.sender}</p>
          <h2 id="message-detail">{selected.subject}</h2>
          <p>{selected.preview}</p>
          <div className="detail-actions">
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                setNotice("Lab results are not available in this prototype.")
              }
            >
              View lab results
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice("Replying is not available in this prototype.")
              }
            >
              Reply
            </button>
          </div>
        </article>
      </div>
    </>
  );
}

function MedicalNotes() {
  const [selected, setSelected] = useState(notes[0]);
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading
        title="Medical Notes"
        actions={
          <button
            className="button-secondary"
            type="button"
            onClick={() =>
              setNotice("Filter options are not available in this prototype.")
            }
          >
            Filter
          </button>
        }
      />
      <Status>{notice}</Status>
      <div className="master-detail">
        <section className="master-list" aria-labelledby="recent-notes">
          <h2 id="recent-notes">Recent notes</h2>
          {notes.map((note) => (
            <button
              className={`list-card ${selected.id === note.id ? "list-card--selected" : ""}`}
              type="button"
              aria-pressed={selected.id === note.id}
              key={note.id}
              onClick={() => setSelected(note)}
            >
              <strong>{note.title}</strong>
              <span>{note.clinician}</span>
              <small>{note.date}</small>
            </button>
          ))}
        </section>
        <article className="detail-panel" aria-labelledby="note-detail">
          <h2 id="note-detail">{selected.title}</h2>
          <h3>Summary</h3>
          <p>{selected.summary}</p>
          <h3>Assessment</h3>
          <p>{selected.assessment}</p>
          <h3>Plan</h3>
          <p>{selected.plan}</p>
          <button
            className="button-secondary"
            type="button"
            onClick={() =>
              setNotice(
                "Messaging the care team is not available in this prototype.",
              )
            }
          >
            Message care team
          </button>
        </article>
      </div>
    </>
  );
}

function Settings({ preferences, onPreferencesChange }) {
  const update = (key, values) =>
    onPreferencesChange((current) => ({
      ...current,
      [key]: values[(values.indexOf(current[key]) + 1) % values.length],
    }));
  const reset = () => onPreferencesChange(defaultPreferences);
  const options = [
    {
      key: "text",
      label: "Text size",
      description: "Adjust text across the app",
      values: ["Standard", "Large", "Extra large"],
    },
    {
      key: "contrast",
      label: "High contrast",
      description: "Increase contrast for controls",
      values: ["Off", "On"],
    },
    {
      key: "clutter",
      label: "Reduced clutter",
      description: "Show fewer secondary items",
      values: ["Off", "On"],
    },
    {
      key: "color",
      label: "Color preference",
      description: "Use a calmer accent palette",
      values: ["Cool", "Warm"],
    },
  ];
  return (
    <>
      <PageHeading title="Accessibility Settings">
        Make CareConnect easier to see and use.
      </PageHeading>
      <div className="settings-layout">
        <section
          className="settings-list"
          aria-label="Accessibility preferences"
        >
          {options.map((option) => (
            <button
              className="preference-card"
              type="button"
              key={option.key}
              onClick={() => update(option.key, option.values)}
            >
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
              <b>{preferences[option.key]}</b>
            </button>
          ))}
          <button
            className="button-secondary reset-button"
            type="button"
            onClick={reset}
          >
            Reset preferences
          </button>
        </section>
        <aside className="live-preview" aria-labelledby="preview-title">
          <h2 id="preview-title">Live preview</h2>
          <p>Dr. Elena Martinez</p>
          <p>Oct 20 · 10:30 AM</p>
          <strong>Confirmed</strong>
        </aside>
      </div>
    </>
  );
}

function SignIn() {
  const navigate = useNavigate();
  return (
    <main className="sign-in" id="main-content">
      <section className="sign-in__panel" aria-labelledby="sign-in-heading">
        <div className="sign-in__brand">
          <p>CareConnect</p>
          <strong>ClearView</strong>
          <span>Care information designed to be easier to see and use.</span>
        </div>
        <div className="sign-in__content">
          <p className="eyebrow">Care recipient portal</p>
          <h1 id="sign-in-heading" tabIndex="-1">
            Welcome to ClearView
          </h1>
          <p>
            Review your visits, messages, and care information in one place.
          </p>
          <button type="button" onClick={() => navigate("/dashboard")}>
            Sign in
          </button>
          <small>
            This educational prototype uses synthetic information only.
          </small>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [preferences, setPreferences] = useState(defaultPreferences);

  return (
    <>
      <DocumentTitle />
      <RouteFocus />
      <Routes>
        <Route path="/" element={<Navigate replace to="/sign-in" />} />
        <Route path="/login" element={<Navigate replace to="/sign-in" />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="*"
          element={
            <AppShell
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
