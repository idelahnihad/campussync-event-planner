import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/events");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout page-container">
      <div className="auth-intro">
        <span className="section-label">WELCOME BACK</span>
        <h1>Your campus calendar is waiting.</h1>
        <p>Log in to view events and manage the events you created.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Log in</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <div className="form-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <button className="button button-full" type="submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
        <p className="form-switch">New to CampusSync? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
