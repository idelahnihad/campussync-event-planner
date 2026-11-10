import { ArrowRight, CalendarCheck2, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="home-hero page-container">
        <div className="hero-copy">
          <span className="section-label">GROUP 7 · COMP229</span>
          <h1>Campus plans,<br />finally in one place.</h1>
          <p>
            CampusSync helps students share workshops, club meetings, sports,
            and academic events without complicated event-management tools.
          </p>
          <div className="hero-actions">
            <Link className="button" to={user ? "/events" : "/register"}>
              {user ? "Open event dashboard" : "Start planning"} <ArrowRight size={19} aria-hidden="true" />
            </Link>
            {!user && <Link className="text-link" to="/login">I already have an account</Link>}
          </div>
        </div>
        <div className="hero-calendar" aria-label="Example campus event">
          <div className="calendar-topline">
            <span>DECEMBER</span>
            <CalendarCheck2 size={28} aria-hidden="true" />
          </div>
          <div className="calendar-number">10</div>
          <div className="calendar-event">
            <span className="category-label">WORKSHOP</span>
            <h2>API Testing Workshop</h2>
            <p><Clock3 size={18} aria-hidden="true" /> 1:30 PM</p>
            <p><MapPin size={18} aria-hidden="true" /> Room B204</p>
          </div>
          <span className="calendar-note">Create. Share. Meet.</span>
        </div>
      </section>
      <section className="home-strip">
        <div className="page-container strip-grid">
          <span className="section-label">SIMPLE BY DESIGN</span>
          <p>Create an event in under a minute.</p>
          <p>See the date, time, and location at a glance.</p>
          <p>Edit or remove your own events when plans change.</p>
        </div>
      </section>
    </>
  );
}
