import { CalendarPlus, LayoutList, LogOut, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Brand from "./Brand";

export default function Layout() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.replace("/");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="main-nav" aria-label="Main navigation">
            {user ? (
              <>
                <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <LayoutList size={18} aria-hidden="true" /> Events
                </NavLink>
                <NavLink to="/events/new" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <CalendarPlus size={18} aria-hidden="true" /> Add event
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <UserRound size={18} aria-hidden="true" /> My Profile
                </NavLink>
                <span className="signed-in-user" title={`Signed in as ${user.email}`}>{user.fullName}</span>
                <button type="button" className="nav-link nav-button" onClick={handleLogout}>
                  <LogOut size={18} aria-hidden="true" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Log in</NavLink>
                <NavLink to="/register" className="button button-small">Create account</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <strong>CampusSync</strong>
          <span>COMP229 · Group 7 · Project Part 2</span>
        </div>
        <span>Plan clearly. Meet on campus.</span>
      </footer>
    </div>
  );
}
