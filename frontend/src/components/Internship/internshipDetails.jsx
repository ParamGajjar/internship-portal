import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const formatStipend = (stipend) => (stipend ? `Rs ${stipend.toLocaleString()}/month` : "Unpaid");

const InternshipDetails = () => {
  const { id } = useParams();
  const { isAuthorized, user } = useContext(Context);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/${id}`, {
          withCredentials: true,
        });
        setInternship(data.internship);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load internship.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [API_URL, id]);

  if (!isAuthorized) return <Navigate to="/login" />;

  if (loading) {
    return (
      <section className="page-shell">
        <div className="empty-state">
          <h3>Loading internship details...</h3>
        </div>
      </section>
    );
  }

  if (!internship) {
    return (
      <section className="page-shell">
        <div className="empty-state">
          <h3>Internship not found</h3>
          <p>The role may have been removed or is no longer available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="details-card hero-copy">
        <span className="eyebrow">Internship Details</span>
        <h1>{internship.title}</h1>
        <p>
          Review the opportunity details, expectations, and application
          timeline before moving forward.
        </p>

        <div className="detail-grid">
          <div className="detail-row">
            <h4>Company</h4>
            <p>{internship.postedBy?.name || "Company"}</p>
          </div>
          <div className="detail-row">
            <h4>Category</h4>
            <p>{internship.category}</p>
          </div>
          <div className="detail-row">
            <h4>Location</h4>
            <p>{internship.location}</p>
          </div>
          <div className="detail-row">
            <h4>Type</h4>
            <p>{internship.type}</p>
          </div>
          <div className="detail-row">
            <h4>Duration</h4>
            <p>{internship.duration}</p>
          </div>
          <div className="detail-row">
            <h4>Stipend</h4>
            <p>{formatStipend(internship.stipend)}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{internship.description}</p>
        </div>

        <div className="detail-section">
          <h2>Application Deadline</h2>
          <p>
            {internship.applicationDeadline
              ? new Date(internship.applicationDeadline).toLocaleDateString()
              : "Open until filled"}
          </p>
        </div>

        <div className="detail-actions">
          {user?.role === "Student" && (
            <Link to={`/internships/${id}/apply`} className="button">
              Apply for Internship
            </Link>
          )}

          <Link to="/internships" className="button-ghost">
            Back to Internships
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InternshipDetails;
