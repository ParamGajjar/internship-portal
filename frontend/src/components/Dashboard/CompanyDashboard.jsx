import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const CompanyDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [internshipResponse, applicationResponse] = await Promise.all([
          axios.get(`${API_URL}/internship/my-internships`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/application/company-applications`, {
            withCredentials: true,
          }),
        ]);

        setInternships(internshipResponse.data.internships || []);
        setApplications(applicationResponse.data.applications || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load company dashboard.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && user?.role === "Company") {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [API_URL, isAuthorized, user]);

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Company") return <Navigate to="/" />;
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading company dashboard...</h3></div></div>;

  const activeInternships = internships.filter((item) => item.status === "Open").length;
  const shortlisted = applications.filter((item) => item.status === "Shortlisted").length;
  const interviewScheduled = applications.filter(
    (item) => item.status === "Interview Scheduled"
  ).length;
  const selected = applications.filter((item) => item.status === "Selected").length;

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <span className="eyebrow">Company Dashboard</span>
        <h1>{user?.name}, manage your internship hiring pipeline in one place.</h1>
        <p>
          Post internships, review applicants, update statuses, and keep your
          campus hiring process organized from shortlist to final selection.
        </p>
      </div>

      <div className="dashboard-stats">
        <article className="metric-card">
          <span>Total Roles</span>
          <strong>{internships.length}</strong>
          <p>internships published through your company account</p>
        </article>
        <article className="metric-card">
          <span>Open Roles</span>
          <strong>{activeInternships}</strong>
          <p>opportunities currently visible to students</p>
        </article>
        <article className="metric-card">
          <span>Applicants</span>
          <strong>{applications.length}</strong>
          <p>student applications flowing through recruitment</p>
        </article>
        <article className="metric-card">
          <span>Selected</span>
          <strong>{selected}</strong>
          <p>candidates moved into final internship outcomes</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="page-header">
            <div>
              <span className="eyebrow">Recruitment Snapshot</span>
              <h1>Where your candidates stand today</h1>
            </div>
            <Link to="/company/applicants" className="button-ghost">
              Review Applicants
            </Link>
          </div>

          <div className="progress-list">
            <div className="progress-row">
              <div>
                <h4>Shortlisted</h4>
                <p>Strong candidates ready for deeper evaluation and coordination.</p>
              </div>
              <span className="status-pill shortlisted">{shortlisted}</span>
            </div>
            <div className="progress-row">
              <div>
                <h4>Interviews scheduled</h4>
                <p>Applicants currently lined up for the next screening stage.</p>
              </div>
              <span className="status-pill interview-scheduled">{interviewScheduled}</span>
            </div>
            <div className="progress-row">
              <div>
                <h4>Final selections</h4>
                <p>Students successfully chosen for internship offers.</p>
              </div>
              <span className="status-pill selected">{selected}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Quick Actions</h2>
          <div className="quick-links">
            <Link to="/company/post-internship" className="quick-link">
              <div>
                <h4>Post a new internship</h4>
                <p>Launch a new opportunity with role details, stipend, duration, and deadline.</p>
              </div>
            </Link>
            <Link to="/company/my-internships" className="quick-link">
              <div>
                <h4>Manage published roles</h4>
                <p>Keep your active and closed internships clean and up to date.</p>
              </div>
            </Link>
            <Link to="/company/applicants" className="quick-link">
              <div>
                <h4>Update candidate status</h4>
                <p>Move students through review, shortlist, interview, and selection stages.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyDashboard;
