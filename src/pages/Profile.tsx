import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import type { User } from "../types";

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const result = await apiRequest<{ user: User; message: string }>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ fullName, email }),
      }, token ?? undefined);
      updateUser(result.user);
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Profile could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await apiRequest("/users/me", { method: "DELETE" }, token ?? undefined);
      logout();
      navigate("/", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Account could not be deleted.");
      setConfirmOpen(false);
      setDeleting(false);
    }
  }

  return (
    <section className="profile-page page-container">
      <div className="profile-heading">
        <span className="section-label">ACCOUNT SETTINGS</span>
        <h1>Your profile</h1>
        <p>Read and update your account details, or remove your account.</p>
      </div>
      <div className="profile-grid">
        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Account details</h2>
          {message && <div className="alert alert-success" role="status">{message}</div>}
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <div className="form-field">
            <label htmlFor="profile-name">Full name</label>
            <input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={80} required />
          </div>
          <div className="form-field">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <button type="submit" className="button" disabled={busy}>{busy ? "Saving…" : "Update profile"}</button>
        </form>
        <aside className="account-summary">
          <h2>Account access</h2>
          <p>You are logged in as <strong>{user?.email}</strong>.</p>
          <p>Your login token expires after two hours. The API checks it on every protected request.</p>
          <hr />
          <h3>Delete account</h3>
          <p>This also deletes every event you created. This action cannot be undone.</p>
          <button type="button" className="button button-danger-outline" onClick={() => setConfirmOpen(true)}>Delete my account</button>
        </aside>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete your account?"
        message="Your profile and every event you created will be permanently deleted."
        confirmLabel="Delete account"
        busy={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
