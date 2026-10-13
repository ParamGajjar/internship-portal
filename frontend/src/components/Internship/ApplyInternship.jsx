import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const ApplyInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/application/apply`,
        { internshipId: id, coverLetter },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Application submitted successfully.");
      navigate("/student/applications");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Student") return <Navigate to="/" />;

  return (
    <section className="page-shell">
      <div className="form-card">
        <div className="page-header">
          <div>
            <span className="eyebrow">Student Application</span>
            <h1>Submit your internship application</h1>
          </div>
          <p>
            Write a focused cover letter that highlights your interest, relevant
            skills, and readiness for the role.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              rows="10"
              placeholder="Introduce yourself, explain why this internship fits your goals, and mention the skills or projects that make you a strong candidate."
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              required
            />
          </div>

          <div className="detail-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ApplyInternship;
