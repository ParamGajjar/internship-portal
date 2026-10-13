import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowTrendingUp, HiOutlineBuildingOffice2, HiOutlineCalendarDays, HiOutlineUserGroup } from "react-icons/hi2";

const HeroSection = () => {
  return (
    <section className="heroSection">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Centralized Internship Network</span>
          <h1>
            Connect <span>students</span>, companies, and colleges on one smart portal
          </h1>
          <p>
            InternBridge helps students find internships, helps recruiters hire
            efficiently, and helps colleges monitor outcomes with a shared,
            modern workflow built for internship operations.
          </p>

          <div className="hero-actions">
            <Link to="/internships" className="button">
              Explore Internships
            </Link>
            <Link to="/register" className="button-secondary">
              Create Portal Account
            </Link>
          </div>

          <div className="hero-metrics">
            <div className="metric-chip">
              <strong>One</strong>
              <span>shared workflow</span>
            </div>
            <div className="metric-chip">
              <strong>Three</strong>
              <span>stakeholder dashboards</span>
            </div>
            <div className="metric-chip">
              <strong>End-to-end</strong>
              <span>application tracking</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-top">
            <div>
              <span className="eyebrow">Internship Command Center</span>
              <h3>Everything moves faster when everyone sees the same pipeline</h3>
            </div>
            <HiOutlineArrowTrendingUp size={28} />
          </div>

          <div className="visual-grid">
            <div className="visual-card">
              <span>Placement Overview</span>
              <strong>84%</strong>
              <p>students actively engaged in internship applications and tracking</p>
            </div>

            <div className="visual-card">
              <ul className="visual-list">
                <li>
                  <span>
                    <HiOutlineUserGroup /> Student applications
                  </span>
                  <strong>1.2k</strong>
                </li>
                <li>
                  <span>
                    <HiOutlineBuildingOffice2 /> Active recruiters
                  </span>
                  <strong>96</strong>
                </li>
                <li>
                  <span>
                    <HiOutlineCalendarDays /> Live hiring cycles
                  </span>
                  <strong>28</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
