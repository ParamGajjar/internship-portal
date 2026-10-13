import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const formatStatusClass = (status = "") =>
  status.toLowerCase().replace(/\s+/g, "-");

const MyApplications = () => {
  const { isAuthorized, user } = useContext(Context);
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
        toast.error(error.response?.data?.message || "Failed to load applications.");
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
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading your applications...</h3></div></div>;

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Application Tracker</span>
          <h1>Every internship application, one organized view</h1>
        </div>
        <p>
          Follow recruiter activity, monitor interview updates, and keep your
          internship search measurable.
        </p>
      </div>

      {applications.length ? (
        <div className="application-grid">
          {applications.map((application) => (
            <article className="application-card" key={application._id}>
              <div className="application-header">
                <div>
                  <h3>{application.internship?.title || "Internship Opportunity"}</h3>
                  <p>{application.company?.name || "Company"} · {application.internship?.location || "Location TBD"}</p>
                </div>
                <span className={`status-pill ${formatStatusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>

              <div className="card-meta">
                <span className="meta-chip">
                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                </span>
                {application.internship?.type && (
                  <span className="meta-chip">{application.internship.type}</span>
                )}
              </div>

              <p>{application.coverLetter || "Your cover letter was submitted with this application."}</p>

              {application.interview?.scheduled && (
                <div className="detail-list">
                  <div className="detail-row">
                    <div>
                      <h4>Interview details</h4>
                      <p>
                        {application.interview.date
                          ? new Date(application.interview.date).toLocaleString()
                          : "Date to be confirmed"}
                      </p>
                      <p>{application.interview.mode || "Mode not specified"}</p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Explore the internship marketplace and submit your first application.</p>
          <Link to="/internships" className="button">
            Browse Internships
          </Link>
        </div>
      )}
    </section>
  );
};

export default MyApplications;
