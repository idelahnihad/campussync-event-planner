import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="empty-state page-container not-found">
      <span className="section-label">404</span>
      <h1>This page is not on the calendar.</h1>
      <p>The address may be incorrect, or the page may have moved.</p>
      <Link className="button" to="/">Return home</Link>
    </section>
  );
}
