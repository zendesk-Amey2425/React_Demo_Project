import { NavLink } from 'react-router-dom';

/**
 * Main navigation component.
 * Uses NavLink for automatic active state styling based on current route.
 */
export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <h2 className="nav-logo">Task Manager</h2>
        <ul className="nav-links">
          <li>
            {/* NavLink automatically applies 'active' class when on matching route */}
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Stats
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
