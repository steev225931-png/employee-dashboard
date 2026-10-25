import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Search,
  Users,
  X,
} from 'lucide-react';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Dashboard({ employees, loading, error, onRetry }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
  }, [employees, searchTerm]);

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Employee dashboard</h1>
          <p className="page-description">
            Here’s what’s happening with your people today.
          </p>
        </div>
        <div className="date-chip">
          <span className="live-dot" />
          Live API data
        </div>
      </section>

      <section className="stats-grid" aria-label="Dashboard summary">
        <article className="stat-card">
          <div className="stat-icon purple"><Users size={20} /></div>
          <div className="stat-label">Total employees</div>
          <div className="stat-bottom">
            <strong>{loading ? '—' : employees.length}</strong>
            <span className="stat-note">API records</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon blue"><Mail size={20} /></div>
          <div className="stat-label">Email contacts</div>
          <div className="stat-bottom">
            <strong>{loading ? '—' : employees.filter((item) => item.email).length}</strong>
            <span className="stat-note">Available emails</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon green"><BriefcaseBusiness size={20} /></div>
          <div className="stat-label">Directory status</div>
          <div className="stat-bottom">
            <strong className="status-value">{loading ? 'Loading' : error ? 'Offline' : 'Connected'}</strong>
            <span className={`status-pill ${error ? 'status-error' : loading ? 'status-loading' : ''}`}>
              <span className="status-dot" /> {error ? 'Needs attention' : loading ? 'Fetching data' : 'Up to date'}
            </span>
          </div>
        </article>
      </section>

      <section className="content-card">
        <div className="card-heading">
          <div>
            <h2>People directory</h2>
            <p>Employee records retrieved from the external users API.</p>
          </div>
          <div className="directory-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                aria-label="Search employees"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name or email"
              />
              {searchTerm && (
                <button className="icon-button clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </div>
            <button className="refresh-button" onClick={onRetry} disabled={loading}>
              <ArrowDownToLine size={16} /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="state-panel">
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
            <h3>Loading employee directory</h3>
            <p>Getting the latest records from JSONPlaceholder…</p>
          </div>
        ) : error ? (
          <div className="state-panel error-panel">
            <div className="state-icon"><CircleHelp size={25} /></div>
            <h3>We couldn’t load the directory</h3>
            <p>{error}</p>
            <button className="primary-button" onClick={onRetry}>Try again <ArrowRight size={16} /></button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="state-panel">
            <div className="state-icon"><Search size={24} /></div>
            <h3>No employees found</h3>
            <p>Try searching with a different name or email address.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table employee-table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">EMPLOYEE</th>
                    <th scope="col">EMPLOYEE ID</th>
                    <th scope="col">EMAIL ADDRESS</th>
                    <th scope="col" className="text-end">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-person">
                          <div className={`avatar avatar-${((employee.id - 1) % 6) + 1}`}>
                            {initials(employee.name)}
                          </div>
                          <div>
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-company">{employee.company?.name || 'Directory member'}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="id-label">EMP-{String(employee.id).padStart(3, '0')}</span></td>
                      <td>
                        <a className="email-link" href={`mailto:${employee.email}`}>
                          {employee.email}
                        </a>
                      </td>
                      <td className="text-end"><span className="active-pill"><span />Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> records</span>
              <span className="source-label"><span className="source-dot" /> Source: JSONPlaceholder API</span>
            </div>
          </>
        )}
      </section>
      <p className="api-note">Demo directory data is provided by JSONPlaceholder and is for learning purposes.</p>
    </>
  );
}

function EmployeeForm() {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    location: '',
    salary: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter the employee name.';
    if (!form.designation.trim()) nextErrors.designation = 'Please enter a designation.';
    if (!form.location.trim()) nextErrors.location = 'Please enter a location.';
    if (form.salary === '' || Number(form.salary) < 0) nextErrors.salary = 'Enter a valid, non-negative salary.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      // Assignment note: no POST request or backend storage is required.
    }
  }

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">PEOPLE MANAGEMENT</div>
          <h1>Employee form</h1>
          <p className="page-description">Enter the details below to validate a new employee record.</p>
        </div>
        <div className="date-chip"><BriefcaseBusiness size={16} /> Employee details</div>
      </section>

      <div className="form-layout">
        <section className="content-card form-card">
          <div className="card-heading form-heading">
            <div>
              <h2>Basic information</h2>
              <p>Fields marked with <span className="required-star">*</span> are required.</p>
            </div>
            <div className="form-heading-icon"><Users size={22} /></div>
          </div>

          {submitted && (
            <div className="success-banner" role="status">
              <span className="success-icon"><Check size={17} /></span>
              <div>
                <strong>Form validated successfully</strong>
                <p>Your form is complete. As required, no data was sent to a backend.</p>
              </div>
              <button className="icon-button" onClick={() => setSubmitted(false)} aria-label="Dismiss message"><X size={17} /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field-group">
                <label htmlFor="name">Full name <span className="required-star">*</span></label>
                <input id="name" name="name" className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`} placeholder="e.g. Alex Johnson" value={form.name} onChange={updateField} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="field-group">
                <label htmlFor="designation">Designation <span className="required-star">*</span></label>
                <input id="designation" name="designation" className={`form-control custom-input ${errors.designation ? 'is-invalid' : ''}`} placeholder="e.g. Software Engineer" value={form.designation} onChange={updateField} />
                {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
              </div>
              <div className="field-group">
                <label htmlFor="location">Location <span className="required-star">*</span></label>
                <div className="input-with-icon">
                  <MapPin size={17} />
                  <input id="location" name="location" className={`form-control custom-input ${errors.location ? 'is-invalid' : ''}`} placeholder="e.g. Kochi, Kerala" value={form.location} onChange={updateField} />
                </div>
                {errors.location && <div className="invalid-feedback d-block">{errors.location}</div>}
              </div>
              <div className="field-group">
                <label htmlFor="salary">Salary (₹) <span className="required-star">*</span></label>
                <div className="salary-input">
                  <span>₹</span>
                  <input id="salary" name="salary" type="number" min="0" step="0.01" className={`form-control custom-input ${errors.salary ? 'is-invalid' : ''}`} placeholder="e.g. 45000" value={form.salary} onChange={updateField} />
                </div>
                {errors.salary && <div className="invalid-feedback d-block">{errors.salary}</div>}
              </div>
            </div>

            <div className="form-info"><CircleHelp size={16} /> This assignment requires frontend form validation only. Data will not be posted.</div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => { setForm({ name: '', designation: '', location: '', salary: '' }); setErrors({}); setSubmitted(false); }}>
                Clear form
              </button>
              <button type="submit" className="primary-button">Validate employee <ArrowRight size={16} /></button>
            </div>
          </form>
        </section>

        <aside className="form-aside">
          <div className="aside-art"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><Users size={42} /></div>
          <div className="aside-copy">
            <div className="eyebrow">QUICK NOTE</div>
            <h3>Good data starts here.</h3>
            <p>Use clear employee details and check every required field before submitting the form.</p>
            <div className="aside-check"><Check size={16} /> All fields are required</div>
            <div className="aside-check"><Check size={16} /> Salary must be zero or more</div>
            <div className="aside-check"><Check size={16} /> No backend connection needed</div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  async function loadEmployees() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}.`);
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError('Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/" className="brand" aria-label="PeopleDesk home">
          <div className="brand-mark"><Users size={21} /></div>
          <div className="brand-name">people<span>desk</span><small>EMPLOYEE PORTAL</small></div>
        </NavLink>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <LayoutDashboard size={19} /> <span>Home</span>
            <span className="nav-active-indicator" />
          </NavLink>
          <NavLink to="/employee-form" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <Users size={19} /> <span>Employee form</span>
            <span className="nav-active-indicator" />
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <strong>Need a hand?</strong>
            <p>This dashboard is a frontend demo for your assignment.</p>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">AD</div>
            <div className="profile-info"><strong>Admin User</strong><span>Workspace admin</span></div>
            <ChevronDown size={16} className="profile-chevron" />
          </div>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{location.pathname === '/employee-form' ? 'Employee form' : 'Home'}</strong></div>
          <div className="topbar-right">
            <div className="topbar-status"><span className="live-dot" /> System operational</div>
            <div className="topbar-avatar">AD</div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard employees={employees} loading={loading} error={error} onRetry={loadEmployees} />} />
            <Route path="/employee-form" element={<EmployeeForm />} />
            <Route path="*" element={<div className="content-card not-found"><h2>Page not found</h2><p>The page you are looking for does not exist.</p><NavLink to="/" className="primary-button">Return home <ArrowRight size={16} /></NavLink></div>} />
          </Routes>
          <footer className="app-footer">
            <span>© 2026 PeopleDesk</span>
            <span>Built with React <span className="footer-heart">♥</span> for learning</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
