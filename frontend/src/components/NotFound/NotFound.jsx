import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="notfound-page">
      <div className="notfound-card">
        <img src="/notfound.png" alt="Page not found" />
        <div className="notfound-copy">
          <span className="eyebrow">404</span>
          <h1>This page is outside the internship map</h1>
          <p>
            The page you requested could not be found. Head back to the portal
            home or continue exploring internships from the main marketplace.
          </p>
          <div className="detail-actions">
            <Link to="/" className="button">
              Return Home
            </Link>
            <Link to="/internships" className="button-ghost">
              Browse Internships
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
