import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const formatStatusClass = (status = "") =>
  status.toLowerCase().replace(/\s+/g, "-");

const StudentDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/application/my-applications`, {
          withCredentials: true,
        });
        setApplications(data.applications || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load student dashboard.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && user?.role === "Student") {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [API_URL, isAuthorized, user]);

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Student") return <Navigate to="/" />;
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading your dashboard...</h3></div></div>;

  const statusCounts = {
    total: applications.length,
    applied: applications.filter((item) => item.status === "Applied").length,
    review: applications.filter((item) => item.status === "Under Review").length,
    shortlisted: applications.filter((item) => item.status === "Shortlisted").length,
    selected: applications.filter((item) => item.status === "Selected").length,
  };

  const recentApplications = applications.slice(0, 4);

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <span className="eyebrow">Student Dashboard</span>
        <h1>{user?.name}, your internship journey is organized here.</h1>
        <p>
          Track applications, keep an eye on recruiter updates, and move from
          exploration to selection with a single workflow.
        </p>
      </div>

      <div className="dashboard-stats">
        <article className="metric-card">
          <span>Total</span>
          <strong>{statusCounts.total}</strong>
          <p>applications tracked across your portal account</p>
        </article>
        <article className="metric-card">
          <span>Applied</span>
          <strong>{statusCounts.applied}</strong>
          <p>roles you have already submitted</p>
        </article>
        <article className="metric-card">
          <span>Review</span>
          <strong>{statusCounts.review}</strong>
          <p>applications actively under evaluation</p>
        </article>
        <article className="metric-card">
          <span>Selected</span>
          <strong>{statusCounts.selected}</strong>
          <p>successful outcomes already achieved</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="page-header">
            <div>
              <span className="eyebrow">Recent Activity</span>
              <h1>Latest application updates</h1>
            </div>
            <Link to="/student/applications" className="button-ghost">
              View All
            </Link>
          </div>

          {recentApplications.length ? (
            <div className="application-list">
              {recentApplications.map((application) => (
                <div className="application-row" key={application._id}>
                  <div>
                    <h4>{application.internship?.title || "Internship Opportunity"}</h4>
                    <p>{application.company?.name || "Company"} · {application.internship?.location || "Location TBD"}</p>
                    <p>Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-pill ${formatStatusClass(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>Start by exploring internships that match your career direction.</p>
              <Link to="/internships" className="button">
                Browse Internships
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <h2>Quick Actions</h2>
          <div className="quick-links">
            <Link to="/internships" className="quick-link">
              <div>
                <h4>Explore internships</h4>
                <p>Search open opportunities by category, stipend, location, and duration.</p>
              </div>
            </Link>
            <Link to="/student/applications" className="quick-link">
              <div>
                <h4>Track every application</h4>
                <p>Check your full pipeline including review, shortlist, and interview stages.</p>
              </div>
            </Link>
          </div>

          <h2 style={{ marginTop: "18px" }}>Progress Snapshot</h2>
          <div className="progress-list">
            <div className="progress-row">
              <div>
                <h4>Shortlisted roles</h4>
                <p>Roles where your profile is moving closer to interview or final selection.</p>
              </div>
              <span className="status-pill shortlisted">{statusCounts.shortlisted}</span>
            </div>
            <div className="progress-row">
              <div>
                <h4>Career momentum</h4>
                <p>Keep refining applications and cover letters to improve conversion.</p>
              </div>
              <span className="status-pill active">Live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
