import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await register(fullName, email, password);
      navigate("/events");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout page-container">
      <div className="auth-intro">
        <span className="section-label">JOIN CAMPUSSYNC</span>
        <h1>Make the next campus event happen.</h1>
        <p>One account lets you create events and control your own event records.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <div className="form-field">
          <label htmlFor="register-name">Full name</label>
          <input id="register-name" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={80} required />
        </div>
        <div className="form-field">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          <small>At least 8 characters.</small>
        </div>
        <div className="form-field">
          <label htmlFor="register-confirm">Confirm password</label>
          <input id="register-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required />
        </div>
        <button className="button button-full" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
        <p className="form-switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </section>
  );
}
