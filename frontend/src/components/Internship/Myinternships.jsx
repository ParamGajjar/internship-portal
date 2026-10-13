import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const statusClass = (value = "") => value.toLowerCase().replace(/\s+/g, "-");
const formatStipend = (stipend) => (stipend ? `Rs ${stipend.toLocaleString()}/month` : "Unpaid");

const MyInternships = () => {
  const { isAuthorized, user } = useContext(Context);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchMyInternships = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/my-internships`, {
          withCredentials: true,
        });
        setInternships(data.internships || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load internships.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && user?.role === "Company") {
      fetchMyInternships();
    } else {
      setLoading(false);
    }
  }, [API_URL, isAuthorized, user]);

  const deleteInternship = async (id) => {
    const confirmed = window.confirm("Delete this internship from the portal?");
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(`${API_URL}/internship/delete/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message || "Internship deleted successfully.");
      setInternships((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete internship.");
    }
  };

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Company") return <Navigate to="/" />;
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading your internships...</h3></div></div>;

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Published Roles</span>
          <h1>Manage every internship your company has posted</h1>
        </div>
        <Link to="/company/post-internship" className="post-btn">
          Post New Internship
        </Link>
      </div>

      {internships.length ? (
        <div className="internship-grid">
          {internships.map((internship) => (
            <article className="internship-card" key={internship._id}>
              <div className="application-header">
                <div>
                  <h3>{internship.title}</h3>
                  <p>{internship.category} · {internship.location}</p>
                </div>
                <span className={`status-pill ${statusClass(internship.status)}`}>
                  {internship.status}
                </span>
              </div>

              <div className="card-meta">
                <span className="meta-chip">{internship.type}</span>
                <span className="meta-chip">{internship.duration}</span>
                <span className="meta-chip">{formatStipend(internship.stipend)}</span>
              </div>

              <p>{internship.description?.slice(0, 150) || "Internship description not available."}</p>

              <div className="card-actions">
                <Link to={`/internships/${internship._id}`} className="view-btn">
                  View Role
                </Link>
                <Link
                  to={`/company/applicants?internship=${internship._id}`}
                  className="applicants-btn"
                >
                  View Applicants
                </Link>
                <button
                  type="button"
                  onClick={() => deleteInternship(internship._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No internships posted yet</h3>
          <p>Create your first internship to start receiving student applications.</p>
          <Link to="/company/post-internship" className="button">
            Post Internship
          </Link>
        </div>
      )}
    </section>
  );
};

export default MyInternships;
