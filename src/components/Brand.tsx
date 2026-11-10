import { Link } from "react-router";

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="CampusSync home">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-pin" />
      </span>
      <span>
        <strong>CampusSync</strong>
        <small>Campus Event Planner</small>
      </span>
    </Link>
  );
}
