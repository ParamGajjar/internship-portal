import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <strong>InternBridge</strong>
        <p>
          A centralized platform for students, companies, and colleges to
          streamline internship discovery, hiring, and progress tracking.
        </p>
      </div>

      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/internships">Internships</Link>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  );
};

export default Footer;
