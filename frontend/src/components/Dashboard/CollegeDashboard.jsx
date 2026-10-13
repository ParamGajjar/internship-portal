import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const initialStats = { totalStudents: 0, totalCompanies: 0, totalInternships: 0, selectedStudents: 0 };

const CollegeDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const [stats, setStats] = useState(initialStats);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/dashboard/college`, {
          withCredentials: true,
        });

        if (data?.stats) {
          setStats(data.stats);
        }
        const updatesResponse = await axios.get(`${API_URL}/college/updates`, { withCredentials: true });
        setUpdates(updatesResponse.data.updates || []);
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || "Failed to load college dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && user?.role === "College") {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [API_URL, isAuthorized, user]);

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "College") return <Navigate to="/" />;
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading college dashboard...</h3></div></div>;

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <span className="eyebrow">College Dashboard</span>
        <h1>{user?.name}, oversee internship participation with clarity.</h1>
        <p>
          Placement teams can use this portal to monitor student engagement,
          employer involvement, and internship outcomes without juggling
          separate systems.
        </p>
      </div>

      <div className="dashboard-stats">
        <article className="metric-card">
          <span>Students</span>
          <strong>{stats.totalStudents}</strong>
          <p>learners connected to the internship ecosystem</p>
        </article>
        <article className="metric-card">
          <span>Companies</span>
          <strong>{stats.totalCompanies}</strong>
          <p>recruiters and hiring partners on the platform</p>
        </article>
        <article className="metric-card">
          <span>Internships</span>
          <strong>{stats.totalInternships}</strong>
          <p>roles available for student applications and tracking</p>
        </article>
        <article className="metric-card">
          <span>Selected</span>
          <strong>{stats.selectedStudents}</strong>
          <p>students who have reached successful outcomes</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h2>Private company updates</h2>
          <p>These progress notes are visible to college accounts only.</p>
          {updates.length ? <div className="progress-list">{updates.map((update) => (
            <div className="progress-row" key={update._id}>
              <div>
                <h4>{update.student?.name || "Student"} · {update.internship?.title || "Internship"}</h4>
                <p>{update.message}</p>
                <small>{update.company?.companyProfile?.companyName || update.company?.name} · {new Date(update.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}</div> : <div className="empty-state"><p>No company updates have been sent to this college yet.</p></div>}
        </div>
        <div className="dashboard-panel">
          <h2>Institution Overview</h2>
          <div className="detail-list">
            <div className="detail-row">
              <div>
                <h4>College name</h4>
                <p>{user?.collegeProfile?.collegeName || user?.name || "Institution account"}</p>
              </div>
            </div>
            <div className="detail-row">
              <div>
                <h4>Primary contact</h4>
                <p>{user?.email || "Not available"} · {user?.phone || "No phone added"}</p>
              </div>
            </div>
            <div className="detail-row">
              <div>
                <h4>Portal objective</h4>
                <p>Centralize student applications, company engagement, and internship progress oversight.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Placement Workflow</h2>
          <div className="progress-list">
            <div className="progress-row">
              <div>
                <h4>Student onboarding</h4>
                <p>Encourage complete profiles and early internship readiness.</p>
              </div>
              <span className="status-pill active">Live</span>
            </div>
            <div className="progress-row">
              <div>
                <h4>Recruiter engagement</h4>
                <p>Support companies publishing structured internship opportunities.</p>
              </div>
              <span className="status-pill shortlisted">Ongoing</span>
            </div>
            <div className="progress-row">
              <div>
                <h4>Outcome monitoring</h4>
                <p>Track shortlist, interview, selection, and completion milestones.</p>
              </div>
              <span className="status-pill selected">Visible</span>
            </div>
          </div>

          <div className="quick-links" style={{ marginTop: "18px" }}>
            <Link to="/internships" className="quick-link">
              <div>
                <h4>View internship marketplace</h4>
                <p>See the opportunities currently active for your students.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollegeDashboard;
